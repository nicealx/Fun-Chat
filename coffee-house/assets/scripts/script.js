document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  const headerMenu = document.querySelector(".header__menu");
  const headerMenuBurger = document.querySelector(".header__menu-burger");
  const headerMenuLink = headerMenu.querySelectorAll(".header__menu-link");

  headerMenuBurger.addEventListener("click", function () {
    this.classList.toggle("burger--open");
    headerMenu.classList.toggle("header__menu--open");
    body.classList.toggle("no-scroll");
  });

  headerMenu.addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("header__menu-link")) {
      headerMenuBurger.classList.toggle("burger--open");
      headerMenu.classList.toggle("header__menu--open");
      body.classList.toggle("no-scroll");
    }
  });
});
