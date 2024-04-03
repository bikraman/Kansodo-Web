"use strict";



window.onload = function () {
    console.log("loaded");
}

let db;
let tasksObjectStore;

const request = window.indexedDB.open("list-db", 3);

class TaskNode {

  constructor(value) {
    this.children = []
    this.value = value
  }

  addChild(node) {
    this.children.push(node)
  }
}


class ItemClass {

  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
    this.isCompleted = false;
    this.isExpanded = true;
    this.dateAdded = new Date();
  }
}

// tasks.push(new ItemClass(1, null, "Develop new feature for the application"));

// tasks.push(new ItemClass(2, null, "Fix bugs reported by QA team."));
// tasks.push(new ItemClass(3, null, "Conduct code review for pull requests"));
// tasks.push(new ItemClass(4, null, "Update documentation for API endpoints"));

// tasks.push(new ItemClass(5, 1, "Implement user authentication system"));
// tasks.push(new ItemClass(6, 1, "Design user interface for the dashboard"));

const root = new TaskNode(new ItemClass(20, null, "Write something"))


request.onsuccess = (event) => {
  console.log("onsuccess");
  db = event.target.result;

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
      displayTree(root)
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

function displayTree(node) {

  if (node === null) 
    return;

  createListItemAndAdd(node.value)

  for (let child of node.children) {
      displayTree(child);
  }
}

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


function addToTree(task) {

  if (task.parentId === null) {
    root.addChild(new TaskNode(task))
  }
  else {
    searchInTree(root, task)
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

const listElement = document.getElementById("list");
const addButton = document.getElementById("add-button");
const taskInput = document.getElementById("task-input");

function generateUUID() {
  // Generate random bytes
  const cryptoObj = window.crypto || window.msCrypto; // for IE11 compatibility
  const buffer = new Uint8Array(16);
  cryptoObj.getRandomValues(buffer);

  // Set version (4) and variant (RFC4122) bits
  buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
  buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant RFC4122

  // Convert bytes to hexadecimal string
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    let byte = buffer[i].toString(16);
    if (byte.length === 1) byte = '0' + byte;
    uuid += byte;
    if ([3, 5, 7, 9].includes(i)) uuid += '-';
  }

  return uuid;
}


addButton.addEventListener("click", (event) => {


    const task = new ItemClass(generateUUID(), null, taskInput.value);

    tasksObjectStore = db
    .transaction("tasks", "readwrite")
    .objectStore("tasks");

    tasksObjectStore.add(task)

    tasksObjectStore.transaction.oncomplete = () => {
      createListItemAndAdd(task);
    }

})

function createListItemAndAdd(task) {
  const listItem = createListItem(task);

  if (task.parentId !== null) {
    const parentItem = document.getElementById(`${task.parentId}`)

    const style = window.getComputedStyle(parentItem);
    const marginLeft = parseInt(style.marginLeft);

    listItem.style.marginLeft = `${marginLeft + 20}px`;

    const child = document.createElement("div")
    child.className = "list-item-child-holder"
    child.appendChild(listItem)

    parentItem.appendChild(child);

  }
  else {
    listElement.appendChild(listItem);
  }

}

function createListItem(task) {
  const listItemContainer = document.createElement("div")
  const listItem = document.createElement("div");
  const text = document.createElement("p")
  const checkbox = document.createElement("input");
  const deleteTask = new Image(15,15);
  const addSubTask = new Image(15,15);

  const textArea = document.createElement("span");

  listItem.draggable = true;

  listItemContainer.id = task.id;

  deleteTask.src = "trash-can-regular.svg";
  addSubTask.src = "plus-solid.svg";
  checkbox.type = "checkbox";
  text.textContent = task.data;
  text.contentEditable = true;

  listItemContainer.className = "list-item-container"

  checkbox.className = "list-item-checkbox";
  listItem.className = "list-item";
  text.className = "list-item-text";
  addSubTask.className = "list-item-add-subtask";
  deleteTask.className = "list-item-delete";
  textArea.className = "list-item-text-area";

  checkbox.checked = task.isCompleted;

  listItem.addEventListener("keydown", event => {
    console.log(`${event.code} from listItem`);
  })

  text.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {

      tasksObjectStore = db
      .transaction("tasks", "readwrite")
      .objectStore("tasks");
  

      const existingTaskRequest = tasksObjectStore.get(task.id)
      existingTaskRequest.onsuccess = (event) => {
        const existingTask = event.target.result;

        console.log(existingTask)

        existingTask.data = text.textContent;

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
    console.log(`${event.code} from text`);
  })



  text.spellcheck = false;

  if (task.isCompleted) 
    text.style.textDecoration = "line-through";
  else 
    text.style.textDecoration = "none";


  checkbox.addEventListener("change", (event) => {
    console.log(event.target.checked);

    const isCompleted = event.target.checked;

    if (isCompleted) 
      text.style.textDecoration = "line-through";
    else 
      text.style.textDecoration = "none";
      

    tasksObjectStore = db
    .transaction("tasks", "readwrite")
    .objectStore("tasks");

    const existingTaskRequest = tasksObjectStore.get(task.id)
    existingTaskRequest.onsuccess = (event) => {
      const existingTask = event.target.result;

      existingTask.isCompleted = isCompleted;

      const requestUpdate = tasksObjectStore.put(existingTask);

      requestUpdate.onsuccess = () => {
        console.log("update success")
      }
    }

    existingTaskRequest.onerror = (event) => {
      console.log(event)
    }
  })

  listItem.addEventListener("dblclick", event => {
    console.log("double click")

    const store = db.transaction("tasks", "readwrite").objectStore("tasks")
    
    if (task.isExpanded || task.isExpanded === undefined) {
      const childHolder = listItemContainer.getElementsByClassName("list-item-child-holder")
      console.log(childHolder)
      for (let item of childHolder) {
        item.style.display = "none";
      }
      task.isExpanded = false
    }
    else {
      const childHolder = listItemContainer.getElementsByClassName("list-item-child-holder")
      console.log(childHolder)
      for (let item of childHolder) {
        item.style.display = "block";
      }
      task.isExpanded = true
    }

    
  });

  listItem.addEventListener("mousemove", (event) => {
    // console.log(event.x);
    // text.style.paddingLeft = `${event.x}px`;
  });

  listItem.addEventListener("mouseout", (event) => {
    // text.style.paddingLeft = "5px";
  });

  listItem.addEventListener("mouseenter", (event) => {
    // console.log("mouse entered") 
  })

  deleteTask.addEventListener("click", (event) => {
    console.log("deleted!");
    // tasks.splice(3,1);

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

    event.target.parentElement.remove();
  })

  addSubTask.addEventListener("click", (event) => {

    const subTask = new ItemClass(generateUUID(), listItemContainer.id, "Sub task 0")

    const subListItem = createListItem(subTask);

    tasksObjectStore = db
    .transaction("tasks", "readwrite")
    .objectStore("tasks");

    tasksObjectStore.add(subTask)

    tasksObjectStore.transaction.oncomplete = () => {
      const style = window.getComputedStyle(listItemContainer);
      const marginLeft = parseInt(style.marginLeft);
  
      subListItem.style.marginLeft = `${marginLeft + 20}px`;

      const child = document.createElement("div")
      child.className = "list-item-child-holder"
      child.appendChild(subListItem)


      listItemContainer.appendChild(child);
    }

  })

  textArea.appendChild(text);
  textArea.appendChild(addSubTask);

  listItem.appendChild(checkbox);
  listItem.appendChild(textArea);
  listItem.appendChild(deleteTask);

  listItemContainer.appendChild(listItem)

  return listItemContainer;

}





