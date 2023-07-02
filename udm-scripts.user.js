// ==UserScript==
// @name         UDM
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/iMMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    var pathname = location.pathname;

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

    if (pathname.startsWith("/iMMS/searchPurchaseOrders")) {
        var purchaseOrderDetailsForm = document.querySelectorAll("#purchaseOrderDetailsForm")[0];
        var buttonRow = purchaseOrderDetailsForm.lastChild.previousElementSibling.previousElementSibling.previousElementSibling.querySelectorAll("div")[0];
        window.console.log(buttonRow);

        buttonRow.classList.add("offset-md-12", "offset-sm-12", "col-md-12", "cos-sm-12");
        buttonRow.classList.remove("offset-md-6", "offset-sm-6", "col-md-6", "cos-sm-6");
        buttonRow.style.display = "flex";
        buttonRow.style.justifyContent = "space-between";

        var button1 = document.createElement("button");
        var text1 = document.createTextNode("Backward 1 Year");
        button1.appendChild(text1);
        button1.classList.add("btn");
        button1.classList.add("btn-outline");

        buttonRow.querySelectorAll("button")[0].insertAdjacentElement("beforebegin", button1);

        var button2 = document.createElement("button");
        var text2 = document.createTextNode("Forward 1 Year");
        button2.appendChild(text2);
        button2.classList.add("btn");
        button2.classList.add("btn-outline");

        buttonRow.querySelectorAll("button")[2].insertAdjacentElement("afterend", button2);

        button1.addEventListener('click', function (event) {
            var dateFrom = buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[0].value;
            var dateTo = buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[1].value;

            var dateFromArray = dateFrom.split("-");
            var dateFromNew = dateFromArray[0] + "-" + dateFromArray[1] + "-" + (+dateFromArray[2] - 1);
            var dateToArray = dateTo.split("-");
            var dateToNew = dateToArray[0] + "-" + dateToArray[1] + "-" + (+ dateToArray[2] - 1);

            buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[0].value = dateFromNew;
            buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[1].value = dateToNew;
            buttonRow.children[1].click();
        });

        button2.addEventListener('click', function (event) {
            var dateFrom = buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[0].value;
            var dateTo = buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[1].value;

            var dateFromArray = dateFrom.split("-");
            var dateFromNew = dateFromArray[0] + "-" + dateFromArray[1] + "-" + (+dateFromArray[2] + 1);
            var dateToArray = dateTo.split("-");
            var dateToNew = dateToArray[0] + "-" + dateToArray[1] + "-" + (+ dateToArray[2] + 1);

            buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[0].value = dateFromNew;
            buttonRow.parentElement.previousElementSibling.querySelectorAll("input")[1].value = dateToNew;
            buttonRow.children[1].click();
        });
    }
})();
