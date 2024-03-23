"use strict";

window.onload = function () {
    console.log("loaded");
}

let db;
let tasksObjectStore;

const request = window.indexedDB.open("list-db", 1);

const tasks = []



class ObservableTasks {

  constructor(data, onChanged) {
    this.value = data 
    this.onChanged = onChanged
  }

  setValue(data) {
    this.value = data
    this.onChanged()
  }

}

const observableTasks = new ObservableTasks(tasks, () => {
  console.log("tasks changed!")
  listElement.textContent = '';

  tasks.forEach((task, index) => {
    createListItemAndAdd(task)
  })

})


class ItemClass {

  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
    this.isCompleted = false;
  }
}

// tasks.push(new ItemClass(1, null, "Develop new feature for the application"));

// tasks.push(new ItemClass(2, null, "Fix bugs reported by QA team."));
// tasks.push(new ItemClass(3, null, "Conduct code review for pull requests"));
// tasks.push(new ItemClass(4, null, "Update documentation for API endpoints"));

// tasks.push(new ItemClass(5, 1, "Implement user authentication system"));
// tasks.push(new ItemClass(6, 1, "Design user interface for the dashboard"));


request.onsuccess = (event) => {
  console.log("onsuccess");
  db = event.target.result;

  tasksObjectStore = db
      .transaction("tasks", "readonly")
      .objectStore("tasks");

  tasksObjectStore.openCursor().onsuccess = (event) => {

    console.log(event)

    const cursor = event.target.result;
    if (cursor) {
      console.log(cursor.value);
      
      const task = cursor.value //new ItemClass(tasks.length + 1, null, taskInput.value);
      // tasks.push(task);
      // console.log(tasks);

      tasks.push(task);

      createListItemAndAdd(task);

      cursor.continue();
    } else if (cursor === null) {
    }
    else {
      console.log("No more entries!");
    }

    if (tasks.length === 0) {

      const emptyTask = new ItemClass(1, null, "Write your first task");

      const newTasksObjectStore = db.transaction("tasks", "readwrite").objectStore("tasks")

      newTasksObjectStore.add(emptyTask)

      newTasksObjectStore.transaction.onsuccess = () => {
        tasks.push(emptyTask)

        createListItemAndAdd(emptyTask);
      }



    }
  }




  // tasks.forEach((task) => {
  //   tasksObjectStore.add(task);
  // });

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

  const objectStore = db.createObjectStore("tasks", { keyPath: "id" });
  objectStore.createIndex("id", "id", { unique: true , autoIncrement: true});
  objectStore.createIndex("parent_id", "parent_id", { unique: false })

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  objectStore.createIndex("task", "task", { unique: false });
  objectStore.createIndex("is_completed", "is_completed", { unique: false });

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

class MyElement extends HTMLElement {
    constructor() {
      super();
      // element created
    }
  
    connectedCallback() {
      // browser calls this method when the element is added to the document
      // (can be called many times if an element is repeatedly added/removed)
    }
  
    disconnectedCallback() {
      // browser calls this method when the element is removed from the document
      // (can be called many times if an element is repeatedly added/removed)
    }
  
    static get observedAttributes() {
      return [/* array of attribute names to monitor for changes */];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      // called when one of attributes listed above is modified
    }
  
    adoptedCallback() {
      // called when the element is moved to a new document
      // (happens in document.adoptNode, very rarely used)
    }
  
    // there can be other element methods and properties
}

customElements.define("my-element", MyElement);

const listElement = document.getElementById("list");
const addButton = document.getElementById("add-button");
const taskInput = document.getElementById("task-input");

// for(let i = 0; i < 10; i++) {

//   const id = tasks.length;

//   const task = new ItemClass(id , null, "Task " + (id + 1));
//   tasks.push(task);

//   createListItemAndAdd(task);
// }



console.log(listElement.innerHTML);

addButton.addEventListener("click", (event) => {

    const task = new ItemClass(tasks.length + 1, null, taskInput.value);

    tasksObjectStore = db
    .transaction("tasks", "readwrite")
    .objectStore("tasks");

    tasksObjectStore.add(task)

    tasksObjectStore.transaction.oncomplete = () => {
      // createListItemAndAdd(task);

      tasks.push(task);

      observableTasks.setValue(tasks)  
    }

})

function createListItemAndAdd(task) {
  const listItem = createListItem(task);

  // console.log(listItem);

  if (task.parentId !== null) {
    const parentItem = document.getElementById(`${task.parentId}`)

    const style = window.getComputedStyle(parentItem);
    const marginLeft = parseInt(style.marginLeft);

    listItem.style.marginLeft = `${marginLeft + 30}px`;
    parentItem.after(listItem);
  }
  else {
    listElement.appendChild(listItem);
  }

}

function createListItem(task) {
  const listItem = document.createElement("div");
  const text = document.createElement("p")
  const checkbox = document.createElement("input");
  const deleteTask = new Image(15,15);
  const addSubTask = new Image(15,15);

  const textArea = document.createElement("span");

  listItem.id = task.id;

  deleteTask.src = "trash-can-regular.svg";
  addSubTask.src = "plus-solid.svg";
  checkbox.type = "checkbox";
  text.textContent = task.data;
  text.contentEditable = true;

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

  checkbox.className = "list-item-checkbox";
  listItem.className = "list-item";
  text.className = "list-item-text";
  addSubTask.className = "list-item-add-subtask";
  deleteTask.className = "list-item-delete";
  textArea.className = "list-item-text-area";

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
    event.target.parentElement.remove();
  })

  addSubTask.addEventListener("click", (event) => {

    console.log(tasks.length + 1)

    const subTask = new ItemClass(tasks.length + 1, parseInt(listItem.id), "Sub task 0")

    const subListItem = createListItem(subTask);

    tasksObjectStore = db
    .transaction("tasks", "readwrite")
    .objectStore("tasks");

    tasksObjectStore.add(subTask)

    tasksObjectStore.transaction.oncomplete = () => {
      const style = window.getComputedStyle(listItem);
      const marginLeft = parseInt(style.marginLeft);
  
      subListItem.style.marginLeft = `${marginLeft + 15}px`;

      tasks.push(subTask)
  
      listItem.after(subListItem);
    }

  })

  textArea.appendChild(text);
  textArea.appendChild(addSubTask);

  listItem.appendChild(checkbox);
  listItem.appendChild(textArea);
  listItem.appendChild(deleteTask);

  return listItem;

}





