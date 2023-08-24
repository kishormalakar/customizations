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
