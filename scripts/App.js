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
            onFrameCreate: frameName => {
                const newFrame = {
                    name: frameName
                };

                TasksAPI.createFrame(newFrame);

                this._refreshTasks();
                this._setActiveFrame(this.frameList[this.frameList.length-1]);
            },
            onFrameUpdate: (frameId, frameName) => {
                const frameUpdated = {
                    id: frameId,
                    name: frameName
                };

                TasksAPI.updateFrameName(frameUpdated);

                this._refreshTasks();

                const selectedFrame = this.frameList.find(frame => frame.id == frameId);
                this._setActiveFrame(selectedFrame);
            }, 
            onFrameDelete: frameId => {
                TasksAPI.deleteFrame(frameId);

                this._refreshTasks();

                if (this.frameList.length > 0) {
                    this._setActiveFrame(this.frameList[0]);
                } else {
                    // clear groups view if there is no frame
                    this._setActiveFrame({groupList: []});
                }
            },
            onGroupCreate: (groupTitle, taskList) => {
                // create frame if there isn't any active
                if (this.activeFrame == null) {
                    TasksAPI.createFrame({name: "Tarefas"});
                    this._refreshTasks();
                    this._setActiveFrame(this.frameList[0]);
                } 

                const newTaskList = taskList.map(taskDesc => {
                    return {
                        desc: taskDesc,
                        done: false
                    };
                });

                TasksAPI.createGroup(this.activeFrame.id, {
                    title: groupTitle,
                    taskList: newTaskList
                });

                // reload groups view
                this._refreshTasks();

                const selectedFrame = this.frameList.find(frame => frame.id == this.activeFrame.id);
                this._setActiveFrame(selectedFrame);
            },
            onFrameSelect: frameId => {                
                const selectedFrame = this.frameList.find(frame => frame.id == frameId);
                
                this._setActiveFrame(selectedFrame);
            },
            onTaskDone: (groupId, taskPos) => {
                const groupToUpdate = this.activeFrame.groupList.find(group => group.id == groupId);
                groupToUpdate.taskList[taskPos-1].done = true;

                TasksAPI.updateGroup(this.activeFrame.id, groupToUpdate);

                this._refreshTasks();
                const selectedFrame = this.frameList.find(frame => frame.id == this.activeFrame.id);
                this._setActiveFrame(selectedFrame);
            }
        };
    }

}
