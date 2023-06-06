// ==UserScript==
// @name         UDM
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/iMMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	var sideNavBar = document.querySelectorAll("#sidenavbar")[0];
	sideNavBar.style.marginLeft = "-250px";

	/*sideNavBar.querySelectorAll("#nabbar_close")[0].style.display = "none";
    sideNavBar.querySelectorAll("#nabbar_open")[0].style.display = "inline-block";*/
})();
