// ==UserScript==
// @name         E-office
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ecr.eoffice.railnet.gov.in/eFile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var inboxListDiv = document.querySelectorAll('.inboxListDiv')[0];
    inboxListDiv.parentElement.classList.add('inboxListDivParent');

})();