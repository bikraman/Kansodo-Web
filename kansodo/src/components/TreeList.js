import { useState, useEffect, useContext, useRef } from 'react';

import TaskNode from '../models/TaskNode.js'
import ItemClass from '../models/ItemClass.js';

import trash from '../assets/trash-can-regular.svg'
import plus from '../assets/plus-solid.svg'

import generateUUID from '../util/UUIDUtils.js';

import { DbContext } from '../App.js';

import ListItem from './ListItem.js';
import Arrow from './Arrow.js';
import DatePickerComponent from './DatePicker.js';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


export default function TreeList({data, onDelete, onRefresh}) {

    const dbContext = useContext(DbContext)
    const db = dbContext.db

    const mainRef = useRef(null)

    const onDragFinished = (event, taskId) => {
        const rect = mainRef.current.getBoundingClientRect()
        // console.log(rect)
        const items = mainRef.current.getElementsByClassName("list-item")

        let tasksObjectStore = null

        for (let item of items) {
            const box = item.getBoundingClientRect()
    
            if (event.clientX > box.x && event.clientX < box.x + box.width && event.clientY > box.y && event.clientY < box.y + box.height) {
              console.log("near")
    
              new Promise((resolve, reject) => {
    
                tasksObjectStore = db.transaction("tasks", "readwrite").objectStore("tasks")
    
                tasksObjectStore.get(taskId).onsuccess = (event) => {
                  resolve(event.target.result);
                }
              }).then((value) => {
    
                return new Promise((resolve, reject) => {
                  tasksObjectStore.get(item.parentElement.id).onsuccess = (event) => {
                    resolve({ currentElement: value, targetElement: event.target.result});
                  }
                })
              }).then((value) => {
    
                console.log(value.targetElement)
                console.log(value.currentElement)
    
                if(value.targetElement === undefined)
                  value.currentElement.parentId = null;
                else 
                  value.currentElement.parentId = value.targetElement.parentId;
    
                return new Promise((resolve, reject) => {
                  tasksObjectStore.put(value.currentElement).onsuccess = (event) => {
                    resolve(true)
                  }
                })
              }).then((value) => {

                onRefresh()
                  
                if (event.clientY > box.y + (box.height/2)) {
                    onRefresh()
                }
                else if (event.clientY < box.y + (box.height/2)) {
                    onRefresh()
                }
              })
            }
        }
    }

    const [showCal, setShowCal] = useState(false)

    const items = data.children
                .filter((element) => element.value.isVisible)
                .map ((element) => 
                        <ListItem key = {element.value.id} taskNode={element} 
                            deleteTask={(taskId) => { onDelete(taskId)}} 
                            onDragFinished={onDragFinished}
                            onShowCalendar={() => {setShowCal(true)}}
                            />
                    )

    function addTask(taskText) {

        const position = data.children.length
        console.log(position)

        const task = new ItemClass(generateUUID(), null, taskText, position);
    
        const store = db.transaction("tasks", "readwrite").objectStore("tasks");

        store.add(task)

        store.transaction.oncomplete = () => {
            console.log(task)
            dbContext.onChange(task)
        }

    }

    items.push(
        <CreateTaskListItem 
            key = {generateUUID()} 
            taskNode={new TaskNode(new ItemClass(generateUUID(), null, "Create task", 1))}
            onAddTask = {addTask}
        />
    )
    
    return (<div ref = {mainRef} className='list-container'>
                {items}
                {/* <div style={{position: 'fixed', left: '50%', top: '50%'}}>
                    <DatePickerComponent onDateChange={(data) => {console.log(data)}}/>
                </div> */}
            </div>
            );
}



const CreateTaskListItem = ({ taskNode, onAddTask }) => {

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

            onAddTask(taskText)

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

    const inputRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)

    // useEffect(() => {
    //     takeCursorToZero();
    // }, [isFocused])

    function onFocus() {
        setIsFocused(true)
        console.log(isFocused)
        takeCursorToZero();
    }

    function takeCursorToZero() {

        const element = inputRef.current
        element.focus()
        const range = document.createRange();
        const selection = window.getSelection();
        
        range.setStart(element, 0);
        range.collapse(true);
        
        selection.removeAllRanges();
        selection.addRange(range);

        console.log(range)


    }

    const [isCompleted, setIsCompleted] = useState(task.isCompleted)

    return (
        <div className="list-item-container" id={task.id}>
            <div className="list-item" draggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrag = {handleDrag} onDoubleClick={handleDoubleClick}>
                <Arrow doesHaveChildren={ node.children.length > 0 } isExpanded={isExpanded}/>
                <input type="checkbox" className="list-item-checkbox"  disabled = {true} checked={isCompleted} onChange={handleCheckboxChange} />
                <span className='list-item-text-area'>
                    <span style={{opacity: 0.5}} ref={inputRef} className="list-item-text" contentEditable={true} onKeyDown={handleTextChange} onClick={onFocus} onInput={(event) => { setTaskText(event.target.textContent)} }>{task.data}</span>
                </span>
            </div>
        </div>
    );

};



