// ==UserScript==
// @name         HRMS
// @namespace    http://tampermonkey.net/
// @version      1.0.1
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

        hrmsIdArray = [
            ["LDRLZJ", "M S Munda", "BRWD"],
            ["THKBHX", "D K Varma ", "BRWD"],
            ["LLWOGE", "Deepak Kumar", "BRWD"],
            ["SSOJSQ", "Babualal Ram", "BRWD"],
            ["UOXJLT", "Manish Srivastava", "BRWD"],
            ["GNBWUZ", "Ravi Kumar", "BRWD"],
            ["UNHPOU", "Sushil Kumar", "BRWD"],
            ["EXIDHZ", "FIroz Khan", "BRWD"],
            ["KEIMCD", "Akash Upadhyay", "BRWD"],
            ["ZKISJH", "Rinku Kr Rana", "BRWD"],
            ["OBFBQR", "Prabhu Nath Singh", "BRWD"],
            ["FHSKAM", "Avinash Kumar", "BRWD"],
            ["TCAAWX", "Pawan Kumar", "BRWD"],
            ["CCADKA", "Devendra Yadav", "BRWD"],
            ["OZDIOI", "Santosh Kumar", "BRWD"],
            ["XQKOKW", "Ganesh Kumar", "BRWD"],
            ["DBXWYJ", "Govind Mahto ", "BRWD"],
            ["HFJNOS", "Ravikant", "BRWD"],
            ["BKSWCW", "Kapildeo Choudhary", "BRWD"],
            ["ZFZDRI", "Upendra Yadav", "BRWD"],
            ["CKPZGS", "Pravindra Sinha", "BRWD"],
            ["QRSXQW", "Deepak Kumar", "PTRU"],
            ["", "Sandeep Kumar", "PTRU"],
            ["", "Rajesh Munda", "PTRU"],
            ["KHJBNH", "Shiv Ch. Paswan", "PTRU"],
            ["", "Munna Rajak", "PTRU"],
            ["KJYJDZ", "Ranjit Kumar", "PTRU"],
            ["CAXGYW", "Dhananjay Kumar", "PTRU"],
            ["", "Nirmal Kumar Ravi", "PTRU"],
            ["SYPZTP", "Pankaj Kumar Gupta", "PTRU"],
            ["", "Shivranjan Choudhary", "PTRU"],
        ];

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
            var leaveAppnListHeader = accordionPassApplication.querySelectorAll("#leaveAppnListTable")[0].children[0].children[0];
            var leaveAppnListBody = accordionPassApplication.querySelectorAll("#leaveAppnListBody")[0];

            var h6 = document.createElement("h6");
            var text = document.createTextNode("(" + leaveAppnListBody.children.length + ")");
            h6.appendChild(text);
            h6.style.color = "red";
            headingPassApp.appendChild(h6);

            for (var i = 0; i < leaveAppnListBody.children.length; i++) {
                var leaveRow = leaveAppnListBody.children[i];
                var applicationHrmsID = leaveRow.children[1].innerHTML.split("(")[1].split(")")[0];

                hrmsIdArray.forEach(hrmsData => {
                    if (applicationHrmsID == hrmsData[0]) {
                        leaveRow.children[4].innerHTML = hrmsData[2];
                    }
                })
            }
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
