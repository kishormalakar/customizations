// ==UserScript==
// @name         IREPS
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/epsn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        var pathname = location.pathname;

        if (pathname.startsWith("/epsn/supply/bid/techBidSupplyTabulation.do")) {
            var technoCommercialTabulation = document.querySelectorAll("table")[0].children[0];
            var conditionTables =
                technoCommercialTabulation.lastElementChild.firstElementChild.querySelectorAll(":scope > table");
            var eligibilityTable;
            var makeTable;
            var makeTable2;
            var jurisdictionalOfficerTable;
            var industryTable;

            for (var i = 0; i < conditionTables.length; i++) {
                if (conditionTables[i].querySelectorAll("td")[0].innerText.trim() == "Special Eligibility Criteria") {
                    eligibilityTable = conditionTables[i + 2].querySelectorAll("tbody")[0].children;
                }

                if (conditionTables[i].querySelectorAll("td")[0].innerText.trim() == "Make Brand") {
                    makeTable = conditionTables[i + 1].querySelectorAll("tbody")[0].children;
                }

                if (
                    conditionTables[i].querySelectorAll("td")[0].innerText.trim() ==
                    "GST Jurisdictional Assessing Officer Details"
                ) {
                    jurisdictionalOfficerTable = conditionTables[i + 1].querySelectorAll("tbody")[0].children;
                }
            }

            industryTable = technoCommercialTabulation
                .querySelectorAll("#oiDiv")[0]
                .querySelectorAll("table")[1]
                .querySelectorAll("tbody")[0].children;
            for (var x = 1; x < industryTable.length; x++) {
                if (industryTable[x].children.length == 1) {
                    industryTable[x].remove();
                }
            }

            var firmArray = [];

            for (var j = 1; j < eligibilityTable.length; j++) {
                firmArray.push(eligibilityTable[j].querySelectorAll("td")[0].innerText.trim());
            }
            var cloneNode;

            for (var k = 0; k < firmArray.length; k++) {
                var firmName = firmArray[k];

                for (var l = 1; l < makeTable.length; l++) {
                    makeTable2 = makeTable[l].children[1].querySelectorAll("tbody")[0].children;

                    for (var l2 = 0; l2 < makeTable2.length; l2++) {
                        if (makeTable2[l2].children[0].innerText.trim() == firmName) {
                            cloneNode = makeTable2[l2];
                            makeTable2[0].parentElement.insertBefore(cloneNode, makeTable2[l2 + 2]);
                        }
                    }
                }

                for (var m = 1; m < jurisdictionalOfficerTable.length; m++) {
                    if (jurisdictionalOfficerTable[m].children[1].innerText.trim() == firmName) {
                        cloneNode = jurisdictionalOfficerTable[m];
                        jurisdictionalOfficerTable[0].parentElement.insertBefore(
                            cloneNode,
                            jurisdictionalOfficerTable[k + 1]
                        );
                    }
                }

                for (var n = 1; n < industryTable.length; n++) {
                    if (industryTable[n].children[0].innerText.trim() == firmName) {
                        cloneNode = industryTable[n];
                        industryTable[0].parentElement.insertBefore(cloneNode, industryTable[k + 1]);
                    }
                }
            }
        }

        if (pathname.startsWith("/epsn/jsp/supply/tds/firmMSEDetailsPage.jsp")) {
            var href = window.location.href;
            var url = new URL(href);
            var bidId = url.searchParams.get("bidId");
            // var tabulationId = url.searchParams.get("tabulationId");
            var tabulationId = prompt("Tabulation ID");

            var req = new XMLHttpRequest();
            req.open("GET", "https://ireps.gov.in/epsn/supply/bid/techBidSupplyTabulation.do?oid=" + tabulationId, false);
            req.send(null);

            if (req.status == 200) {
                var parser = new DOMParser();
                var technoCommercialTabulation = parser.parseFromString(req.responseText, "text/html");

                var tod = technoCommercialTabulation.querySelectorAll("body")[0].querySelectorAll("table")[0].querySelectorAll("tbody")[0].children[2].querySelectorAll("tr")[0].children[3].innerText.trim().split(" ")[0].substring(2).replaceAll('/', '');

                var industryTable = technoCommercialTabulation
                    .querySelectorAll("#oiDiv")[0]
                    .querySelectorAll("table")[1]
                    .querySelectorAll("tbody")[0].children;
                for (var x = 1; x < industryTable.length; x++) {
                    if (industryTable[x].children.length == 1) {
                        industryTable[x].remove();
                    }
                }

                for (var n = 1; n < industryTable.length; n++) {

                    var firmId = industryTable[n].children[0].innerText.trim().split("[")[1].split("]")[0];

                    if (firmId == bidId) {
                        cloneNode = industryTable[n];

                        var technoCommercialScript = technoCommercialTabulation.querySelectorAll("body")[0].querySelectorAll("script")[0];
                        //document.querySelectorAll("head")[0].appendChild(technoCommercialScript);

                        var mseDocumentLink = cloneNode.children[2].querySelectorAll("a")[0];
                        var mseDocumentParams = mseDocumentLink.getAttribute("onclick").toString().trim().split("(")[1].split(")")[0];
                        var mseDocumentId = mseDocumentParams.split(",")[1].split("'")[1].split("'")[0];
                        var mseDocumentName = mseDocumentParams.split(",")[2].split("'")[1].split("'")[0];
                        var mseDocumentUrl = "/ireps/upload/supply/files/" + tod + "/" + tabulationId + "/" + bidId + "/" + mseDocumentId + "-" + mseDocumentName;

                        var ownedByScStLink = cloneNode.children[3].querySelectorAll("a")[0];
                        var ownedByScStParams = ownedByScStLink.getAttribute("onclick").toString().trim().split("(")[1].split(")")[0];
                        var ownedByScStDocId = ownedByScStParams.split(",")[1].split("'")[1].split("'")[0];
                        var ownedByScStDocName = ownedByScStParams.split(",")[2].split("'")[1].split("'")[0];
                        var ownedByScStUrl = "/ireps/upload/supply/files/" + tod + "/" + tabulationId + "/" + bidId + "/" + ownedByScStDocId + "-" + ownedByScStDocName;


                        var ownedByWomenLink = cloneNode.children[4].querySelectorAll("a")[0];
                        var ownedByWomenParams = ownedByWomenLink.getAttribute("onclick").toString().trim().split("(")[1].split(")")[0];
                        var ownedByWomenDocId = ownedByWomenParams.split(",")[1].split("'")[1].split("'")[0];
                        var ownedByWomenDocName = ownedByWomenParams.split(",")[2].split("'")[1].split("'")[0];
                        var ownedByWomenUrl = "/ireps/upload/supply/files/" + tod + "/" + tabulationId + "/" + bidId + "/" + ownedByWomenDocId + "-" + ownedByWomenDocName;

                        mseDocumentLink.setAttribute("href", mseDocumentUrl);
                        mseDocumentLink.setAttribute("target", "_blank");

                        ownedByScStLink.setAttribute("href", ownedByScStUrl);
                        ownedByScStLink.setAttribute("target", "_blank");

                        ownedByWomenLink.setAttribute("href", ownedByWomenUrl);
                        ownedByWomenLink.setAttribute("target", "_blank");

                        var table1 = document.createElement("table");
                        var tbody1 = document.createElement("tbody");
                        tbody1.appendChild(industryTable[0]);
                        tbody1.appendChild(cloneNode);
                        table1.appendChild(tbody1);
                        table1.classList.add("advSearch");
                        table1.style.width = "98%";
                        document.querySelectorAll("body")[0].appendChild(table1);

                    }
                }
            }
        }

        if (pathname.startsWith("/epsn/jsp/supply/tds/fillDeliveryPeriodPage.jsp")) {

            var dateCommenceRadio = document.querySelectorAll("#dlvCommRd1")[0];
            var dateCommenceValue = document.querySelectorAll("#dlvCommRng")[0];
            var dateCompleteRadio = document.querySelectorAll("#dlvCompRd1")[0];
            dateCommenceRadio.checked = true;
            dateCompleteRadio.checked = true;
            dateCommenceValue.value = 0;

        }

        if (pathname.startsWith("/epsn/reports/viewTenders.do")) {

            var tenderTable = document.querySelectorAll("table")[0].querySelectorAll("tr")[1].querySelectorAll("table")[0];
            var tenderRows = tenderTable.querySelectorAll("tbody")[0].children;

            var numTotalTenders = 0;
            var numTotalOrders = 0;
            var numTotalRetenders = 0;
            var valueTotalTenders = 0;

            for (var i = 1; i < tenderRows.length; i++) {

                var tenderRow = tenderRows[i];
                var tenderDecision = tenderRow.querySelectorAll("td")[9].innerText;
                numTotalTenders++;
                valueTotalTenders = valueTotalTenders + parseInt(tenderRow.children[6].innerText);

                if (tenderDecision.includes("Ord.") || tenderDecision.includes("COA")) {
                    numTotalOrders++;
                }
                else {
                    numTotalRetenders++;
                }
            }

            var table1 = document.createElement("table");
            var tbody1 = document.createElement("tbody");

            var tr1 = document.createElement("tr");
            var td1 = document.createElement("th");
            var text1 = document.createTextNode("Total Tenders");
            var td2 = document.createElement("th");
            var text2 = document.createTextNode("Total Tender Value");
            var td3 = document.createElement("th");
            var text3 = document.createTextNode("Successful Tenders");
            var td4 = document.createElement("th");
            var text4 = document.createTextNode("Retender/Discharge");
            td1.appendChild(text1);
            td2.appendChild(text2);
            td3.appendChild(text3);
            td4.appendChild(text4);
            tr1.appendChild(td1);
            tr1.appendChild(td2);
            tr1.appendChild(td3);
            tr1.appendChild(td4);

            var tr2 = document.createElement("tr");
            var td5 = document.createElement("td");
            var text5 = document.createTextNode(numTotalTenders);
            var td6 = document.createElement("td");
            var text6 = document.createTextNode(valueTotalTenders);
            var td7 = document.createElement("td");
            var text7 = document.createTextNode(numTotalOrders + " ( " + Math.round(numTotalOrders / numTotalTenders * 100) + "% )");
            var td8 = document.createElement("td");
            var text8 = document.createTextNode(numTotalRetenders + " ( " + Math.round(numTotalRetenders / numTotalTenders * 100) + "% )");
            td5.appendChild(text5);
            td6.appendChild(text6);
            td7.appendChild(text7);
            td8.appendChild(text8);
            tr2.appendChild(td5);
            tr2.appendChild(td6);
            tr2.appendChild(td7);
            tr2.appendChild(td8);

            tbody1.appendChild(tr1);
            tbody1.appendChild(tr2);
            table1.appendChild(tbody1);
            table1.style.border = "1px solid black";
            table1.style.borderCollapse = "collapse";
            table1.setAttribute("border", "1");
            tr1.style.backgroundColor = "#25A6E1";
            tr1.style.color = "white";

            tenderTable.parentElement.insertBefore(table1, tenderTable);
        }
    },
    false
);