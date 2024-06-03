/* ------------- HIDE MENU ------------- */

const headerMenu = document.querySelector("#header-menu-icon");
const sidebar = document.querySelector("#app-sidebar");

headerMenu.addEventListener("click", (event) => {
  sidebar.classList.toggle("hidden");
});

/* ------------- END OF HIDE MENU ------------- */

/* ------------- ADD FRAME EDIT ICON ------------- */

const frameButtonList = document.querySelectorAll(".frame-list .button");
frameButtonList.forEach((frameButton) => addEditFeature(frameButton));

/* ------------- END OF ADD FRAME EDIT ICON ------------- */

/* ------------- CREATE FRAME MODAL ------------- */

const createFrameModal = document.querySelector("#create-frame-modal");
const createFrameButton = document.querySelector("#create-frame-button");
const createFrameCancel = document.querySelector("#create-frame-cancel");

createFrameButton.addEventListener("click", (event) => {
  createFrameModal.showModal();
});

createFrameCancel.addEventListener("click", (event) => {
  createFrameModal.close();
});

const frameNameInput = document.querySelector("#create-frame-input");
const frameList = document.querySelector("#app-sidebar .frame-list");
const createFrameSubmit = document.querySelector("#create-frame-submit");

createFrameSubmit.addEventListener("click", (event) => {
  const newFrameName = frameNameInput.value.trim();
  if (newFrameName != "") {
    const newFrame = document.createElement("li");
    newFrame.innerHTML =
      '<span class="material-symbols-outlined button-icon">edit</span>' +
      newFrameName;
    newFrame.classList.add("button");
    newFrame.firstElementChild;
    addEditFeature(newFrame);

    frameList.append(newFrame);

    frameNameInput.value = "";
    createFrameModal.close();
  }
});

/* ------------- END OF CREATE FRAME MODAL ------------- */

/* ------------- EDIT FRAME MODAL ------------- */

const editFrameModal = document.querySelector("#edit-frame-modal");
const deleteFrameButton = document.querySelector("#edit-frame-delete");
const editFrameButton = document.querySelector("#edit-frame-submit");
const editFrameInput = document.querySelector("#edit-frame-input");

/* ------------- END OF EDIT FRAME MODAL ------------- */

/* ------------- FUNCTIONS ------------- */

function addEditFeature(frameButton) {
  const editFrameIcon = frameButton.firstElementChild;

  frameButton.addEventListener("mouseover", (event) => {
    editFrameIcon.style.display = "inherit";
  });

  frameButton.addEventListener("mouseleave", (event) => {
    editFrameIcon.style.display = "none";
  });

  editFrameIcon.addEventListener("click", (event) => {
    editFrameInput.value = frameButton.innerHTML
      .replace(
        '<span class="material-symbols-outlined button-icon" style="display: inherit;">edit</span>',
        ""
      )
      .trim();
    editFrameModal.showModal();
  });
}

/* ------------- END OF FUNCTIONS ------------- */
