import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import TreeList from './components/TreeList';

import TaskNode from './models/TaskNode'
import ItemClass from './models/ItemClass';

import generateUUID from './util/UUIDUtils';

function App() {

  const root = new TaskNode(new ItemClass(420, null, "Write something"));
  const [taskRoot, setTaskTreeRoot] = useState(root)


  useEffect(() => {

    let db;
    let tasksObjectStore;

    const request = window.indexedDB.open("list-db", 1);

    request.onsuccess = (event) => {
      console.log("onsuccess");
      db = event.target.result;
    
      tasksObjectStore = db
          .transaction("tasks", "readonly")
          .objectStore("tasks");
    
      // tasksObjectStore.index("dateAdded").openCursor().onsuccess = (event) => {
    
      //   const cursor = event.target.result;
      //   if (cursor) {
      //     const task = cursor.value;
    
      //     addToTree(task);
      //     cursor.continue();
      //   }
      //   else {
      //     console.log("No more entries!");
      //     console.log(root)
    
      //     sortTree(root)
      //     displayTree(root)
    
      //     listElement.children[0].style.display = "none";
      //   }
    
    
      //   // if (tasks.length === 0) {
    
      //   //   const emptyTask = new ItemClass(1, null, "Write your first task");
    
      //   //   const newTasksObjectStore = db.transaction("tasks", "readwrite").objectStore("tasks")
    
      //   //   newTasksObjectStore.add(emptyTask)
    
      //   //   newTasksObjectStore.transaction.onsuccess = () => {
      //   //     tasks.push(emptyTask)
    
      //   //     createListItemAndAdd(emptyTask);
      //   //   }
      //   // }
      // }
    
    
      tasksObjectStore.transaction.oncomplete = (event) => {
        console.log("object store created");
      }
    
      tasksObjectStore.transaction.onerror = (event) => {
        console.log(event.target.error.message);
      }
    }

    request.onupgradeneeded = (event) => {
      console.log("onupgradeneeded");
    
      db = event.target.result;
    
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

  })

  return (
    <div className='main'>
        <h1 id="my">Kansodo</h1>
        <Top  onAddTask = {(task) => {

          const newTaskRoot = new TaskNode(taskRoot.value, taskRoot.children)

          newTaskRoot.addChild(new TaskNode(new ItemClass(generateUUID(), 420, task, newTaskRoot.children.length)))
          console.log(newTaskRoot)
          setTaskTreeRoot(newTaskRoot)
        }}/>
        <TreeList data = {taskRoot} onDelete={(taskId) => {
          const updatedChildren = taskRoot.children.filter((value) => value.value.id !== taskId )
          setTaskTreeRoot(new TaskNode(taskRoot.value, updatedChildren))
        }}/>
    </div>
  );
}

function Top({onAddTask}) {

  const [task, setTask] = useState("")

  return (
    <span>
      <input id="task-input" type="text" value={task} onInput={(event) => { setTask(event.target.value)} } placeholder="Enter a new task"/>
      <button id="add-button" onClick={() => onAddTask(task) }>Add</button>
    </span>
    );
}



export default App;
