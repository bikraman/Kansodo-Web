import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import TreeList from './components/TreeList';

import TaskNode from './models/TaskNode'
import ItemClass from './models/ItemClass';

import generateUUID from './util/UUIDUtils';

function App() {

  const root = new TaskNode(new ItemClass(420, null, "Write something"));

  root.addChild(new TaskNode(new ItemClass(1, 420, "Become great")));

  root.addChild(new TaskNode(new ItemClass(2, 420, "Fix bugs reported by QA team.")));
  root.addChild(new TaskNode(new ItemClass(3, 420, "Conduct code review for pull requests")));
  root.addChild(new TaskNode(new ItemClass(4, 420, "Update documentation for API endpoints")));

  root.children[0].addChild(new TaskNode(new ItemClass(5, 1, "Implement user authentication system")));
  root.children[0].addChild(new TaskNode(new ItemClass(6, 1, "Design user interface for the dashboard")));

  root.children[0].children[1].addChild(new TaskNode(new ItemClass(7, 6, "Make figma prototype")))

  const [taskRoot, setTaskTreeRoot] = useState(root)


  return (
    <div className='main'>
        <h1 id="my">Kansodo</h1>
        <Top  onAddTask = {(task) => {

          const newTaskRoot = new TaskNode(taskRoot.value, taskRoot.children)

          newTaskRoot.addChild(new TaskNode(new ItemClass(generateUUID(), 420, task, newTaskRoot.children.length)))
          console.log(newTaskRoot)
          setTaskTreeRoot(newTaskRoot)
        }}/>
        <TreeList data = {taskRoot} onDelete={(taskId) => {
          const updatedChildren = taskRoot.children.filter((value) => value.value.id !== taskId )
          setTaskTreeRoot(new TaskNode(taskRoot.value, updatedChildren))
        }}/>
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
