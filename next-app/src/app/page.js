"use client";

import { useState, useEffect } from "react";

export default function Home() {

  let preItems = []


  useEffect(() => {
    // let preItems = []

    // for (let i = 0; i < 1000; i++) {
    //   preItems.push(new ItemClass(i,null,new String(i)))
    // }

    // setItemList(preItems);
  }, []); 

  // const [itemList, setItemList] = useState([
  //   new ItemClass(0,null,"Make Tea for 24 people in the Seracuz cruise"), 
  //   new ItemClass(1,null,"Add events to main implementation of project"), 
  //   new ItemClass(2,null,"Help my brother get his life together")]);

  for (let i = 0; i < 10; i++) {
    preItems.push(new ItemClass(i,null,new String(i)))
  }

  const [itemList, setItemList] = useState(preItems);


  return (

    <>
      <div id="parent">
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
      </div>
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
        onMouseMove={(event) => {
        console.log(`X: ${event.offsetX} Y: ${event.offsetY }`)
        setLeft(event.clientX)
      }
    }><p className = "help" style={{left: `${left}px` }}>{item.data}</p></li>
  );

}

class ItemClass {
  constructor(id, parentId, data) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
  }
}

