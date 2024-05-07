export default class TaskNode {

    constructor(value, children) {
      this.children = children ?? []
      this.value = value
    }
  
    addChild(node) {
      this.children.push(node)
    }
  }