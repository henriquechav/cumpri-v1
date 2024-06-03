export default class TasksAPI {
    getData() {
        return [{
            frameId: 1,
            frameTitle: "Tarefas",
            taskSetList: [{
                taskSetId: 1,
                taskSetTitle: "Tarefas do Dia",
                percentage: 33,
                taskList: [{
                    taskId: 1,
                    text: "Fazer faxina",
                    status: "done"
                }, {
                    taskId: 2,
                    text: "Ler a Ilíada",
                    status: "waiting"
                }]
            }]
        }];
    }

    saveData() {

    }

    deleteData() {

    }
}

