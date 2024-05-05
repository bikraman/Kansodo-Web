import { useState, useEffect } from 'react';

import TaskNode from '../models/TaskNode.js'
import ItemClass from '../models/ItemClass.js';

import trash from './trash-can-regular.svg'
import plus from './plus-solid.svg'

export default function TreeList({data}) {


    const items = data.children.map ((element) => <ListItem task={element}/>)

    return (<div className='list-container'>{items}</div>);
}

function getStuff(node, final) {

    if(node === null)
        return;

    final.push(<ListItem task={node.value}/>);

    for (let child of node.children) {
        getStuff(child, final)
    }
}


const ListItem = ({ task }) => {

    const value = task.value
    const [isExpanded, setIsExpanded] = useState(value.isExpanded ?? false);

    const handleCheckboxChange = (event) => {
        // Logic to handle checkbox change
        console.log(event.target.checked)
        setIsCompleted(event.target.checked)
    };

    const handleTextChange = (event) => {
        // Logic to handle text change
    };

    const handleDoubleClick = () => {
        // Logic to handle double click
    };

    const handleDragStart = (event) => {
        // Logic to handle drag start
    };

    const handleDragEnd = (event) => {
        // Logic to handle drag end
    };

    const handleDeleteClick = () => {
        // Logic to handle delete click
    };

    const handleAddSubTaskClick = () => {
        // Logic to handle add subtask click
    };

    const [isCompleted, setIsCompleted] = useState(value.isCompleted)

    const items = task.children.map ((element) => <ListItem task={element}/>)

    return (
        <div className="list-item-container" id={value.id}>
        <div className="list-item" draggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <input type="checkbox" className="list-item-checkbox" checked={isCompleted} onChange={handleCheckboxChange} />
            <span className="list-item-text" contentEditable={true} onKeyDown={handleTextChange}>{value.data}</span>
            <span className="list-item-add-subtask" onClick={handleAddSubTaskClick}><img src={plus} alt="Add Subtask" /></span>
            <span className="list-item-delete" onClick={handleDeleteClick}><img src={trash} alt="Delete" /></span>
        </div>
        <div className="list-item-child-holder" style={{ display: isExpanded ? 'block' : 'none' , marginLeft: '20px'}}>
            {/* Subtask components can be rendered here */}
            {items}
        </div>
        </div>
    );
};