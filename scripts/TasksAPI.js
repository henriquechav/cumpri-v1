/**  
 *   TasksAPI works like a Model (from MVC pattern) in my project.
 *   
 *   For now, it dialogues with browser localStorage to persist data.
 *   
 *   It receives titles and tasks status from the user, and manages
 *   IDs and taskSet percentage (our business logic).  
 * 
 */

/*  DATA TEMPLATE

const templateData = [{
    id: 1,
    name: "Tarefas",
    groupList: [{
        id: 1,
        title: "Para hoje",
        percentage: 0,
        taskList: [{
            pos: 1,
            desc: "Fazer faxina",
            done: false
        },{
            pos: 2,
            desc: "Ler a Ilíada de Homero",
            done: false
        }]
    }]
}];

localStorage.setItem("mytasks-data", JSON.stringify(templateData));

*/

export default class TasksAPI {
    static getData() {
        const data = JSON.parse(localStorage.getItem("mytasks-data") || "[]");

        return data;
    }

    static createFrame(frameToCreate) {
        const frameList = TasksAPI.getData();

        frameToCreate.groupList = [];

        // create id for new frame
        const amountOfFrames = frameList.length;
        frameToCreate.id = amountOfFrames > 0 ? (frameList[amountOfFrames-1].id + 1) : 1;

        frameList.push(frameToCreate);

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static createGroup(frameId, groupToCreate) { 
        const frameList = TasksAPI.getData();
        const frameParent = frameList.find(frame => frame.id == frameId);
        const groupList = frameParent.groupList;

        // create id for new group
        const amountOfgroup = groupList.length;
        groupToCreate.id = amountOfgroup > 0 ? (groupList[amountOfgroup-1].id + 1) : 1;
    
        groupToCreate.percentage = 0;

        const taskList = groupToCreate.taskList;
        // create positioning on list for each task
        for (let i = 0; i < taskList.length; i++) {
            taskList[i].pos = i + 1;
        }

        frameParent.groupList.push(groupToCreate);

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static updateFrameName(frameToUpdate) {
        const frameList = TasksAPI.getData();
        const existing = frameList.find(frame => frame.id == frameToUpdate.id);

        existing.name = frameToUpdate.name;

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static updateGroup(frameId, groupToUpdate) {
        const frameList = TasksAPI.getData();
        const parentFrame = frameList.find(frame => frame.id == frameId);
        const existing = parentFrame.groupList.find(group => group.id == groupToUpdate.id);

        // calculate updated group percentage
        const amountOfTasks = groupToUpdate.taskList.length;
        const amountOfDone = groupToUpdate.taskList.reduce((total, task) => {
            return task.done ? (total + 1) : total;
        }, 0);
        groupToUpdate.percentage = (amountOfDone / amountOfTasks) * 100;
    
        // create new tasks positioning (reorder), or recreate old ones
        for (let i = 0; i < groupToUpdate.taskList.length; i++) {
            groupToUpdate.taskList[i].pos = i + 1;
        }

        existing.percentage = groupToUpdate.percentage;
        existing.title = groupToUpdate.title;
        existing.taskList = groupToUpdate.taskList;

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }

    static deleteFrame(frameId) {
        const frameList = TasksAPI.getData();
        // create new frame list without deleted frame
        const newFrameList = frameList.filter(frame => frame.id != frameId);

        localStorage.setItem("mytasks-data", JSON.stringify(newFrameList));
    }

    static deleteGroup(frameId, groupId) {
        const frameList = TasksAPI.getData();
        const parentFrame = frameList.find(frame => frame.id == frameId);
        // create new taskSetList without deleted taskSet
        const newGroupList = parentFrame.groupList.filter(group => group.id != groupId);
    
        parentFrame.groupList = newGroupList;

        localStorage.setItem("mytasks-data", JSON.stringify(frameList));
    }
}

