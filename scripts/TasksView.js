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

    }

    updateFramesView(frameList) {
        const frameListContainer = this.root.querySelector(".sidebar__frame-list");

        frameListContainer.innerHTML = "";

        for (const frame of frameList) {
            const html = this._createFrameItemHTML(frame.name);
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
                this._initEditFrameModal()
                // editFrameInput.value = frameButton.innerHTML
                // .replace(
                //     '<span class="material-symbols-outlined button-icon" style="display: inherit;">edit</span>',
                //     ""
                // ).trim();
                // editFrameModal.showModal();
            });
        });
    }

    updateGroupsView() {

    }

    _initFrameModal() {
        
    }

    _createFrameItemHTML(frameName) {
        return `
            <li class="button sidebar__frame-list-item">
                <span class="material-symbols-outlined button-icon">edit</span>
                ${frameName}
            </li>
        `;
    }
}
