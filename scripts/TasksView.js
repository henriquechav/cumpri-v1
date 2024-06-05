export default class TasksView {
    constructor(root, { onFrameSelect, onFrameCreate, onFrameUpdate, onFrameDelete, onGroupCreate, onGroupUpdate, onGroupDelete }) {
        this.root = root;
        // setting up handlers to comunicate with App
        this.onFrameSelect = onFrameSelect;
        this.onFrameCreate = onFrameCreate;
        this.onFrameUpdate = onFrameUpdate;
        this.onFrameDelete = onFrameDelete;
        this.onGroupCreate = onGroupCreate;
        this.onGroupUpdate = onGroupUpdate;
        this.onGroupDelete = onGroupDelete;
        // initializing modal views to interact with user
        this._initCreateFrameModal();
        this._initEditFrameModal();
        this._initCreateGroupModal();
    }

    
    updateFramesView(frameList) {
        const frameListContainer = this.root.querySelector(".sidebar__frame-list");
        
        frameListContainer.innerHTML = "";
        
        for (const frame of frameList) {
            const html = this._createFrameItemHTML(frame.name, frame.id);
            frameListContainer.insertAdjacentHTML("beforeend", html);
        }

        // add edit button for each frame item
        
        frameListContainer.querySelectorAll(".sidebar__frame-list-item").forEach(frameButton => {
            const editFrameIcon = frameButton.firstElementChild;
            
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
    }

    updateGroupsView() {

    }

    _initCreateFrameModal() {
        /* INITIALIZE CREATE FRAME MODAL */

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
        /* INITIALIZE EDIT FRAME MODAL */

        const editFrameModal = this.root.querySelector("#edit-frame-modal");
        const deleteFrameButton = this.root.querySelector("#edit-frame-delete");
        const editFrameButton = this.root.querySelector("#edit-frame-submit");
        const editFrameInput = this.root.querySelector("#edit-frame-input");

        editFrameButton.addEventListener("click", () => {
            const frameIdToUpdate = editFrameModal.dataset.frameId;
            const frameNameToUpdate = editFrameInput.value;

            if (editFrameModal.dataset.frameName == frameNameToUpdate) {
                editFrameModal.close();
            } else {
                onFrameUpdate(frameIdToUpdate, frameNameToUpdate);
                editFrameModal.close();
            }
        });

        deleteFrameButton.addEventListener("click", () => {
            const frameToDeleteId = editFrameModal.dataset.frameId;
            onFrameDelete(frameToDeleteId);
            editFrameModal.close();
        });
    }

    _initCreateGroupModal() {
        /* INITIALIZE CREATE GROUP MODAL */

        const createGroupModal = this.root.querySelector("#create-group-modal");
        const createGroupButton = this.root.querySelector("#create-group-button");
        const createGroupCancel = this.root.querySelector("#create-group-cancel");
        const createGroupInput = this.root.querySelector("#create-group-input");
        const taskInputContainer = this.root.querySelector(".modal-input-list");

        createGroupButton.addEventListener("click", () => {
            createGroupModal.showModal();
        });
        
        createGroupCancel.addEventListener("click", () => {
            while (taskInputContainer.children.length > 1) {
                taskInputContainer.removeChild(taskInputContainer.lastChild);
            }

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

            taskInputList.forEach(taskInput => {
                if (taskInput.value != "") {
                    taskList.push(taskInput.value); 
                }
            })

            if (groupTitle != "") { 
                onGroupCreate(groupTitle, taskList);
                while (taskInputContainer.children.length > 1) {
                    taskInputContainer.removeChild(taskInputContainer.lastChild);
                }
    
                taskInputContainer.querySelector(".modal-input--task").value = "";
                createGroupInput.value = "";
                createGroupModal.close();            
            }
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
}
