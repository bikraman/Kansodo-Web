export default class TaskNode {

    constructor(value) {
      this.children = []
      this.value = value
    }
  
    addChild(node) {
      this.children.push(node)
    }
  }