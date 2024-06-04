/**  
 *   TasksAPI works like a Model (from MVC pattern) in my project.
 *   
 *   For now, it dialogues with browser localStorage to persist data.
 *   
 *   It receives titles and tasks status from the user, and manages
 *   IDs and taskSet percentage (our business logic).  
 * 
 */

export default class TasksAPI {
    static getData() {
        const data = JSON.parse(localStorage.getItem("mytasks-data") || "[]");

        return data;
    }

    static createFrame(frameToCreate) {
        const frameList = TasksAPI.getData();

        frameToCreate.taskSetList = [];

        // create id of new frame
        const amountOfFrames = frameList.length;
        frameToCreate.frameId = amountOfFrames > 0 ? (frameList[amountOfFrames-1].frameId + 1) : 1;

        frameList.push(frameToCreate);

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static createTaskSet(frameId, taskSetToCreate) { 
        const frameList = TasksAPI.getData();
        const frameParent = frameList.find(frame => frame.frameId == frameId);
        const taskSetList = frameParent.taskSetList;

        // create id for new taskSet
        const amountOfTaskSet = taskSetList.length;
        taskSetToCreate.taskSetId = amountOfTaskSet > 0 ? (taskSetList[amountOfTaskSet-1].taskSetId + 1) : 1;
    
        taskSetToCreate.percentage = 0;

        const taskList = taskSetToCreate.taskList;
        // create id for each task
        for (let i = 0; i < taskList.length; i++) {
            taskList[i].taskId = i + 1;
        }

        frameParent.taskSetList.push(taskSetToCreate);

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static updateFrameTitle(frameToUpdate) {
        const frameList = TasksAPI.getData();
        const existing = frameList.find(frame => frame.frameId == frameToUpdate.frameId);

        existing.frameTitle = frameToUpdate.frameTitle;

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static updateTaskSet() {

    }

    static deleteFrame(frameId) {
        const frameList = TasksAPI.getData();
        const newFrameList = frameList.filter(frame => frame.frameId != frameId);

        localStorage.setItem("mytasks-data", JSON.stringify(newFrameList));
    }

    static deleteTaskSet(taskSetId) {

    }
}

