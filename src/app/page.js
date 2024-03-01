"use client";

import { useState } from "react";

export default function Home() {

  const [itemList, setItemList] = useState([]);

  console.log("home called")

  return (
    <>
      <AddTask onAddTask = { (inputValue) => {
        // Update the state using the previous state
        setItemList(prevItemList => {
          // Create a new array by concatenating the previous items with the new input value
          return [...prevItemList, inputValue];
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
      <button onClick = {() => onAddTask(inputValue)} >Add</button>
    </>
  );
}

function List({items}) {

  const itemsAsListItems = items.map(item => {
    return <li> {item} </li>;
  });

  
  return (
    <>
      <ul>
        {itemsAsListItems}
      </ul>
    </>
  );
}

