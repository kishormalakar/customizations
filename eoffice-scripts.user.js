// ==UserScript==
// @name         E-office
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  try to take over the world!
// @author       You
// @match        https://ecr.eoffice.railnet.gov.in/efile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        "use strict";

        var body = document.querySelectorAll("body")[0];

        document.addEventListener('click', (e) => {

            if (e.target.id == "quick-note-button") {

                var main_content = document.querySelectorAll(".main-content")[0];
                var utility_panel = main_content.querySelectorAll(".utility_panel")[0];
                var quick_note_button = utility_panel.querySelectorAll("#quick-note-button")[0];

                var quick_noting_container = body.querySelectorAll("quick-noting-container")[0];

                var language_box = quick_noting_container.querySelectorAll(".col-language-header")[0];
                var standard_input = language_box.children[0].querySelectorAll("input")[0];
                var user_defined_input = language_box.children[1].querySelectorAll("input")[0];
                user_defined_input.click();

            }

            if (e.target.classList.contains("bg-green-note") && e.target.getAttribute("data-id-attr") != "checkBox") {

                var quick_noting_container = body.querySelectorAll("quick-noting-container")[0];

                e.target.previousElementSibling.querySelectorAll("input")[0].click();
                quick_noting_container.querySelectorAll("button[data-id-attr='addButton']")[0].click();

            }

        });

    },
    false
);