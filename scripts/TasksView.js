export default class TasksView {
    constructor(root, { onFrameSelect, onFrameCreate, onFrameUpdate, onFrameDelete, onGroupCreate, onGroupUpdate, onGroupDelete, onTaskDone }) {
        this.root = root;

        // setting up handlers to comunicate with App
        this.onFrameSelect = onFrameSelect;
        this.onFrameCreate = onFrameCreate;
        this.onFrameUpdate = onFrameUpdate;
        this.onFrameDelete = onFrameDelete;
        this.onGroupCreate = onGroupCreate;
        this.onGroupUpdate = onGroupUpdate;
        this.onGroupDelete = onGroupDelete;
        this.onTaskDone = onTaskDone;

        // initializing modal views to interact with user
        this._initCreateFrameModal();
        this._initEditFrameModal();
        this._initCreateGroupModal();
        this._initEditGroupModal();
    }

    
    updateFramesView(frameList) {
        const frameListContainer = this.root.querySelector(".sidebar__frame-list");
        
        frameListContainer.innerHTML = "";
        
        for (const frame of frameList) {
            const html = this._createFrameItemHTML(frame.name, frame.id);
            frameListContainer.insertAdjacentHTML("beforeend", html);
        }

        const frameButtonList = frameListContainer.querySelectorAll(".sidebar__frame-list-item");

        // ADD EDIT BUTTON FOR EACH FRAME ITEM 
        frameButtonList.forEach(frameButton => {
            const editFrameIcon = frameButton.firstElementChild;
            editFrameIcon.style.display = "none";
            
            // show edit icon only when mouse is over frame button
            frameButton.addEventListener("mouseover", () => {
                editFrameIcon.style.display = "inherit";
            });
            frameButton.addEventListener("mouseleave", () => {
                editFrameIcon.style.display = "none";
            });
                        
            editFrameIcon.addEventListener("click", () => {
                // set edit frame modal input with frame name
                const editFrameInput = this.root.querySelector("#edit-frame-input");
                editFrameInput.value = frameButton.dataset.frameName;
                
                // put frameId and frameName in modal dataset
                const editFrameModal = this.root.querySelector("#edit-frame-modal");
                editFrameModal.dataset.frameId = frameButton.dataset.frameId;
                editFrameModal.dataset.frameName = frameButton.dataset.frameName;
                editFrameModal.showModal();
            });
        });

        // ADD SELECTED OPTION FOR EACH FRAME ITEM
        frameButtonList.forEach(frameButton => {
            frameButton.addEventListener("click", () => {
                const frameId = frameButton.dataset.frameId;
                this.onFrameSelect(frameId);
            });
        }); 
    }

    updateSelectedFrame(frame) {
        this._updateGroupsView(frame.groupList);

        const frameList = this.root.querySelectorAll(".sidebar__frame-list-item");
        for (const frameListItem of frameList) {
            if (frameListItem.dataset.frameId == frame.id) {
                frameListItem.classList.add("sidebar__frame-list-item--selected"); 
            } else {
                frameListItem.classList.remove("sidebar__frame-list-item--selected");
            }
        }
    }

    _updateGroupsView(groupList) {
        const groupListContainer = this.root.querySelector(".main");

        // empty group views
        const groupColumnList = groupListContainer.querySelectorAll(".main__column");
        groupColumnList.forEach(groupColumn => {
            groupColumn.innerHTML = "";
        });

        // distribute groups into the three columns
        let cnt = 0; // counter
        for (const group of groupList) {
            const html = this._createTaskWrapperHTML(group);
            groupColumnList[cnt].insertAdjacentHTML("beforeend", html);
            
            if (cnt == (groupColumnList.length-1)) {
                cnt = 0;
            } else {
                cnt = cnt + 1;
            }
        }

        // permit mark tasks as done, if it isn't
        const doneButtonList = groupListContainer.querySelectorAll(".done-button-icon");

        doneButtonList.forEach(doneButton => {
            const taskItem = doneButton.parentElement;

            if (taskItem.dataset.taskDone == "false") {
                doneButton.addEventListener("mouseover", () => {
                    doneButton.innerHTML = "check";
                });
    
                doneButton.addEventListener("mouseleave", () => {
                    doneButton.innerHTML = "radio_button_unchecked";
                });
    
                doneButton.addEventListener("click", () => {
                    const groupId = taskItem.dataset.groupId;
                    const taskPos = taskItem.dataset.taskPos;
    
                    this.onTaskDone(groupId, taskPos);
                });   
            }
        });

        // add edit group icon functionality
        const editGroupIconList = groupListContainer.querySelectorAll(".edit-group-icon");
        const editGroupModal = this.root.querySelector("#edit-group-modal");
        const editGroupInput = editGroupModal.querySelector("#edit-group-input");
        const editGroupButton = editGroupModal.querySelector("#edit-group-submit");
        const deleteGroupButton = editGroupModal.querySelector("#edit-group-cancel");
        const taskInputList = editGroupModal.querySelector(".modal-input-list");

        editGroupIconList.forEach(editGroupIcon => {
            const groupClicked = groupList.find(group => group.id == editGroupIcon.dataset.groupId); 
            
            editGroupIcon.addEventListener("click", () => {
                editGroupModal.dataset.groupId = groupClicked.id;
                editGroupModal.dataset.groupTitle = groupClicked.title;

                editGroupInput.value = groupClicked.title;

                taskInputList.innerHTML = "";

                for (const task of groupClicked.taskList) {
                    taskInputList.insertAdjacentHTML("beforeend", this._createTaskInputItemHTML());
                    const taskInputWrapper = taskInputList.lastElementChild;
                    taskInputWrapper.firstElementChild.value = task.desc;
                    taskInputWrapper.dataset.taskDone = task.done;
                }

                editGroupModal.showModal();
            });
        });
    }

    _initCreateFrameModal() {
        const createFrameModal = this.root.querySelector("#create-frame-modal");
        const createFrameButton = this.root.querySelector("#create-frame-button");
        const createFrameCancel = this.root.querySelector("#create-frame-cancel");
        
        createFrameButton.addEventListener("click", () => {
            createFrameModal.showModal();
        });
        
        createFrameCancel.addEventListener("click", () => {
            createFrameModal.close();
        });
        
        const createFrameSubmit = this.root.querySelector("#create-frame-submit");
        const frameNameInput = this.root.querySelector("#create-frame-input");
        
        createFrameSubmit.addEventListener("click", () => {
            const newFrameName = frameNameInput.value.trim();

            if (newFrameName != "") {
                this.onFrameCreate(newFrameName)
                frameNameInput.value = "";
                createFrameModal.close();
            } 
        });
    }

    _initEditFrameModal() {
        const editFrameModal = this.root.querySelector("#edit-frame-modal");
        const deleteFrameButton = this.root.querySelector("#edit-frame-delete");
        const editFrameButton = this.root.querySelector("#edit-frame-submit");
        const editFrameInput = this.root.querySelector("#edit-frame-input");

        editFrameButton.addEventListener("click", () => {
            const frameIdToUpdate = editFrameModal.dataset.frameId;
            const frameNameToUpdate = editFrameInput.value;

            // if updating to existing frame name, nothing happens and modal is closed
            if (editFrameModal.dataset.frameName == frameNameToUpdate) {
                editFrameModal.close();
            } else {
                this.onFrameUpdate(frameIdToUpdate, frameNameToUpdate);
                editFrameModal.close();
            }
        });

        deleteFrameButton.addEventListener("click", () => {
            const frameToDeleteId = editFrameModal.dataset.frameId;
            this.onFrameDelete(frameToDeleteId);
            editFrameModal.close();
        });
    }

    _initCreateGroupModal() {
        const createGroupModal = this.root.querySelector("#create-group-modal");
        const createGroupButton = this.root.querySelector("#create-group-button");
        const createGroupCancel = this.root.querySelector("#create-group-cancel");
        const createGroupInput = this.root.querySelector("#create-group-input");

        const taskInputContainer = this.root.querySelector(".modal-input-list");

        createGroupButton.addEventListener("click", () => {
            createGroupModal.showModal();
        });
        
        createGroupCancel.addEventListener("click", () => {
            // reduce the number of task inputs to only one
            while (taskInputContainer.children.length > 1) {
                taskInputContainer.removeChild(taskInputContainer.lastChild);
            }

            // clear input values
            taskInputContainer.querySelector(".modal-input--task").value = "";
            createGroupInput.value = "";
            createGroupModal.close();
        });

        // add and remove task inputs
        const addTaskInput = this.root.querySelector(".task-add-icon");
        const removeTaskInput = this.root.querySelector(".task-remove-icon");

        addTaskInput.addEventListener("click", () => {
            taskInputContainer.insertAdjacentHTML("beforeend", this._createTaskInputItemHTML().trim());
            taskInputContainer.scrollTop = taskInputContainer.scrollHeight;
        });

        removeTaskInput.addEventListener("click", () => {
            if (taskInputContainer.children.length > 1) {
                taskInputContainer.removeChild(taskInputContainer.lastChild);
            }
        });

        // init submit button to create new group of tasks
        const createGroupSubmit = this.root.querySelector("#create-group-submit");

        createGroupSubmit.addEventListener("click", () => {
            const groupTitle = createGroupInput.value;
            const taskInputList = taskInputContainer.querySelectorAll(".modal-input--task");
            const taskList = [];

            // push every task input value into taskList (if it's not empty)
            taskInputList.forEach(taskInput => {
                if (taskInput.value != "") {
                    taskList.push(taskInput.value); 
                }
            })

            if (groupTitle != "") { 
                this.onGroupCreate(groupTitle, taskList);

                // clear inputs after send info
                while (taskInputContainer.children.length > 1) {
                    taskInputContainer.removeChild(taskInputContainer.lastChild);
                }
                taskInputContainer.querySelector(".modal-input--task").value = "";
                createGroupInput.value = "";
                createGroupModal.close();            
            }
        });
    }

    _initEditGroupModal() {
        const editGroupModal = this.root.querySelector("#edit-group-modal");
        const editGroupInput = editGroupModal.querySelector("#edit-group-input");
        const editGroupButton = editGroupModal.querySelector("#edit-group-submit");
        const deleteGroupButton = editGroupModal.querySelector("#edit-group-cancel");
        const taskInputList = editGroupModal.querySelector(".modal-input-list");

        editGroupButton.addEventListener("click", () => {
            const groupId = editGroupModal.dataset.groupId;
            const groupTitle = editGroupInput.value.trim();
            const taskList = [];

            taskInputList.querySelectorAll(".modal-input-wrapper").forEach(taskWrapper => {
                if (taskWrapper.firstElementChild.value != "") {
                    taskList.push({
                        desc: taskWrapper.firstElementChild.value.trim(),
                        done: taskWrapper.dataset.taskDone ? taskWrapper.dataset.taskDone : false
                    });
                }
            });
            
            if (groupTitle != "") {
                this.onGroupUpdate(groupId, groupTitle, taskList);
                editGroupModal.close();
            }
        });

        deleteGroupButton.addEventListener("click", () => {
            this.onGroupDelete(editGroupModal.dataset.groupId); 
            editGroupModal.close();
        });
    }

    _createFrameItemHTML(frameName, frameId) {
        return `
            <li class="button sidebar__frame-list-item" data-frame-id="${frameId}" data-frame-name="${frameName}">
                <span class="material-symbols-outlined button-icon">edit</span>
                ${frameName}
            </li>
        `;
    }

    _createTaskInputItemHTML() {
        return `
            <div class="modal-input-wrapper">
                <input class="modal-input modal-input--task" type="text" placeholder="tarefa"/>
                <span class="material-symbols-outlined drag-task-icon unselectable">drag_indicator</span>
            </div>
        `;
    }

    _createTaskWrapperHTML(group) {
        return `
            <div class="main__task-wrapper" data-group-id="${group.id}">
                <div class="task-wrapper__progress-bar">
                    <div class="task-wrapper__progress-bar-fill" style="width: ${group.percentage}%;"></div>
                    <span class="task-wrapper__progress-bar-percentage">${Math.trunc(group.percentage)}%</span>
                </div>
                <h3 class="task-wrapper__title">
                    ${group.title}
                    <span class="material-symbols-outlined unselectable edit-group-icon" data-group-id="${group.id}">more_vert</span>
                </h3>
                ${this._createTaskListHTML(group.taskList, group.id)}
            </div> 
        `;
    }

    _createTaskListHTML(taskList, groupId) {
        let html = `<ul class="task-wrapper__list">`;

        for (const task of taskList) {
            html = html + `
                <li class="task-wrapper__task ${task.done ? "task-wrapper__task--done" : ""}" 
                data-task-pos="${task.pos}" data-group-id="${groupId}" data-task-done="${task.done}">
                    <span class="material-symbols-outlined unselectable done-button-icon">${task.done ? "check" : "radio_button_unchecked"}</span>
                    ${task.desc}
                </li>
            `;
        }

        html = html + "</ul>";

        return html;
    }
}
