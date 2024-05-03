import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import TreeList from './components/TreeList';

import TaskNode from './models/TaskNode'
import ItemClass from './models/ItemClass';

function App() {

  const root = new TaskNode(new ItemClass(420, null, "Write something"));

  root.addChild(new TaskNode(new ItemClass(1, 420, "Become great")));

  root.addChild(new TaskNode(new ItemClass(2, 420, "Fix bugs reported by QA team.")));
  root.addChild(new TaskNode(new ItemClass(3, 420, "Conduct code review for pull requests")));
  root.addChild(new TaskNode(new ItemClass(4, 420, "Update documentation for API endpoints")));

  root.children[0].addChild(new TaskNode(new ItemClass(5, 1, "Implement user authentication system")));
  root.children[0].addChild(new TaskNode(new ItemClass(6, 1, "Design user interface for the dashboard")));


  return (
    // <ListItem/>
    <div className='hello'>
        <h1 id="my">Kansodo</h1>
        <Top/>
        <TreeList data = {root}/>
    </div>
  );
}

function pushToDb(task) {



}

function Top() {

  const [task, setTask] = useState("")

  return (
    <span>
      <input id="task-input" type="text" value={task} onInput={(event) =>  {setTask(event.target.value)} } placeholder="Enter a new task"/>
      <button id="add-button" onClick={(event) => console.log(event) } >Add</button>
    </span>
    );
}



export default App;
