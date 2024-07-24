import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useContext, createContext } from 'react';

import TreeList from './components/TreeList';

import TaskNode from './models/TaskNode'
import ItemClass from './models/ItemClass';

import generateUUID from './util/UUIDUtils';

export const DbContext = createContext()

function App() {

  const root = new TaskNode(new ItemClass(420, null, "Write something"));
  const [taskRoot, setTaskTreeRoot] = useState(root)
  // const [store, setStore] = useState(null)
  let dbGlobal = null


  useEffect(() => {

    let db;
    let tasksObjectStore;

    const request = window.indexedDB.open("list-db", 1);

    request.onsuccess = (event) => {
      console.log("onsuccess");
      db = event.target.result;

      dbGlobal = db
    
      tasksObjectStore = db
          .transaction("tasks", "readonly")
          .objectStore("tasks");

    
      tasksObjectStore.index("dateAdded").openCursor().onsuccess = (event) => {
    
        const cursor = event.target.result;
        if (cursor) {
          const task = cursor.value;
    
          addToTree(task);
          cursor.continue();
        }
        else {
          console.log("No more entries!");
          console.log(root)
    
          sortTree(root)
          setTaskTreeRoot({
            ...root
          })
          // displayTree(root)
    
          //listElement.children[0].style.display = "none";
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

    function addToTree(task) {

      if (task.parentId === null) {
        root.addChild(new TaskNode(task))
      }
      else {
        searchInTree(root, task)
      }
    
    }

    function sortTree(node) {

      if (node.value === undefined)
        return;
    
      if(node.children.length === 0)
        return;
    
      node.children.sort((a, b) => { return a.value.sortOrder - b.value.sortOrder} )
    
      for(let i = 0; i < node.children.length; i++) {
        sortTree(node.children[i])
      }
    
    }

    // function displayTree(node) {

    //   if (node === null) 
    //     return;
    
    //   createListItemAndAdd(node.value)
    
    //   for (let child of node.children) {
    //       displayTree(child);
    //   }
    // }


    function searchInTree(node, target) {

      if (node === null) {
          return false;
      }

      if (node.value === null) {
          return false;
      }
      
      if (node.value.id === target.parentId) {
          node.addChild(new TaskNode(target));
          return true;
      }
      
      for (let child of node.children) {
          if (searchInTree(child, target)) {
              return true;
          }
      }
      
      return false;
    }

    request.onupgradeneeded = (event) => {
      console.log("onupgradeneeded");
    
      db = event.target.result;
      dbGlobal = db
    
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

    return () => {
      console.log("cleanup")
    }

  }, [])

  return (
    <div className='main'>
        <h1 id="my">Kansodo</h1>

        <DbContext.Provider value={dbGlobal}>
          <Top  onAddTask = {(taskText) => {

            const task = new ItemClass(generateUUID(), null, taskText, 0);

            const store = dbGlobal.transaction("tasks", "readwrite").objectStore("tasks");

            store.add(task)

            store.transaction.oncomplete = () => {
              
              const newTaskRoot = new TaskNode(taskRoot.value, taskRoot.children)

              newTaskRoot.addChild(new TaskNode(task))
              console.log(newTaskRoot)
              setTaskTreeRoot(newTaskRoot)
            }
            
          }}/>
          <TreeList data = {taskRoot} onDelete={(taskId) => {
            const updatedChildren = taskRoot.children.filter((value) => value.value.id !== taskId )
            setTaskTreeRoot(new TaskNode(taskRoot.value, updatedChildren))
          }}/>

        </DbContext.Provider>

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
