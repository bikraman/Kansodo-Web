"use strict";

window.onload = function () {
    console.log("loaded");
}

document.getElementById("my").addEventListener("mousemove", (event) => {
    console.log(`client: ${event.clientX} offset: ${event.offsetX}`);
})

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
//   createListItemAndAdd(String(i))
// }

console.log(listElement.innerHTML);

addButton.addEventListener("click", (event) => {
    tasks.push(taskInput.value);
    console.log(tasks);

    createListItemAndAdd(taskInput.value);
})

function createListItemAndAdd(data) {
  const listItem = document.createElement("div");
  const text = document.createElement("p")
  const checkbox = document.createElement("input");
  const deleteTask = new Image(20,20);

  deleteTask.src = "trash-can-regular.svg";
  checkbox.type = "checkbox";
  text.textContent = data;
  // listItem.innerText = data;
  // listItem.innerHTML = "<p class=\"list-item-text\">Hello</p>"
  listItem.className = "list-item";
  text.className = "list-item-text";
  deleteTask.className = "list-item-delete";

  listItem.addEventListener("mousemove", (event) => {
    console.log(event.x);
    text.style.paddingLeft = `${event.x}px`;
  })

  // listItem.addEventListener("")

  listItem.appendChild(checkbox);
  listItem.appendChild(text);
  listItem.appendChild(deleteTask);
  listElement.appendChild(listItem);
}

const tasks = [];


class ItemClass {
  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
  }
}



