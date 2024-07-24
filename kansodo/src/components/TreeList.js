import { useState, useEffect, useContext } from 'react';

import TaskNode from '../models/TaskNode.js'
import ItemClass from '../models/ItemClass.js';

import trash from './trash-can-regular.svg'
import plus from './plus-solid.svg'

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
    
    return (<div className='list-container'>{items}</div>);
}

const ListItem = ({ taskNode, deleteTask }) => {

    const db = useContext(DbContext);

    const [node, setNode] = useState(taskNode)
    const [task, setTask] = useState(taskNode.value)
    const [isExpanded, setIsExpanded] = useState(task.isExpanded ?? false);

    const handleCheckboxChange = (event) => {
        // Logic to handle checkbox change
        setIsCompleted(event.target.checked)
    };

    const handleTextChange = (event) => {
        // Logic to handle text change
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

        const tasksObjectStore = db.transaction("tasks", "readwrite").objectStore("tasks")
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

        const store = db.transaction("tasks", "readwrite").objectStore("tasks");

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
            <input type="checkbox" className="list-item-checkbox" checked={isCompleted} onChange={handleCheckboxChange} />
            <span className='list-item-text-area'>
                <span className="list-item-text" contentEditable={true} onKeyDown={handleTextChange}>{task.data}</span>
                <span className="list-item-add-subtask" onClick={handleAddSubTaskClick} onDoubleClick={handleAddSubTaskDoubleClick}><img src={plus} alt="Add Subtask" /></span>
            </span>
            <span className="list-item-delete" onClick={handleDeleteClick}><img src={trash} alt="Delete"/> </span>
        </div>
        <div className="list-item-child-holder" style={{ display: isExpanded ? 'block' : 'none' , marginLeft: '20px'}}>
            {items}
        </div>
        </div>
    );
};