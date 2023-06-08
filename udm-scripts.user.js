// ==UserScript==
// @name         UDM
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/iMMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	/*var sideNavBar = document.querySelectorAll("#sidenavbar")[0];
	sideNavBar.style.marginLeft = "-250px";*/

	/*sideNavBar.querySelectorAll("#nabbar_close")[0].style.display = "none";
    sideNavBar.querySelectorAll("#nabbar_open")[0].style.display = "inline-block";*/

	var sideNavBar = document.querySelectorAll("#sidenavbar")[0];
	var sideNavBarUser = sideNavBar.querySelectorAll(".sidebar-user")[0];
	var sideNavBarMenu = sideNavBar.querySelectorAll("#side-navbar-div")[0];

	var sideNavBarUserClone = sideNavBarUser.cloneNode(true);
	var sideNavBarMenuClone = sideNavBarMenu.cloneNode(true);

	var mainContentColumn = document.querySelectorAll("#main_content_col")[0];
	var mainContentNav = mainContentColumn.querySelectorAll(":scope > nav")[0];
	var navBarActions = mainContentColumn.querySelectorAll("#navbar_actions")[0];

	navBarActions.insertBefore(sideNavBarUserClone, navBarActions.children[0]);
	mainContentColumn.insertBefore(sideNavBarMenuClone, mainContentColumn.children[2]);

	sideNavBarUser.remove();
	sideNavBarMenu.remove();

	var menuHome = sideNavBarMenuClone.children[0].children[0];
	var menuOthers = sideNavBarMenuClone.children[0].children[1].children[3];

	var menuHomeClone = menuHome.cloneNode(true);
	menuOthers.insertBefore(menuHomeClone, menuOthers.children[0]);
	menuHome.remove();

	var mainContainerFluid = mainContentColumn.querySelectorAll(":scope > .container-fluid")[0];
	var subNav = mainContainerFluid.previousElementSibling;
	var subNavClone = subNav.cloneNode(true);

	mainContainerFluid
		.querySelectorAll(".row")[0]
		.querySelectorAll("div")[0]
		.insertBefore(
			subNavClone,
			mainContainerFluid.querySelectorAll(".row")[0].querySelectorAll("div")[0].children[0]
		);
	subNav.remove();
})();
