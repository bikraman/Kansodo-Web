"use client";

import { useState } from "react";

export default function Home() {

  const [itemList, setItemList] = useState([
    new ItemClass(0,null,"Make Tea"), 
    new ItemClass(1,null,"Add Events"), 
    new ItemClass(2,null,"Help my brother")]);


  return (
    <>
      <AddTask onAddTask = { (inputValue) => {
        // Update the state using the previous state

        const item = new ItemClass(itemList.length, null, inputValue);

        setItemList(prevItemList => {
          // Create a new array by concatenating the previous items with the new input value
          return [...prevItemList, item];
        });
      }}
      />
      <List items = {itemList}/>
    </>
  );
}

function AddTask({onAddTask}) {

  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <input id="taskInput" type="text" value = {inputValue} onChange={(changeEvent) => setInputValue(changeEvent.target.value)}></input>
      <button onClick = {() => {
          onAddTask(inputValue)
          setInputValue("")
        }
      }>Add</button>
    </>
  );
}

function List({items}) {

  const itemsAsListItems = items.map(item => {
    return <IndividualTask item={item}/>;
  });
  
  return (
    <>
      <ul>
        {itemsAsListItems}
      </ul>
    </>
  );
}

function IndividualTask({item}) {

  const [left, setLeft] = useState(0)

  return (
    <li 
      style={{left : `${left}px`}}
      onMouseMove={(event) => {
        console.log(`X: ${event.clientX} Y: ${event.clientY }`)
        setLeft(event.clientX)
      }
    }>{item.data}</li>
  );

}

class ItemClass {
  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
  }
}

