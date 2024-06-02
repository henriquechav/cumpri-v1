/*  HEADER MENU BUTTON  */

const headerMenu = document.querySelector("#header-menu-icon");
const sidebar = document.querySelector("#app-sidebar");

console.log(sidebar);

headerMenu.addEventListener("click", (e) => {
  sidebar.classList.toggle("hidden");
});

/*  FRAME MODAL  */

const createFrameModal = document.querySelector("#create-frame-modal");
const createFrameBtn = document.querySelector("#create-frame-button");

createFrameBtn.addEventListener("click", (e) => {
  createFrameModal.showModal();
});

const cancelModal = document.querySelector("#create-frame-cancel");

cancelModal.addEventListener("click", (e) => {
  createFrameModal.close();
});
