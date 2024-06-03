import TasksView from "./TasksView.js";

export default class App {
    
    constructor(root) {
        this.frameList = [];
        this.activeFrame = null;
        this.view = new TasksView(root, this._handlers());
        
        this._refreshTasks();
    }

    _refreshTasks() {
        // const = TasksAPI.getData();
    }

    _handlers() {

    }

}
