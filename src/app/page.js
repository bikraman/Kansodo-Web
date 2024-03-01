"use client";

import { useState } from "react";

export default function Home() {

  const [itemList, setItemList] = useState([]);

  console.log(itemList)

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
      <button onClick = {() => onAddTask(inputValue)} >Add</button>
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

  return (
    <li >{item.data}</li>
  );

}


class ItemClass {
  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
  }
}

