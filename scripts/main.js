import TasksAPI from "./TasksAPI.js";

TasksAPI.updateGroup(1, {
    id: 1,
    title: "Hoje",
    taskList: [{
        desc: "Fazer faxina",
        done: true
    },{
        desc: "Ler a Odisseia de Homero",
        done: false
    },{
        desc: "Ler a Ilíada de Homero",
        done: false
    }]
});

console.log(TasksAPI.getData());
