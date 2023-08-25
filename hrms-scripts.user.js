// ==UserScript==
// @name         HRMS
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://hrms.indianrail.gov.in/HRMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        var pathname = location.pathname;

        if (pathname.startsWith("/HRMS/login")) {

            var loginForm = document.querySelectorAll("#loginForm")[0];
            var username = loginForm.querySelectorAll("input#username")[0];
            var password = loginForm.querySelectorAll("input#password")[0];
            var captcha = loginForm.querySelectorAll("input#captcha")[0];
            var loginButton = loginForm.querySelectorAll("input#loginButton")[0];

            username.tabIndex = 1;
            password.tabIndex = 2;
            captcha.tabIndex = 3;
            loginButton.tabIndex = 4;

        }

        if (pathname.startsWith("/HRMS/leave-management/leave-applications")) {
            var accordionPassApplication = document.querySelectorAll("#accordionPassApplication")[0];
            var headingPassApp = accordionPassApplication.querySelectorAll("#headingPassApp")[0];
            var leaveAppnListBody = accordionPassApplication.querySelectorAll("#leaveAppnListBody")[0];

            var h6 = document.createElement("h6");
            var text = document.createTextNode("(" + leaveAppnListBody.children.length + ")");
            h6.appendChild(text);
            h6.style.color = "red";
            headingPassApp.appendChild(h6);
        }

        if (pathname.startsWith("/HRMS/leave-management/get-leave-application")) {

            var leaveAction = document.querySelectorAll("select#leaveAction")[0];
            leaveAction.addEventListener("change", function () {
                if (leaveAction.value == "S") {
                    var remarks = document.querySelectorAll("#remarks")[0];
                    remarks.value = "Sanctioned if due";
                }
            })

        }
    }
    , false
);
