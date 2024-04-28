export default class ItemClass {

    constructor(id, parentId, data, sortOrder) {
      this.id = id;
      this.parentId = parentId;
      this.data = data;
      this.sortOrder = sortOrder;
      this.isCompleted = false;
      this.isExpanded = true;
      this.dateAdded = new Date();
    }
  }
  