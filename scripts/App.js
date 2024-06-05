import TasksAPI from "./TasksAPI.js";
import TasksView from "./TasksView.js";

export default class App {
    
    constructor(root) {
        this.view = new TasksView(root, this._handlers());
        this.activeFrame = null;
        this.frameList = [];
        
        this._refreshTasks();

        if (this.frameList.length > 0) {
            this._setActiveFrame(this.frameList[0]);
        }
    }

    _refreshTasks() {
        this.frameList = TasksAPI.getData();

        this.view.updateFramesView(this.frameList);
    }

    _setActiveFrame(frame) {
        this.activeFrame = frame;
        
        this.view.updateSelectedFrame(frame);
    }

    _handlers() {
        return {
            onFrameCreate(frameName) {
                console.log("Frame created: " + frameName);
            },
            onFrameUpdate(frameId, frameName) {
                console.log("Update frame id " + frameId + " to new name " + frameName);
            }, 
            onFrameDelete(frameId) {
                console.log("Delete frame with id " + frameId);
            },
            onGroupCreate(groupTitle, taskList) {
                console.log("New group " + groupTitle + " created! With list of tasks " + taskList);
            },
            onFrameSelect(frameId) {
                console.log("Frame " + frameId + " was selected!");
            }
        };
    }

}
