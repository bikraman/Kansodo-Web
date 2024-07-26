import { useState, useEffect, useContext } from 'react';

import TaskNode from '../models/TaskNode.js'
import ItemClass from '../models/ItemClass.js';

import trash from './trash-can-regular.svg'
import plus from './plus-solid.svg'

import arrowCollapsed from './arrow_collapsed.png'
import arrowExpanded from './arrow_expanded.png'

import generateUUID from '../util/UUIDUtils.js';

import { DbContext } from '../App.js';


export default function TreeList({data, onDelete}) {

    const items = data.children
                .filter((element) => element.value.isVisible)
                .map ((element) => 
                        <ListItem key = {element.value.id} taskNode={element} deleteTask={(taskId) => {
                                onDelete(taskId)
                            }
                        }/>
                    )

    items.push(
        <CreateTaskListItem key = {generateUUID()} taskNode={new TaskNode(new ItemClass(generateUUID(), null, "Create task", 1))} deleteTask={(taskId) => {
                onDelete(taskId)
            }
        }/>
    )
    
    return (<div className='list-container'>{items}</div>);
}

const ListItem = ({ taskNode, deleteTask }) => {

    const db = useContext(DbContext);

    const [node, setNode] = useState(taskNode)
    const [task, setTask] = useState(taskNode.value)
    const [taskText, setTaskText] = useState(task.data)
    const [isExpanded, setIsExpanded] = useState(task.isExpanded ?? false);

    const [showMenu, setShowMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ xPos: 0, yPos: 0 });

    const handleCheckboxChange = (event) => {
        // Logic to handle checkbox change
        setIsCompleted(event.target.checked)
    };

    const handleTextChange = (event) => {
        // Logic to handle text change

        if (event.code === "Enter") {

            const tasksObjectStore = db.db.transaction("tasks", "readwrite").objectStore("tasks");

            const existingTaskRequest = tasksObjectStore.get(task.id)
            existingTaskRequest.onsuccess = (event) => {
                const existingTask = event.target.result;

                console.log(existingTask)

                existingTask.data = taskText;

                console.log(existingTask)

                const requestUpdate = tasksObjectStore.put(existingTask);

                requestUpdate.onsuccess = () => {
                    console.log("update success")
                }
            }

            existingTaskRequest.onerror = (event) => {
                console.log(event)
            }
            event.preventDefault();
        }
    };

    const handleDoubleClick = (event) => {
        // Logic to handle double click
        console.log(`double click at ${event.target}`)

        const store = db.db.transaction("tasks", "readwrite").objectStore("tasks")

        task.isExpanded = !isExpanded

        store.put(task).onsuccess = () => {
            setIsExpanded(!isExpanded)
        }
    };

    const handleRightClick = (event) => {
        event.preventDefault()
        setShowMenu(true)
        setMenuPosition({xPos: event.clientX, yPos: event.clientY})
    }

    const handleDragStart = (event) => {
        // Logic to handle drag start
        console.log(event);
    };

    const handleDrag = (event) => {
        console.log(event);
    }

    const handleDragEnd = (event) => {
        // Logic to handle drag end
        console.log(event);
    };

    const handleDeleteClick = (event) => {
        // Logic to handle delete click
        console.log(`delete ${task.id}`);

        const tasksObjectStore = db.db.transaction("tasks", "readwrite").objectStore("tasks")
        const tagIndex = tasksObjectStore.index("parentId")
        tasksObjectStore.delete(task.id);
        var pdestroy = tagIndex.openKeyCursor(); 
        pdestroy.onsuccess = function(event) {
            deleteTask(task.id)
            const cursor = event.target.result;
            if (cursor) {

                if(cursor.key === task.id) {
                    console.log(cursor.key)
                    tasksObjectStore.delete(cursor.primaryKey);

                }
                cursor.continue();
            }
        }
    };

    const handleAddSubTaskDoubleClick = (event) => {
        event.stopPropagation();
    }

    const handleAddSubTaskClick = (event) => {
        // Logic to handle add subtask click

        const subTask = new ItemClass(generateUUID(), task.id, "SubTask 0")

        taskNode.addChild(new TaskNode(subTask))
        console.log(taskNode)
        setNode(new TaskNode(taskNode.value, taskNode.children))

        const store = db.db.transaction("tasks", "readwrite").objectStore("tasks");

        store.add(subTask)

        store.transaction.oncomplete = () => {
            console.log("sub task added")
        }
    };

    const handleMenuItemClick = (menu) => {

        console.log(menu)

        if (menu === 'addSubTask') {
            handleAddSubTaskClick()
            setShowMenu(false)
        }
        else if (menu === "delete") {
            handleDeleteClick()
            setShowMenu(false)
        }
        else if (menu === "check") {
            console.log(task.id)
            setShowMenu(false)
        }
    }

    const [isCompleted, setIsCompleted] = useState(task.isCompleted)

    const items = node.children.map ((element) => <ListItem key = {element.value.id }taskNode={element} deleteTask={(taskId) => {
        setNode(new TaskNode(node.value, node.children.filter((value) => value.value.id !== taskId )))
    }}/>)

    return (
        <div className="list-item-container" id={task.id} >
            <div className="list-item" draggable={true} onContextMenu={handleRightClick} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrag = {handleDrag} onDoubleClick={handleDoubleClick}>
                <Arrow doesHaveChildren = { node.children.length > 0 } isExpanded = {isExpanded}/>
                <input type="checkbox" className="list-item-checkbox" checked={isCompleted} onChange={handleCheckboxChange} />                
                <span className='list-item-text-area'>
                    <span style = {{textDecoration: isCompleted? 'line-through' : 'none'}} className="list-item-text" contentEditable={true} onKeyDown={handleTextChange} onInput={(event) => { setTaskText(event.target.textContent) } }>{task.data}</span>
                    {/* <span className="list-item-add-subtask" onClick={handleAddSubTaskClick} onDoubleClick={handleAddSubTaskDoubleClick}><img src={plus} alt="Add Subtask" /></span> */}
                </span>
                {/* <span className="list-item-delete" onClick={handleDeleteClick}><img src={trash} alt="Delete"/> </span> */}
            </div>
            <div className="list-item-child-holder" style={{ display: isExpanded ? 'block' : 'none' , marginLeft: '20px'}}>
                {items}
            </div>
            <ContextMenu 
                xPos={menuPosition.xPos}
                yPos={menuPosition.yPos}
                showMenu={showMenu}
                onMenuItemClick={handleMenuItemClick}
            />
        </div>
    );
};

const CreateTaskListItem = ({ taskNode, deleteTask }) => {

    const db = useContext(DbContext);

    const [node, setNode] = useState(taskNode)
    const [task, setTask] = useState(taskNode.value)
    const [isExpanded, setIsExpanded] = useState(task.isExpanded ?? false);
    const [taskText, setTaskText] = useState(taskNode.value.text)

    const handleCheckboxChange = (event) => {
        // Logic to handle checkbox change
        setIsCompleted(event.target.checked)
    };

    const handleTextChange = (event) => {
        // Logic to handle text change

        if (event.code === "Enter") {

            const task = new ItemClass(generateUUID(), null, taskText, 0);
            console.log(db.db)
    
            const store = db.db.transaction("tasks", "readwrite").objectStore("tasks");
    
            store.add(task)
    
            store.transaction.oncomplete = () => {
                console.log(task)
                db.onChange(task)
            }

            event.preventDefault();

        }

    };

    const handleDoubleClick = (event) => {
        // Logic to handle double click
        console.log(`double click at ${event.target}`)
        setIsExpanded(!isExpanded)
    };

    const handleDragStart = (event) => {
        // Logic to handle drag start
        console.log(event);
    };

    const handleDrag = (event) => {
        console.log(event);
    }

    const handleDragEnd = (event) => {
        // Logic to handle drag end
        console.log(event);
    };

    const handleDeleteClick = (event) => {
        // Logic to handle delete click
        console.log(`delete ${task.id}`);
        deleteTask(task.id)

        const tasksObjectStore = db.db.transaction("tasks", "readwrite").objectStore("tasks")
        const tagIndex = tasksObjectStore.index("parentId")
        tasksObjectStore.delete(task.id);
        var pdestroy = tagIndex.openKeyCursor(); 
        pdestroy.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {

                if(cursor.key === task.id) {
                    console.log(cursor.key)
                    tasksObjectStore.delete(cursor.primaryKey);
                }
                cursor.continue();
            }
        }
    };

    const handleAddSubTaskDoubleClick = (event) => {
        event.stopPropagation();
    }

    const handleAddSubTaskClick = (event) => {
        // Logic to handle add subtask click

        const subTask = new ItemClass(generateUUID(), task.id, "SubTask 0")

        taskNode.addChild(new TaskNode(subTask))
        console.log(taskNode)
        setNode(new TaskNode(taskNode.value, taskNode.children))

        const store = db.db.transaction("tasks", "readwrite").objectStore("tasks");

        store.add(subTask)

        store.transaction.oncomplete = () => {
            console.log("sub task added")
        }
    };

    const [isCompleted, setIsCompleted] = useState(task.isCompleted)

    const items = node.children.map ((element) => <ListItem key = {element.value.id }taskNode={element} deleteTask={(taskId) => {
        setNode(new TaskNode(node.value, node.children.filter((value) => value.value.id !== taskId )))
    }}/>)

    return (
        <div className="list-item-container" id={task.id}>
            <div className="list-item" draggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrag = {handleDrag} onDoubleClick={handleDoubleClick}>
                <Arrow doesHaveChildren={ node.children.length > 0 } isExpanded={isExpanded}/>
                <input type="checkbox" className="list-item-checkbox" checked={isCompleted} onChange={handleCheckboxChange} />
                <span className='list-item-text-area'>
                    <span style={{opacity: 0.5}} className="list-item-text" contentEditable={true} onKeyDown={handleTextChange} onInput={(event) => { setTaskText(event.target.textContent)} }>{task.data}</span>
                </span>
            </div>
            <div className="list-item-child-holder" style={{ display: isExpanded ? 'block' : 'none' , marginLeft: '20px'}}>
                {items}
            </div>
        </div>
    );

};

const ContextMenu = ({ xPos, yPos, showMenu, onMenuItemClick }) => {
    if (!showMenu) {
      return null;
    }
  
    return (
      <ul
        style={{
          display: showMenu ? 'block' : 'none',
          position: 'absolute',
          top: `${yPos}px`,
          left: `${xPos}px`,
          backgroundColor: 'white',
          border: '1px solid black',
          listStyleType: 'none',
          padding: 0,
          margin: 0,
          zIndex: 999,
        //   boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
        }}
      >
        <li onClick={() => onMenuItemClick('delete')} style={{ padding: '8px', cursor: 'pointer' }}>Delete</li>
        <li onClick={() => onMenuItemClick('addSubTask')} style={{ padding: '8px', cursor: 'pointer' }}>Add Sub Task</li>
      </ul>
    );
};

const Arrow = ({ doesHaveChildren, isExpanded}) => {

    if (isExpanded)
        return <span style={{ visibility: doesHaveChildren ? 'visible' : 'hidden'}} className='list-item-arrow' ><img  src = {arrowExpanded}/></span>
    else
        return <span style={{ visibility: doesHaveChildren ? 'visible' : 'hidden'}} className='list-item-arrow' ><img  src = {arrowCollapsed}/></span>
};