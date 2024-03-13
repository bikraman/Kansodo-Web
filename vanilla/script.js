"use strict";

window.onload = function () {
    console.log("loaded");
}

class ItemClass {

  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
    this.isCompleted = false;
  }
}

const tasks = [];



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
    tasks.push(task);
    console.log(tasks);

    createListItemAndAdd(task);
})

function createListItemAndAdd(task) {
  const listItem = createListItem(task);

  console.log(listItem);
  listElement.appendChild(listItem);
}

function createListItem(task) {
  const listItem = document.createElement("div");
  const text = document.createElement("p")
  const checkbox = document.createElement("input");
  const deleteTask = new Image(15,15);
  const addSubTask = new Image(15,15);

  deleteTask.src = "trash-can-regular.svg";
  addSubTask.src = "plus-solid.svg";
  checkbox.type = "checkbox";
  text.textContent = task.data;
  text.contentEditable = true;

  listItem.className = "list-item";
  text.className = "list-item-text";
  addSubTask.className = "list-item-add-subtask";
  deleteTask.className = "list-item-delete";

  listItem.addEventListener("mousemove", (event) => {
    console.log(event.x);
    // text.style.paddingLeft = `${event.x}px`;
  });

  listItem.addEventListener("mouseout", (event) => {
    // text.style.paddingLeft = "5px";
  });

  listItem.addEventListener("mouseenter", (event) => {
    console.log("mouse entered")
  })

  deleteTask.addEventListener("click", (event) => {
    console.log("deleted!");
    // tasks.splice(3,1);
    event.target.parentElement.remove();
  })

  addSubTask.addEventListener("click", (event) => {

    const subListItem = createListItem(new ItemClass(tasks.length + 1, null, "Sub task 0"));


    const style = window.getComputedStyle(listItem);
    const marginLeft = parseFloat(style.marginLeft);

    console.log(marginLeft);

    subListItem.style.marginLeft = `${marginLeft + 15}px`;

    listItem.after(subListItem);
  })

  listItem.appendChild(checkbox);
  listItem.appendChild(text);
  listItem.appendChild(addSubTask);
  // listItem.appendChild(deleteTask);

  return listItem;

}





