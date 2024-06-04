import TasksAPI from "./TasksAPI.js";
import TasksView from "./TasksView.js";

console.log(TasksAPI.getData());

const root = document.querySelector("#root");
const view = new TasksView(root, {
    onFrameCreate(frameName) {
        console.log("Frame created: " + frameName);
    }
});

view.updateFramesView(TasksAPI.getData());
