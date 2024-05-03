import { useState, useEffect } from 'react';

import TaskNode from '../models/TaskNode.js'
import ItemClass from '../models/ItemClass.js';

import trash from './trash-can-regular.svg'
import plus from './plus-solid.svg'

export default function TreeList({data}) {

    // const [data, setData] = useState(null);

    useEffect(() => {

    });

    console.log(data)

    const items = []
    getStuff(data, items)

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
    const [isExpanded, setIsExpanded] = useState(task.isExpanded ?? false);

    const handleCheckboxChange = (event) => {
        // Logic to handle checkbox change
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

    return (
        <div className="list-item-container" id={task.id}>
        <div className="list-item" draggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <input type="checkbox" className="list-item-checkbox" checked={task.isCompleted} onChange={handleCheckboxChange} />
            <span className="list-item-text" contentEditable={true} onKeyDown={handleTextChange}>{task.data}</span>
            <span className="list-item-add-subtask" onClick={handleAddSubTaskClick}><img src={plus} alt="Add Subtask" /></span>
            <span className="list-item-delete" onClick={handleDeleteClick}><img src={trash} alt="Delete" /></span>
        </div>
        <div className="list-item-child-holder" style={{ display: isExpanded ? 'block' : 'none' }}>
            {/* Subtask components can be rendered here */}
        </div>
        </div>
    );
};