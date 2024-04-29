import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import TaskNode from './models/TaskNode'
import ItemClass from './models/ItemClass';

function App() {
  return (
    // <ListItem/>
    <>
        <h1 id="my">Kansodo</h1>
        <Top/>
        <List/>
    </>
  );
}

function Top() {
  return (<span>
    <input id="task-input" type="text" placeholder="Enter a new task"/>
    <button id="add-button">Add</button>
  </span>);
}

function List() {

  const [dbInstance, setDbInstance] = useState(null);
  const [tasksObjectStore, setTasksObjectStore] = useState(null);

  useEffect(() => {

    const root = new TaskNode(new ItemClass(1, null, "Write something"));

    const request = window.indexedDB.open("list-db", 1);

    request.onupgradeneeded = (event) => {
      console.log("onupgradeneeded");
    
      const db = event.target.result;
      setDbInstance(db);
    
      const objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("parentId", "parentId", { unique: false })
    
      // Create an index to search customers by email. We want to ensure that
      // no two customers have the same email, so use a unique index.
      objectStore.createIndex("data", "data", { unique: false });
      objectStore.createIndex("dateAdded", "dateAdded", { unique: true });
    
      objectStore.transaction.oncomplete = (event) => {
        console.log("object store created");
      }
    
      objectStore.onerror = (event) => {
        console.log("object store creation failed");
      }
    }
    
    request.onerror = (event) => {
      console.log("onerror");
    }

    // function sortTree(node) {

    //   if (node.value === undefined)
    //     return;
    
    //   if(node.children.length === 0)
    //     return;
    
    //   node.children.sort((a, b) => { a.value.sortOrder - b.value.sortOrder} )
    
    //   for(let i = 0; i < node.children.length; i++) {
    //     sortTree(node.children[i])
    //   }
    
    // }
    
    // function displayTree(node) {
    
    //   if (node === null) 
    //     return;
    
    //   createListItemAndAdd(node.value)
    
    //   for (let child of node.children) {
    //       displayTree(child);
    //   }
    // }
    // function addToTree(task) {

    //   if (task.parentId === null) {
    //     root.addChild(new TaskNode(task))
    //   }
    //   else {
    //     searchInTree(root, task)
    //   }
    
    // }
    

    request.onsuccess = (event) => {
      console.log("onsuccess");

      const db = event.target.result;
      setDbInstance(db);

      const tasksObjectStore = dbInstance
          .transaction("tasks", "readonly")
          .objectStore("tasks");

      tasksObjectStore.index("dateAdded").openCursor().onsuccess = (event) => {

        const cursor = event.target.result;
        if (cursor) {
          const task = cursor.value;

          // addToTree(task);

          <ListItem task={task}/>
          cursor.continue();
        }
        else {
          console.log("No more entries!");
          console.log(root)

          // sortTree(root)
          // displayTree(root)

          // listElement.children[0].style.display = "none";
        }


      // if (tasks.length === 0) {

      //   const emptyTask = new ItemClass(1, null, "Write your first task");

      //   const newTasksObjectStore = db.transaction("tasks", "readwrite").objectStore("tasks")

      //   newTasksObjectStore.add(emptyTask)

      //   newTasksObjectStore.transaction.onsuccess = () => {
      //     tasks.push(emptyTask)

      //     createListItemAndAdd(emptyTask);
      //   }
      // }
      }


      tasksObjectStore.transaction.oncomplete = (event) => {
        console.log("object store created");
      }

      tasksObjectStore.transaction.onerror = (event) => {
        console.log(event.target.error.message);
      }
}
  }, [])

  return <div id="list" class="list-container">

  </div>
}


const ListItem = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(task.isExpanded || false);

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
        <span className="list-item-add-subtask" onClick={handleAddSubTaskClick}><img src="plus-solid.svg" alt="Add Subtask" /></span>
        <span className="list-item-delete" onClick={handleDeleteClick}><img src="trash-can-regular.svg" alt="Delete" /></span>
      </div>
      <div className="list-item-child-holder" style={{ display: isExpanded ? 'block' : 'none' }}>
        {/* Subtask components can be rendered here */}
      </div>
    </div>
  );
};


export default App;
