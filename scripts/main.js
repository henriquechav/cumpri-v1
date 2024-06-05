import TasksAPI from "./TasksAPI.js";
import TasksView from "./TasksView.js";

const headerMenu = document.querySelector(".header__menu-icon");
const sidebar = document.querySelector(".sidebar");

headerMenu.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar--hidden");
});

console.log(TasksAPI.getData());

const root = document.querySelector("#root");
const view = new TasksView(root, {
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
    }
});

view.updateFramesView(TasksAPI.getData());
