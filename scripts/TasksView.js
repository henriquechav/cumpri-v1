export default class TasksView {
    constructor(root, { onFrameSelect, onFrameCreate, onFrameUpdate, onFrameDelete, onGroupCreate, onGroupUpdate, onGroupDelete }) {
        this.root = root;
        this.onFrameSelect = onFrameSelect;
        this.onFrameCreate = onFrameCreate;
        this.onFrameUpdate = onFrameUpdate;
        this.onFrameDelete = onFrameDelete;
        this.onGroupCreate = onGroupCreate;
        this.onGroupUpdate = onGroupUpdate;
        this.onGroupDelete = onGroupDelete;
    
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

        /* INITIALIZE EDIT FRAME MODAL */

        const editFrameModal = this.root.querySelector("#edit-frame-modal");
        const deleteFrameButton = this.root.querySelector("#edit-frame-delete");
        const editFrameButton = this.root.querySelector("#edit-frame-submit");
        const editFrameInput = this.root.querySelector("#edit-frame-input");

        // TODO: correct confusion with old and new frame name
        editFrameButton.addEventListener("click", () => {
            const frameNameToUpdate = editFrameModal.dataset.frameName;
            const frameIdToUpdate = editFrameModal.dataset.frameId;

            if (editFrameInput.value == frameNameToUpdate) {
                editFrameModal.close();
            } else {
                onFrameUpdate(frameIdToUpdate, frameNameToUpdate);
            }
        });

        deleteFrameButton.addEventListener("click", () => {
            const frameToDeleteId = editFrameModal.dataset.frameId;
            onFrameDelete(frameToDeleteId);
        });
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

    _createFrameItemHTML(frameName, frameId) {
        return `
            <li class="button sidebar__frame-list-item" data-frame-id="${frameId}" data-frame-name="${frameName}">
                <span class="material-symbols-outlined button-icon">edit</span>
                ${frameName}
            </li>
        `;
    }
}
