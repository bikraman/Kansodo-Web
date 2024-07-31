import { useState, useEffect, useContext, useRef } from 'react';
import { DbContext } from '../App.js';

import generateUUID from '../util/UUIDUtils.js';

import arrowCollapsed from '../assets/arrow_collapsed.png'
import arrowExpanded from '../assets/arrow_expanded.png'

import TaskNode from '../models/TaskNode.js'
import ItemClass from '../models/ItemClass.js';

export default function ListItem ({ taskNode, deleteTask, onDragFinished }) {

    const db = useContext(DbContext);

    useEffect(() => {
        setNode(taskNode)
    }, [taskNode])

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

    const handleExpandCollapse = (event) => {
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
        // console.log(event);
    }

    const handleDragEnd = (event) => {
        // Logic to handle drag end
        console.log(event)
        onDragFinished(event,task.id)
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
        else if(menu === "addDueDate") {
            setShowMenu(false)
        }
    }

    const [isCompleted, setIsCompleted] = useState(task.isCompleted)

    const items = node.children.map ((element) => <ListItem 
        key = {element.value.id } 
        taskNode={element} 
        deleteTask={(taskId) => {
            setNode(new TaskNode(node.value, node.children.filter((value) => value.value.id !== taskId )))
        }} 
        onDragFinished={onDragFinished}
        />)

    return (
        <div className="list-item-container" id={task.id} >
            <div className="list-item" draggable={true} onContextMenu={handleRightClick} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrag = {handleDrag}>
                <Arrow onClick={handleExpandCollapse} doesHaveChildren = { node.children.length > 0 } isExpanded = {isExpanded}/>
                <input type="checkbox" className="list-item-checkbox" checked={isCompleted} onChange={handleCheckboxChange} />                
                <span className='list-item-text-area'>
                    <span style = {{textDecoration: isCompleted? 'line-through' : 'none'}} className="list-item-text" suppressContentEditableWarning={true} contentEditable={true} onKeyDown={handleTextChange} onInput={(event) => { setTaskText(event.target.textContent) } }>{task.data}</span>
                    {/* <span className="list-item-add-subtask" onClick={handleAddSubTaskClick} onDoubleClick={handleAddSubTaskDoubleClick}><img src={plus} alt="Add Subtask" /></span> */}
                </span>
                {/* <span className="list-item-delete"><DatePickerComponent/></span> */}
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

const Arrow = ({ onClick, doesHaveChildren, isExpanded}) => {

    if (isExpanded)
        return <span onClick={onClick} style={{ visibility: doesHaveChildren ? 'visible' : 'hidden'}} className='list-item-arrow' ><img  src = {arrowExpanded}/></span>
    else
        return <span onClick={onClick} style={{ visibility: doesHaveChildren ? 'visible' : 'hidden'}} className='list-item-arrow' ><img  src = {arrowCollapsed}/></span>
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
        <li onClick={() => onMenuItemClick('addDueDate')} style={{ padding: '8px', cursor: 'pointer' }}>Add Due Date</li>
      </ul>
    );
};