import App from "./App.js";

const headerMenu = document.querySelector(".header__menu-icon");
const sidebar = document.querySelector(".sidebar");

headerMenu.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar--hidden");
});

const root = document.querySelector("#root");
const app = new App(root);
