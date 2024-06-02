/*  HEADER MENU  */

const headerMenu = document.querySelector(".header-menu");
const sidebar = document.querySelector(".main-container > aside");

console.log(sidebar);

headerMenu.addEventListener("click", (e) => {
  sidebar.classList.toggle("hidden");
});
