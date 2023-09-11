// ==UserScript==
// @name         E-office
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  try to take over the world!
// @author       You
// @match        https://ecr.eoffice.railnet.gov.in/eFile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        "use strict";

        var inboxListDiv = document.querySelectorAll(".inboxListDiv")[0];
        inboxListDiv.parentElement.classList.add("inboxListDivParent");

        var advancedSearch = document.querySelectorAll('[id^="formGlobalSearch"]')[0];
        var diaryDate = advancedSearch.querySelectorAll('input[value="6"]')[0];
        var letterDate = advancedSearch.querySelectorAll('input[value="7"]')[0];
        diaryDate.checked = true;
        letterDate.checked = false;

        var sendFileContainer = document.querySelectorAll(".sendFileContainer")[0];
        var filterAll = sendFileContainer.querySelectorAll(".filterOptions")[0].querySelectorAll("input[value='1']")[0];
        var filterRecent = sendFileContainer.querySelectorAll(".filterOptions")[0].querySelectorAll("input[value='4']")[0];
        filterAll.checked = false;
        filterRecent.checked = true;

    },
    false
);