// ==UserScript==
// @name         IMMIS
// @namespace    http://tampermonkey.net/
// @version      1.0.62
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/fcgi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        'use strict';

        if (document.title.startsWith("Run Form - ")) {
            var titleBar = document.querySelectorAll("#TitleBar")[0];
            var title = titleBar.querySelectorAll("td")[1].innerText;
            document.title = title;
            titleBar.style.width = "100%";
        }

        var titleBar = "";
        var currentDepotCode = "";
        var currentZoneCode = "";
        var currentZone = "";
        var currentYear = "";

        var body = document.querySelectorAll("body")[0];

        var zoneJson = {
            CR: "01",
            ER: "02",
            NR: "03",
            NER: "04",
            NFR: "05",
            SR: "06",
            SCR: "07",
            SER: "08",
            WR: "09",
            ECR: "10",
            ECOR: "11",
            NCR: "12",
            NWR: "13",
            SECR: "14",
            SWR: "15",
            WCR: "16",
            METRO: "17",
            CLW: "21",
            BLW: "22",
            ICF: "23",
            RCF: "24",
            RWF: "25",
            PLW: "26",
            MCFRBL: "27",
            NFRCON: "28",
            RWP: "29",
            RB: "30",
            RDSO: "31",
            KRCL: "41",
            CORE: "42",
            COFMOW: "43",
            RELTEL: "44",
            WPO: "45",
            NAIR: "55",
            CRIS: "98",
        };

        var zoneDepotArray = [
            ["PD/DDU", "22"],
            ["DSD/DDU", "23"],
            ["DSL/PTRU", "26"],
            ["TRS/GMO", "30"],
            ["TRS/DDU", "31"],
            ["DSL/DDU", "32"],
            ["BOXNDDU", "33"],
            ["GSDGHZ", "34"],
            ["MEMU JAJ", "35"],
            ["CRW/HRT", "37"],
            ["DEMU SEE", "38"],
            ["GSD/DHN", "41"],
            ["RNCC/PATNA", "42"],
            ["ROH/BRWD", "43"],
            ["GSD/SPJ", "70"],
            ["DSL/SPJ", "71"],
        ];

        var dealerPlArray = [
            ["1000", "1999", "Sanjay Verma"],
            ["2000", "2999", "Sanjay Verma"],
            ["3000", "3999", "Neeraj Nikhil"],
            ["4000", "4699", "Sujeet Kumar"],
            ["5000", "5999", "Dilip Kumar Sinha"],
            ["6000", "6099", "Rajeev Kumar"],
            ["6100", "6999", "Sanjay Verma"],
            ["7100", "7399", "Rajeev Kumar"],
            ["7400", "7999", "Sanjay Verma"],
            ["8000", "8199", "Sanjay Verma"],
            ["8200", "8299", "Dilip Kumar Sinha"],
            ["8300", "8999", "Sanjay Verma"],
            ["9000", "9399", "Dilip Kumar Sinha"],
        ];

        let setRelativePositioning = () => {
            var childElements = document.querySelectorAll("#CanvassHolder")[0].children;
            var numVisibleElements = 0;
            var firstVisibleChild;
            var firstVisibleChildName = "";
            var secondVisibleChild;
            var secondVisibleChildName = "";

            for (var i = 0; i < childElements.length; i++) {
                if (childElements[i].style.display == "block" || childElements[i].style.display == "flex") {
                    if (numVisibleElements == 0) {
                        firstVisibleChild = childElements[i];
                        firstVisibleChildName = childElements[i].id;
                    }
                    if (numVisibleElements == 1) {
                        secondVisibleChild = childElements[i];
                        secondVisibleChildName = childElements[i].id;
                    }
                    numVisibleElements++;
                }
            }

            if (numVisibleElements == 2) {
                if (numVisibleElements == 2) {
                    if (
                        (firstVisibleChild.id == "s_2" && secondVisibleChild.id == "s_3") ||
                        (firstVisibleChild.id == "s_3" && secondVisibleChild.id == "s_4") ||
                        (firstVisibleChild.id == "s_2" && secondVisibleChild.id == "s_4")
                    ) {
                        firstVisibleChild.style.position = "relative";
                        secondVisibleChild.style.position = "relative";
                    }
                }
            }
        };

        async function checkUrl(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' });

                if (response.ok) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }

        let getDealerByPl = (pl) => {

            var plTrimmed = pl.substring(0, 4);
            var dealerName = "-";
            dealerPlArray.every((dealerPl) => {

                var plStart = dealerPl[0];
                var plEnd = dealerPl[1];

                if ((+plStart - +plTrimmed) * (+plEnd - +plTrimmed) < 0) {
                    dealerName = dealerPl[2];
                    return false;
                }
                else {
                    return true;
                }

            });

            return dealerName;
        }

        if (document.title != "System Start Page" && document.title != "Output of Report - LISTPOS") {
            setRelativePositioning();

            document.addEventListener("click", (e) => {
                setRelativePositioning();
            });

            titleBar = document.querySelectorAll("#TitleBar")[0];
            currentDepotCode = titleBar.querySelectorAll("td")[0].innerText.split(":")[2].substring(3, 5);
            currentZoneCode = titleBar.querySelectorAll("td")[0].innerText.split(":")[0].substring(1, 3);
            currentZone = "ECR";
            currentYear = new Date().getFullYear().toString();
        }

        if (document.title == "System Start Page") {

            document.addEventListener("click", (e) => {
                if (e.target.id.startsWith("Menu")) {

                    var menuId = e.target.id;
                    var menuContainer = e.target.closest("tr");
                    var listContainer = menuContainer.nextElementSibling;

                    var menuIndex;
                    for (var i = 1; i < menuContainer.children.length; i++) {

                        if (menuContainer.children[i].children[0] === e.target) {
                            menuIndex = i;
                        }

                    }

                    for (var j = 1; j < listContainer.children.length; j++) {

                        if (j != menuIndex && j < +menuContainer.children.length - 2) {
                            listContainer.children[j].querySelectorAll("span")[0].style.display = "none";
                        }

                    }

                    var listOffsetTop;
                    var listOffsetLeft;
                    listOffsetTop = e.target.closest("tr").offsetHeight + 5;

                    if (+e.target.offsetTop == 0 && +e.target.offsetLeft == 0) {
                        listOffsetLeft = +e.clientX;
                    }
                    else if (+e.target.offsetTop > 0 && +e.target.offsetTop < 25) {
                        listOffsetLeft = +e.target.offsetLeft;
                    }
                    else {
                        listOffsetLeft = +e.target.offsetLeft;
                    }

                    if (menuIndex < +menuContainer.children.length - 2) {

                        listContainer.children[menuIndex].style.cssText = "position: absolute !important; left: " + listOffsetLeft + "px !important; top: " + listOffsetTop + "px !important"

                    }

                }
            });
        }

        if (document.title == "Search Purchase Orders" || document.title == "Run Form - IMMIS/PUR/POSEARCH") {
            body.classList.add("po_search");

            var rlyName = document.querySelectorAll('input[name="RLYNM_0"]')[0];
            var rlyButton = document.querySelectorAll('input[name="RLY_BTN_0"]')[0];
            var LovDiv = document.querySelectorAll("#LovDiv")[0];

            var stockNS = document.querySelectorAll('select[name="STKNS_0"]')[0];
            stockNS.value = "%";

            var poTo = document.querySelectorAll("#LBL_TB_DT_TO")[0].nextElementSibling.value;
            var poToArray = poTo.split("-");

            var poFromDay = +poToArray[0] + 1;
            var poFromMonth = poToArray[1];
            var poFromYear = +poToArray[2] - 1;

            poFromDay = poFromDay.toString().length == 2 ? poFromDay : "0" + poFromDay;

            var poFrom = poFromDay + "-" + poFromMonth + "-" + poFromYear;
            document.querySelectorAll("#LBL_TB_DT_FR")[0].nextElementSibling.value = poFrom;

            var buttonRow = body.querySelectorAll("#s_2")[0].querySelectorAll("table")[0].querySelectorAll("tbody")[0].querySelectorAll("tr")[3].querySelectorAll("td")[3];

            var button1 = document.createElement("button");
            var text1 = document.createTextNode("Backward 1 Year");
            button1.appendChild(text1);
            button1.classList.add("button");
            button1.classList.add("btnSunflower");

            var button2 = document.createElement("button");
            var text2 = document.createTextNode("Forward 1 Year");
            button2.appendChild(text2);
            button2.classList.add("button");
            button2.classList.add("btnSunflower");

            buttonRow.insertBefore(button2, buttonRow.children[0]);
            buttonRow.insertBefore(button1, buttonRow.children[0]);

            button1.addEventListener('click', function (event) {
                var dateFrom = body.querySelectorAll("#LBL_TB_DT_FR")[0].nextElementSibling.value;
                var dateTo = body.querySelectorAll("#LBL_TB_DT_TO")[0].nextElementSibling.value;

                var dateFromArray = dateFrom.split("-");
                var dateFromNew = dateFromArray[0] + "-" + dateFromArray[1] + "-" + (+dateFromArray[2] - 1);
                var dateToArray = dateTo.split("-");
                var dateToNew = dateToArray[0] + "-" + dateToArray[1] + "-" + (+ dateToArray[2] - 1);

                body.querySelectorAll("#LBL_TB_DT_FR")[0].nextElementSibling.value = dateFromNew;
                body.querySelectorAll("#LBL_TB_DT_TO")[0].nextElementSibling.value = dateToNew;
                buttonRow.parentElement.previousElementSibling.previousElementSibling.lastChild.querySelectorAll("input")[0].click();
            });

            button2.addEventListener('click', function (event) {
                var dateFrom = body.querySelectorAll("#LBL_TB_DT_FR")[0].nextElementSibling.value;
                var dateTo = body.querySelectorAll("#LBL_TB_DT_TO")[0].nextElementSibling.value;

                var dateFromArray = dateFrom.split("-");
                var dateFromNew = dateFromArray[0] + "-" + dateFromArray[1] + "-" + (+dateFromArray[2] + 1);
                var dateToArray = dateTo.split("-");
                var dateToNew = dateToArray[0] + "-" + dateToArray[1] + "-" + (+ dateToArray[2] + 1);

                body.querySelectorAll("#LBL_TB_DT_FR")[0].nextElementSibling.value = dateFromNew;
                body.querySelectorAll("#LBL_TB_DT_TO")[0].nextElementSibling.value = dateToNew;
                buttonRow.parentElement.previousElementSibling.previousElementSibling.lastChild.querySelectorAll("input")[0].click();
            });

            document.addEventListener("click", (e) => {
                if (e.target.id == "s_0_7") {
                    var table = LovDiv.querySelectorAll("#_LovTable")[0].querySelectorAll("tbody")[0];
                    var lastRow = table.lastChild.cloneNode(true);
                    table.prepend(lastRow);
                }
                if (
                    e.target.id == "s_0_29" ||
                    e.target.id == "s_0_52" ||
                    e.target.id == "s_0_53" ||
                    e.target.id == "s_0_54" ||
                    e.target.id == "s_0_55"
                ) {
                    var poTable = document.querySelectorAll("#s_3")[0].querySelectorAll("table")[2];

                    var td1 = document.createElement("td");
                    var text1 = document.createTextNode("Bill Details");
                    td1.appendChild(text1);
                    poTable.querySelectorAll("thead")[0].querySelectorAll("tr")[0].appendChild(td1);
                    poTable
                        .querySelectorAll("thead")[0]
                        .querySelectorAll("tr")[0]
                        .children[2].setAttribute("width", "5%");
                    poTable
                        .querySelectorAll("thead")[0]
                        .querySelectorAll("tr")[0]
                        .children[5].setAttribute("width", "5%");
                    poTable
                        .querySelectorAll("thead")[0]
                        .querySelectorAll("tr")[0]
                        .children[6].setAttribute("width", "10%");
                    poTable
                        .querySelectorAll("thead")[0]
                        .querySelectorAll("tr")[0]
                        .children[12].setAttribute("width", "7%");

                    var poRows = poTable.querySelectorAll("tbody")[1].children;
                    for (var i = 0; i < poRows.length - 1; i++) {
                        var poRow = poRows[i];
                        var poNo;
                        var poSerial;
                        var purchaseType;
                        var linkHref;

                        if (poRow.children.length == 13) {
                            poNo = poRow.children[1].innerText.split(" ")[0];
                            poSerial = poRow.children[5].innerText;
                            purchaseType = poNo.substring(8, 9) == "2" ? "GM" : "TN";

                            linkHref = "https://ireps.gov.in/iMMS/caseHistoryBillPOPopUp?poNumber=" +
                                poNo +
                                "&poSr=" +
                                poSerial +
                                "&rly=10&purType=" +
                                purchaseType;
                        }

                        if (poRow.children.length == 10) {
                            var url = poRow.previousElementSibling.lastChild.querySelectorAll("a")[0].getAttribute("href");
                            var urlPart1 = url.substring(0, url.search("&poSr=") + 6);
                            var urlPart2 = url.substring(url.search("&rly="));
                            poSerial = poRow.children[2].innerText;

                            linkHref = urlPart1 + poSerial + urlPart2;
                        }

                        if (poRow.children.length == 8) {
                            var url = poRow.previousElementSibling.lastChild.querySelectorAll("a")[0].getAttribute("href");
                            var urlPart1 = url.substring(0, url.search("&poSr=") + 6);
                            var urlPart2 = url.substring(url.search("&rly="));
                            poSerial = poRow.children[0].innerText;

                            linkHref = urlPart1 + poSerial + urlPart2;
                        }

                        if (poRow.children.length == 13 || poRow.children.length == 10 || poRow.children.length == 8) {

                            var td2 = document.createElement("td");
                            var link = document.createElement("a");
                            var linkText = document.createTextNode("Bill Status");
                            link.appendChild(linkText);
                            link.title = "Check Bill Status";
                            link.href = linkHref;
                            link.target = "_blank";
                            td2.appendChild(link);
                            td2.setAttribute("align", "right");
                            poRow.appendChild(td2);

                        }

                    }
                }
            });


        }

        if (document.title == "Depot Transfer Transactions" || document.title == "Run Form - IMMIS/DEP/DTBT") {
            body.classList.add("depot_transfer");
        }

        if (document.title == "Availability Status of Items" || document.title == "Run Form - IMMIS/DEP/AVAILSTAT") {
            body.classList.add("availability");
        }

        if (document.title == "Review / Act on Pending Demands" || document.title == "Run Form - IMMIS/PUR/DEMREVIEW") {
            body.classList.add("review_process_demand");

            document.addEventListener("click", (e) => {
                var id = e.target.id;
                if (id.includes("DropBtn")) {
                    var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;
                    var s_5 = document.querySelectorAll("#s_5")[0];
                    var s__cnvs5 = document.querySelectorAll("#s__cnvs5")[0];

                    s_5.style.top = scrollTop + "px";
                    s__cnvs5.style.top = scrollTop + "px";
                }
            });
        }

        if (document.title == "IMMIS Proposal GeM PO Mapping" || document.title == "Run Form - IMMIS/PUR/GEM_PO_MAP") {
            body.classList.add("gem_po_mapping");

            document.addEventListener("click", (e) => {
                var id = e.target.id;
                if (id.includes("s_0_73")) {

                    var s_9 = document.querySelectorAll("#s_9")[0];

                    var poNo = s_9.querySelectorAll("table")[4].querySelectorAll("tr")[2].querySelectorAll("td")[0];
                    var poYear = s_9.querySelectorAll("table")[4].querySelectorAll("tr")[2].querySelectorAll("td")[1].innerText.split("-")[2];

                    var link = document.createElement("a");
                    var linkText = document.createTextNode(poNo.innerText);
                    link.appendChild(linkText);
                    link.title = poNo.innerText;
                    link.href =
                        "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/20" +
                        poYear +
                        "/" +
                        zoneJson["ECR"] +
                        "/" +
                        poNo.innerText +
                        ".pdf";
                    link.target = "_blank";
                    poNo.innerHTML = "";
                    poNo.appendChild(link);
                }
            });
        }

        if (document.title == "Demand Registration (Non-Stock)" || document.title == "Run Form - IMMIS/PUR/DMDREGNS") {
            document.addEventListener("click", (e) => {
                var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;

                if (e.target.title == "Return this Demand") {
                    var s_2 = document.querySelectorAll("#s_2")[0];
                    var s__cnvs3 = document.querySelectorAll("#s__cnvs3")[0];
                    scrollTop += 150;

                    s__cnvs3.style.top = scrollTop + "px";
                }
                if (e.target.title == "View Demand Details") {
                    var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];

                    divShowHtml1.style.top = scrollTop + "px";
                    divShowHtml1.style.maxWidth = "1024px";
                    divShowHtml1.style.marginLeft = "calc(50% - 512px)";
                }
                if (e.target.title == "Click to See List of Values") {
                    var LovDiv = document.querySelectorAll("#LovDiv")[0];

                    LovDiv.style.top = e.target.getBoundingClientRect().top + 250 + "px";
                    LovDiv.style.left = e.clientX + "px";

                    LovDiv.scrollIntoView({ block: "end", inline: "nearest" });
                }
            });
        }

        if (document.title == "PO Modification" || document.title == "Run Form - IMMIS/PUR/POMA") {
            body.classList.add("po_modification");

            var s_6 = body.querySelectorAll("#s_6")[0];
            var maList = s_6.querySelectorAll("[id^=TrMAList_]");
            var maNum = maList.length;

            var th = document.createElement("th");
            var thText = document.createTextNode("Officer");
            th.appendChild(thText);
            th.style.textAlign = "left";
            maList[0].previousElementSibling.insertBefore(th, maList[0].previousElementSibling.children[6]);

            for (i = 0; i < maList.length; i++) {

                var maRow = maList[i];
                var poNo = maRow.children[5].innerText.substring(0, 15);
                var plNo = maRow.children[7].innerText.split("[")[1].split("]")[0];
                var dealer = getDealerByPl(plNo);

                var td = document.createElement("td");
                var tdText = document.createTextNode(dealer);
                td.appendChild(tdText);
                maRow.insertBefore(td, maRow.children[6]);

            }

            var maNumP = document.createElement("h3");
            var maNumText = document.createTextNode("PO Modification Requests Pending : " + maNum);
            maNumP.appendChild(maNumText);
            maList[0].closest("div").insertBefore(maNumP, maList[0].closest("div").children[0]);

            var maKeyInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_36")[0];

            document.addEventListener("click", (e) => {
                if (e.target.name == "btn_Refresh_0") {
                    poLinking();
                }
                if (e.target.name == "btn_Hide_0") {
                    maKeyInput.focus();
                }
            });

            maKeyInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_56")[0].focus();

                }
            });
        }

        if (document.title == "Purchase Order Generation" || document.title == "Run Form - IMMIS/PUR/ORDER" || document.title == "Run Form - IMMIS/PUR/ORDERGEN") {
            body.classList.add("po_generation");

            var poKeyInput = document.querySelectorAll("#s_3")[0].querySelectorAll("#s_0_147")[0];

            if (poKeyInput != null && poKeyInput != undefined) {
                poKeyInput.focus();
                poKeyInput.addEventListener("keydown", (e) => {
                    if (e.key === "Tab" || e.key === "Enter") {

                        document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_27")[0].focus();

                    }
                });
            }

        }

        if (document.title == "Publish Tender Document" || document.title == "Run Form - IMMIS/PUR/TENDERNEW") {
            body.classList.add("tender_publishing");

            document.addEventListener("click", (e) => {

                if (e.target.id == "s_0_581") {

                    var tenderNo = body.querySelectorAll("#s_0_30")[0].value;
                    var tenderValue = body.querySelectorAll("#s_0_38")[0].value;
                    var tod = body.querySelectorAll("#s_0_39")[0].value;
                    var tenderType = "";

                    if (+tenderValue > 0 && +tenderValue <= 1000000) {
                        tenderType = "SS DA";
                    }
                    else if (+tenderValue > 1000000 && +tenderValue <= 5000000) {
                        tenderType = "JAG DA";
                    }
                    else if (+tenderValue > 5000000 && +tenderValue <= 10000000) {
                        tenderType = "SS TC";
                    }
                    else if (+tenderValue > 10000000 && +tenderValue <= 50000000) {
                        tenderType = "JAG TC";
                    }
                    if (+tenderValue > 50000000 && +tenderValue <= 100000000) {
                        tenderType = "SAG TC";
                    }

                    window.open(
                        "https://docs.google.com/forms/d/e/1FAIpQLSeSB2VCLhfFfGZSD0IsNxH8D95gvPLLQLiwmC7Njal4JfbFGw/formResponse?usp=pp_url&entry.2080103744="
                        + tenderNo +
                        "&entry.1346647636="
                        + tenderType +
                        "&entry.668519944="
                        + tod +
                        "&submit=Submit", '_blank');

                }

            });

            var tenderNoInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_30")[0];
            tenderNoInput.focus();
        }

        if (
            document.title == "Coverage Status of Non-Stock Demands" ||
            document.title == "Run Form - IMMIS/PUR/NSDMDSTAT"
        ) {
            body.classList.add("ns_demand_status");
        }

        if (
            document.title == "Coverage Status of stock Demands" ||
            document.title == "Run Form - IMMIS/PUR/STKDMDSTAT"
        ) {
            body.classList.add("ns_demand_status");
        }

        if (document.title == "Position of Items" || document.title == "Run Form - IMMIS/PUR/ITEMPOS") {
            body.classList.add("item_position");
            var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];
            var divShowHtml2 = document.querySelectorAll("#divShowHtml2")[0];

            var consigneeArray = [
                "C&W/SUPDT/OBRADAM",
                "H.TXR/PATRATU",
                "Sr.SE/C&W/IC/PEH",
                "CWS/BOXN/ROH/BRWD",
                "SRSE/CS/RS/DHN",
            ];

            var i, j;

            document.addEventListener("click", (e) => {
                if (e.target.closest("div") !== null && e.target.closest("div").id == "section_udm") {
                    var consigneeTable = divShowHtml1
                        .querySelectorAll("div")[1]
                        .querySelectorAll("tbody")[0]
                        .querySelectorAll("tr");

                    for (var i = 2; i < consigneeTable.length; i++) {
                        var consigneeRow = consigneeTable[i];
                        var consignee = consigneeRow.querySelectorAll("td")[0].innerText;
                        var consigneeName = consignee.split(" ")[2];

                        if (!consigneeArray.includes(consigneeName)) {
                            consigneeRow.style.display = "none";
                        }
                    }
                }

                if (
                    e.target.name == "BTN_HST_0" &&
                    divShowHtml1
                        .querySelectorAll("table")[0]
                        .querySelectorAll("tr")[0]
                        .innerText.startsWith("Item Card for PL NO:")
                ) {
                    var section_udm = divShowHtml1.querySelectorAll("#section_udm")[0];
                    var uncoveredDuesTable = section_udm.nextElementSibling;
                    var uncoveredDues = uncoveredDuesTable.querySelectorAll("tbody")[0].children;

                    for (i = 2; i < uncoveredDues.length; i++) {

                        if (uncoveredDues[i].children[8]) {
                            var dueDate = uncoveredDues[i].children[8].innerText;

                            if (dueDate != "") {
                                var tenderDueDate = new Date(
                                    "20" + dueDate.split("/")[2],
                                    dueDate.split("/")[1] - 1,
                                    dueDate.split("/")[0]
                                );
                                var today = new Date();

                                var dateDiff = Math.floor((today - tenderDueDate) / 86400000);

                                uncoveredDues[i].children[8].innerText = dueDate + " (" + dateDiff + " days)";
                            }
                        }

                    }
                }

                if (
                    e.target.name == "OTHER_RLY_0" &&
                    divShowHtml1
                        .querySelectorAll("table")[0]
                        .querySelectorAll("tr")[0]
                        .innerText.startsWith("Item Card for PL NO:")
                ) {
                    var otherRailwayTable = divShowHtml1.children[1].lastElementChild;
                    var otherRailwayTableRows = otherRailwayTable.querySelectorAll("tr");
                    var pl = divShowHtml1
                        .querySelectorAll("table")[0]
                        .querySelectorAll("tr")[0]
                        .innerText.trim()
                        .slice(-8);

                    for (i = 3; i < otherRailwayTableRows.length; i++) {
                        var otherRailwayTableRow = otherRailwayTableRows[i];
                        if (
                            otherRailwayTableRow.getAttribute("bgcolor") == "#ffffff" &&
                            otherRailwayTableRow.nextElementSibling !== null
                        ) {
                            var tableHeader1 = otherRailwayTable.querySelectorAll("tr")[1].cloneNode(true);
                            var tableHeader2 = otherRailwayTable.querySelectorAll("tr")[2].cloneNode(true);

                            otherRailwayTableRow.nextElementSibling.insertAdjacentElement("afterend", tableHeader2);
                            otherRailwayTableRow.nextElementSibling.insertAdjacentElement("afterend", tableHeader1);
                        }

                        if (
                            otherRailwayTableRow.getAttribute("bgcolor") == "#E8F1D4" &&
                            otherRailwayTableRow.children.length == 13
                        ) {
                            var aac = otherRailwayTableRow.children[8].innerText;
                            var stock = otherRailwayTableRow.children[9].innerText;
                            var stock_mm = Math.round((stock / (aac / 12)) * 10) / 10;
                            otherRailwayTableRow.children[9].innerText = stock + " (" + stock_mm + ")";
                        }

                        if (otherRailwayTableRow.children.length == 2) {
                            var rly = otherRailwayTableRow.children[0].innerText;
                            var rlyCode = rly.substring(0, rly.indexOf("-"));

                            var link = document.createElement("a");
                            var linkText = document.createTextNode(rly);
                            link.appendChild(linkText);
                            link.title = "Item position for " + rly;
                            link.href = "javascript:void(FORM.PLPosition('" + rlyCode + "','" + pl + "','Y'));";
                            otherRailwayTableRow.children[0].innerText = "";
                            otherRailwayTableRow.children[0].appendChild(link);
                        }
                    }

                    var tableChildren = divShowHtml1.children[1].children;

                    for (j = 3; j < tableChildren.length; j++) {
                        if (tableChildren[j].nextElementSibling != null) {
                            tableChildren[j].style.display = "none";
                        }
                    }
                }

                if (
                    e.target.name == "BTN_Report_0" &&
                    divShowHtml1
                        .querySelectorAll("table")[0]
                        .querySelectorAll("tr")[0]
                        .innerText.startsWith("Item Position")
                ) {
                    var tables = divShowHtml1.querySelectorAll("table");

                    for (i = 0; i < tables.length; i++) {
                        tables[i].setAttribute("border", 1);
                        tables[i].style.borderCollapse = "collapse";
                    }
                }

                if (e.target.title == "view consignee wise breakup of this AAC") {

                    var aacTable = divShowHtml2.querySelectorAll("table")[3];
                    var aacRows = aacTable.querySelectorAll("tbody")[0].children;
                    var totalAAC = 0;

                    for (var i = 3; i < aacRows.length; i++) {

                        var aacRow = aacRows[i];
                        var consigneeAAC = aacRow.children[2].innerText;
                        totalAAC += +consigneeAAC;
                    }

                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var text1 = document.createTextNode("TOTAL");
                    td1.appendChild(text1);
                    td1.setAttribute("colspan", "2");
                    td1.style.textAlign = "right";
                    tr.setAttribute("bgcolor", aacRows[0].getAttribute("bgcolor"));
                    var td2 = document.createElement("td");
                    var text2 = document.createTextNode(totalAAC);
                    td2.appendChild(text2);
                    td2.style.textAlign = "right";
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    aacTable.querySelectorAll("tbody")[0].appendChild(tr);

                }
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    if (
                        divShowHtml1
                            .querySelectorAll("table")[0]
                            .querySelectorAll("tr")[0]
                            .innerText.startsWith("Consignee stock for PL NO:")
                    ) {
                        divShowHtml1
                            .querySelectorAll("table")
                        [divShowHtml1.querySelectorAll("table").length - 1].querySelectorAll("input")[0]
                            .click();
                    } else {
                        document.querySelectorAll("#divShowHtml1")[0].style.display = "none";
                    }
                }
            });

            var plInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_11")[0];
            plInput.focus();
            plInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_15")[0].focus();

                }
            });
        }

        if (document.title == "Purchase Proposal" || document.title == "Run Form - IMMIS/PUR/PURPROP") {
            body.classList.add("purchase_proposal");

            var ppInput = document.querySelectorAll("#s_3")[0].querySelectorAll("#s_0_111")[0];
            ppInput.focus();
            ppInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {

                    document.querySelectorAll("#s_3")[0].querySelectorAll("#s_0_187")[0].focus();

                }
            });
        }

        if (document.title == "Demand Generation (Stock)" || document.title == "Run Form - IMMIS/PUR/DEMANDSTK") {
            body.classList.add("demand_generation");
        }

        if (document.title == "Receipt Note Preparation" || document.title == "Run Form - IMMIS/DEP/RNOTE") {
            body.classList.add("rnote");
        }

        if (document.title == "Receipt Inspection Report" || document.title == "Run Form - IMMIS/DEP/RI") {
            body.classList.add("isl");

            var wardSelectButton = body.querySelectorAll("#s_0_13")[0];
            wardSelectButton.click();

            var LovTable = body.querySelectorAll("#_LovTable")[0];
            LovTable.querySelectorAll("a")[0].click();

            var refreshButton = body.querySelectorAll("#s_0_18")[0];
            refreshButton.click();
        }

        if (document.title == "DRR Status Update" || document.title == "Run Form - IMMIS/DEP/DRRDEL") {
            body.classList.add("drop_drr");
        }

        if (document.title == "Status of Stocking Proposals" || document.title == "Run Form - IMMIS/QFSTATUS") {
            body.classList.add("plus_status");
        }

        if (document.title == "STOCKING PROPOSAL" || document.title == "Run Form - IMMIS/DEP/STKPROP") {
            body.classList.add("stocking_proposal");
        }

        if (document.title == "Registers for Purchase Module" || document.title == "Run Form - IMMIS/PUR/HQREGISTERS") {
            body.classList.add("purchase_register");
        }

        if (document.title == "Stock Verification" || document.title == "Run Form - IMMIS/DEP/STKVERIFY") {
            body.classList.add("stock_verification");
        }

        if (document.title == "Book Transfer" || document.title == "Run Form - IMMIS/DEP/BOOKXFER") {
            body.classList.add("book_transfer");
        }

        if (
            document.title == "Gen Requisition for Material consumed in testing" ||
            document.title == "Run Form - IMMIS/DEP/REQN_GEN_DEPOT"
        ) {
            body.classList.add("gen_req_for_consumed");
        }

        if (document.title == "Request for Creation of Vendor" || document.title == "Run Form - IMMIS/PUR/VENDREQ") {
            body.classList.add("new_vendor_request");
        }

        if (
            document.title == "Advance Intimation/Action for Estimate Sheets" ||
            document.title == "Run Form - IMMIS/DEP/AIS"
        ) {
            body.classList.add("ais");
            var LovDiv = document.querySelectorAll("#LovDiv")[0];
            var s__cnvs4 = document.querySelectorAll("#s__cnvs5")[0];

            document.addEventListener("click", (e) => {
                var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;
                var s_3 = document.querySelectorAll("#s_3")[0];
                var DivAlertBox = document.querySelectorAll("#DivAlertBox")[0];
                var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];

                if (e.target.value == "AAC") {
                    scrollTop += 150;

                    s_3.style.cssText =
                        "top: " +
                        scrollTop +
                        "px !important; border: 2px solid black; padding: 5px; background-color: #66ffff;";
                }
                if (e.target.value == "Save/Forward/Authorize") {
                    scrollTop += 150;

                    DivAlertBox.style.cssText =
                        "top: " +
                        scrollTop +
                        "px !important; border: 2px solid black; padding: 5px; background-color: #66ffff; z-index: 99; position: absolute;";
                }
                if (e.target.value == "Print") {
                    scrollTop += 150;

                    divShowHtml1.style.cssText =
                        "top: " +
                        scrollTop +
                        "px !important; border: 2px solid black; padding: 5px; background-color: #66ffff; z-index: 99; position: absolute;";
                }

                if (
                    e.target.parentElement.parentElement != null &&
                    e.target.parentElement.parentElement.id.includes("AIS_Row_")
                ) {
                    scrollTop += 150;

                    divShowHtml1.style.cssText =
                        "top: " +
                        scrollTop +
                        "px !important; border: 2px solid black; padding: 5px; background-color: #66ffff; z-index: 99; position: absolute;";
                }

                if (e.target.value == "Select") {
                    scrollTop += 150;

                    s__cnvs4.style.cssText =
                        "top: " +
                        scrollTop +
                        "px !important; border: 5px solid black; padding: 5px; background-color: #aaaaaa; position: absolute;";
                }

                if (e.target.title == "Click to See List of Values") {
                    scrollTop += 150;

                    LovDiv.style.cssText =
                        "top: " +
                        e.target.getBoundingClientRect().top +
                        150 +
                        "px !important; border: 2px solid black; padding: 0; background-color: #aaaaaa; z-index: 99; position: absolute; left: calc(50% - 380px)";

                    LovDiv.scrollIntoView();
                }
            });
        }

        if (
            document.title == "Revision & Closure of Stock Accounts" ||
            document.title == "Run Form - IMMIS/DEP/STKMASTER"
        ) {
            body.classList.add("stockmaster_ard");
        }

        if (document.title == "PO Cancellation" || document.title == "Run Form - IMMIS/PUR/POCA") {
            body.classList.add("po_cancellation");

            var caKeyInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_15")[0];
            caKeyInput.focus();
        }

        if (document.title == "Search / View NIT and Tabulations" || document.title == "Run Form - IMMIS/NITSEARCH") {
            body.classList.add("nit_search");

            document.addEventListener("click", (e) => {
                if (e.target.title == "Download Documents") {
                    var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;
                    var s_3 = document.querySelectorAll("#s_3")[0];
                    var existingStyle = s_3.style.cssText;
                    scrollTop += 150;

                    s_3.style.cssText =
                        "top: " +
                        scrollTop +
                        "px !important; border: 2px solid black; padding: 5px; background-color: #66ffff;";
                }
            });

            var s_0_14 = body.querySelectorAll("#s_0_14")[0];
            var s_0_16 = body.querySelectorAll("#s_0_16")[0];
            var s_0_17 = body.querySelectorAll("#s_0_17")[0];

            var dateFrom = s_0_16.value.split("-")[0] + "-" + s_0_16.value.split("-")[1] + "-" + (+s_0_16.value.split("-")[2] - 1);
            s_0_16.value = dateFrom;
            s_0_14.selectedIndex = 4;
        }

        if (document.title == "Vendor Performance" || document.title == "Run Form - IMMIS/PUR/VENDPOS") {
            body.classList.add("vendor_performance");
            var vendorNameInput = document.querySelectorAll("input[name='VNAME_0']")[0];

            document.addEventListener("click", (e) => {
                if (e.target.name == "btn_Show_0") {
                    var s_2 = document.querySelectorAll("#s_2")[0];
                    var table = s_2.querySelectorAll("tbody")[0];

                    if (!e.target.closest("table").nextSibling) {
                        var table1 = document.createElement("table");
                        var tbody1 = document.createElement("tbody");

                        var tr1 = document.createElement("tr");
                        var td1 = document.createElement("th");
                        var text1 = document.createTextNode("Total Orders");
                        var td2 = document.createElement("th");
                        var text2 = document.createTextNode("Fully Completed");
                        var td3 = document.createElement("th");
                        var text3 = document.createTextNode("Partly Completed");
                        var td4 = document.createElement("th");
                        var text4 = document.createTextNode("Cancelled");
                        var td5 = document.createElement("th");
                        var text5 = document.createTextNode("Failed");

                        td1.appendChild(text1);
                        td2.appendChild(text2);
                        td3.appendChild(text3);
                        td4.appendChild(text4);
                        td5.appendChild(text5);
                        tr1.appendChild(td1);
                        tr1.appendChild(td2);
                        tr1.appendChild(td3);
                        tr1.appendChild(td4);
                        tr1.appendChild(td5);

                        var tr2 = document.createElement("tr");
                        var td6 = document.createElement("td");
                        var td7 = document.createElement("td");
                        var td8 = document.createElement("td");
                        var td9 = document.createElement("td");
                        var td10 = document.createElement("td");

                        tr2.appendChild(td6);
                        tr2.appendChild(td7);
                        tr2.appendChild(td8);
                        tr2.appendChild(td9);
                        tr2.appendChild(td10);

                        tbody1.appendChild(tr1);
                        tbody1.appendChild(tr2);
                        table1.appendChild(tbody1);
                        table1.setAttribute("border", "1");

                        e.target.closest("table").parentElement.appendChild(table1);
                    }

                    var numTotalPO = 0;
                    var numPCPO = 0;
                    var numFCPO = 0;
                    var numCancelledPO = 0;
                    var numFailedPO = 0;

                    var poQty = 0;
                    var cancelledQty = 0;
                    var suppliedQty = 0;
                    var poStatus = "";

                    var s_3 = document.querySelectorAll("#s_3")[0];
                    var rows =
                        s_3.children[2].children[0].children[1].querySelectorAll("table")[1].children[0].children;

                    for (var i = 1; i < rows.length; i = i + 2) {
                        var row = rows[i];
                        numTotalPO++;

                        if (row.children.length == 9) {
                            poQty = row.children[3].innerText.split(" ")[0];
                            cancelledQty = row.children[4].innerText == "-" ? 0 : row.children[4].innerText;
                            row.children[4].style.color = "red";
                            suppliedQty = row.children[5].innerText == "-" ? 0 : row.children[5].innerText;
                            poStatus = row.children[8].innerText;

                            var poZone = row.children[0].innerHTML.split("<hr>")[0];
                            var poNo = row.children[0].querySelectorAll("b")[0].innerText;
                            var poDate = row.children[0].innerText.split("dt. ")[1];
                            var poYear = "20" + poDate.split("/")[2];

                            var p1 = document.createElement("p");
                            p1.innerText = poZone;
                            row.children[0].innerHTML = "";
                            row.children[0].appendChild(p1);

                            var link = document.createElement("a");
                            var linkText = document.createTextNode(poNo);
                            link.appendChild(linkText);
                            link.title = poNo;
                            link.href =
                                "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/" +
                                poYear +
                                "/" +
                                zoneJson[poZone] +
                                "/" +
                                poNo +
                                ".pdf";
                            link.target = "_blank";
                            row.children[0].appendChild(link);

                            var p2 = document.createElement("p");
                            p2.innerText = "dt. " + poDate;
                            row.children[0].appendChild(p2);
                        }

                        if (row.children.length == 8) {
                            poQty = row.children[2].innerText.split(" ")[0];
                            cancelledQty = row.children[3].innerText == "-" ? 0 : row.children[3].innerText;
                            row.children[3].style.color = "red";
                            suppliedQty = row.children[4].innerText == "-" ? 0 : row.children[4].innerText;
                            poStatus = row.children[7].innerText;

                        }

                        if (+suppliedQty > 0 && +suppliedQty < 0.95 * +poQty && cancelledQty < 0.50 * poQty) {
                            numPCPO++;
                        }

                        if (+suppliedQty >= 0.95 * +poQty) {
                            numFCPO++;
                        }

                        if (cancelledQty >= 0.50 * +poQty) {
                            numCancelledPO++;
                        }

                        if (cancelledQty == 0 && suppliedQty == 0 && poStatus == "D/P Expired") {
                            numFailedPO++;
                        }
                    }

                    e.target.closest("table").nextElementSibling.querySelectorAll("td")[0].innerText = numTotalPO;
                    e.target.closest("table").nextElementSibling.querySelectorAll("td")[1].innerText = numFCPO + " ( " + Math.round(numFCPO / numTotalPO * 100) + "% )";
                    e.target.closest("table").nextElementSibling.querySelectorAll("td")[2].innerText = numPCPO + " ( " + Math.round(numPCPO / numTotalPO * 100) + "% )";
                    e.target.closest("table").nextElementSibling.querySelectorAll("td")[3].innerText = numCancelledPO + " ( " + Math.round(numCancelledPO / numTotalPO * 100) + "% )";
                    e.target.closest("table").nextElementSibling.querySelectorAll("td")[4].innerText = numFailedPO + " ( " + Math.round(numFailedPO / numTotalPO * 100) + "% )";
                }
            });

            vendorNameInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {
                    e.target.nextElementSibling.click();
                }
            });
        }

        if (document.title == "RR/Challan/DRR Registration" || document.title == "Run Form - IMMIS/DEP/DRR") {
            body.classList.add("drr_registration");
        }

        if (document.title == "Inventory Assistant" || document.title == "Run Form - IMMIS/DEP/STKASSIST") {
            body.classList.add("inventory_assistant");
        }

        if (document.title == "GeM Coverage PO Report" || document.title == "Run Form - IMMIS/PUR/GEMORDERS") {
            body.classList.add("gem_orders");

            document.addEventListener("click", (e) => {
                if (e.target.name == "BTN_SHOW_0") {
                    var s_3 = document.querySelectorAll("#s_3")[0];
                    var table = s_3.querySelectorAll("div")[0].querySelectorAll("tbody")[0];

                    var tr1 = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    var td3 = document.createElement("td");
                    var td4 = document.createElement("td");
                    var td5 = document.createElement("td");
                    var text1 = document.createTextNode("Total Value");
                    td4.appendChild(text1);
                    tr1.appendChild(td1);
                    tr1.appendChild(td2);
                    tr1.appendChild(td3);
                    tr1.appendChild(td4);
                    tr1.appendChild(td5);
                    table.querySelectorAll("tr")[0].insertAdjacentElement("afterend", tr1);

                    var total = 0;

                    for (var i = 2; i < table.children.length; i++) {
                        var orderValue = table.children[i].querySelectorAll("td")[4].innerText;
                        total += +orderValue;
                    }

                    table.querySelectorAll("tr")[1].querySelectorAll("td")[4].innerText = total.toFixed(2);
                    table.querySelectorAll("tr")[1].querySelectorAll("td")[4].style.textAlign = "right";
                }
            });
        }

        if (document.title == "Generate Gate Pass" || document.title == "Run Form - IMMIS/DEP/GATEPASS") {
            body.classList.add("gen_gate_pass");
        }

        if (document.title == "Sale Issue Note" || document.title == "Run Form - IMMIS/DEP/SALEISSUE") {
            body.classList.add("sale_issue_note");
        }

        if (document.title == "E-Gate Entry" || document.title == "Run Form - IMMIS/DEP/EGATE_ENTRY") {
            body.classList.add("egate_entry");

            document.addEventListener("click", (e) => {
                if (e.target.name == "SHOW_EDISP_0") {

                    var titleBar = document.querySelectorAll("#TitleBar")[0];
                    var depotCode = titleBar.querySelectorAll("td")[0].innerText.split(":")[2].substring(3, 5);
                    var zoneCode = titleBar.querySelectorAll("td")[0].innerText.split(":")[0].substring(1, 3);

                    var s_3 = document.querySelectorAll("#s_3")[0];
                    var rows = s_3.querySelectorAll("div")[0].querySelectorAll("tbody")[0].children;

                    for (var i = 1; i < rows.length; i++) {

                        var row = rows[i];
                        var eDispatchNo = row.querySelectorAll("td")[1].innerText;
                        var eDispatchDepot = eDispatchNo.split("/")[1];

                        if (eDispatchDepot != "00" + depotCode + "00") {

                            row.style.display = "none";

                        }

                        var poNo = row.querySelectorAll("td")[7].innerText;
                        var poDate = row.querySelectorAll("td")[8].innerText;
                        var poYear = "20" + poDate.split("-")[2];

                        var link = document.createElement("a");
                        var linkText = document.createTextNode(poNo);
                        link.appendChild(linkText);
                        link.title = poNo;
                        link.href =
                            "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/" +
                            poYear +
                            "/" +
                            zoneCode +
                            "/" +
                            poNo +
                            ".pdf";
                        link.target = "_blank";
                        row.children[7].innerHTML = "";
                        row.children[7].appendChild(link);

                    }
                }
            });

            var eDispatchButton = body.querySelectorAll("#s_0_12")[0];
            eDispatchButton.click();
        }

        if (document.title == "Issue of Stores against Registered Requisitions" || document.title == "Run Form - IMMIS/DEP/REQNISSUE") {
            body.classList.add("reqn_issue");
        }

        if (document.title == "Stock Balance Report" || document.title == "Run Form - IMMIS/DEP/STOCKMASTER") {
            body.classList.add("stockmaster");
        }

        if (document.title == "Output of Report - LISTPOS" || document.title == "Output of Report - LISTPOS") {
            body.classList.add("list_position");

            var table1 = body.querySelectorAll("table")[0];
            var table1Rows = table1.querySelectorAll("tbody")[0].children;

            for (var i = 0; i < table1Rows.length; i++) {

                var row = table1Rows[i];

                if (row.querySelectorAll("th")[0] && row.querySelectorAll("th")[0].innerText.startsWith("COVDUES")) {
                    var rowTh = row.querySelectorAll("th")[0];

                    var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    var thText = document.createTextNode("Covered Dues");
                    th.appendChild(thText);
                    tr.appendChild(th);
                    rowTh.closest("tbody").insertBefore(th, rowTh.closest("tbody").children[0]);

                    var th2 = document.createElement("th");
                    var thText2 = document.createTextNode("Depot");
                    th2.appendChild(thText2);
                    rowTh.parentElement.insertBefore(th2, rowTh);

                    var th3 = document.createElement("th");
                    var thText3 = document.createTextNode("PO Qty");
                    th3.appendChild(thText3);
                    rowTh.parentElement.insertBefore(th3, rowTh);

                    var th4 = document.createElement("th");
                    var thText4 = document.createTextNode("Due Qty");
                    th4.appendChild(thText4);
                    rowTh.parentElement.insertBefore(th4, rowTh);

                    var th5 = document.createElement("th");
                    var thText5 = document.createTextNode("Rate");
                    th5.appendChild(thText5);
                    rowTh.parentElement.insertBefore(th5, rowTh);

                    var th6 = document.createElement("th");
                    var thText6 = document.createTextNode("Delivery Date");
                    th6.appendChild(thText6);
                    rowTh.parentElement.insertBefore(th6, rowTh);

                    var th7 = document.createElement("th");
                    var thText7 = document.createTextNode("PO Serial");
                    th7.appendChild(thText7);
                    rowTh.parentElement.insertBefore(th7, rowTh);

                    rowTh.remove();

                    var table2 = row.querySelectorAll("table")[0];
                    var table2Rows = table2.querySelectorAll("tbody")[0].children;

                    if (table2Rows.length > 1) {
                        for (var j = 1; j < table2Rows.length; j++) {

                            var row2 = table2Rows[j];
                            /*row2.children[7].remove();
                            row2.children[6].remove();
                            row2.children[5].remove();
                            row2.children[3].remove();
                            row2.children[1].remove();*/

                        }
                    }

                }

                if (row.querySelectorAll("th")[0] && row.querySelectorAll("th")[0].innerText == "UDM STOCK") {

                    row.style.display = "none";
                }

                if (row.querySelectorAll("th")[5] && row.querySelectorAll("th")[5].innerText == "===Consumptions===") {

                    var rowTh = row.querySelectorAll("th")[5];
                    var table3 = row.querySelectorAll("table")[0];
                    var table3Rows = table3.querySelectorAll("tbody")[0].children;

                    for (var k = 0; k < table3Rows.length; k++) {

                        var row3 = table3Rows[k];

                        if (k == 0) {
                            var th2 = document.createElement("th");
                            var thText2 = document.createTextNode("Cons LY");
                            th2.appendChild(thText2);
                            rowTh.parentElement.insertBefore(th2, rowTh);

                            var th3 = document.createElement("th");
                            var thText3 = document.createTextNode("Cons CY");
                            th3.appendChild(thText3);
                            rowTh.parentElement.insertBefore(th3, rowTh);

                            rowTh.remove();
                            row3.children[8].remove();
                            row3.children[7].remove();
                            row3.children[4].remove();
                            row3.children[2].remove();

                            row3.children[0].removeAttribute("rowspan");
                            row3.children[1].removeAttribute("rowspan");
                            row3.children[1].innerText = "AAC";
                            row3.children[2].removeAttribute("rowspan");
                            row3.children[3].removeAttribute("rowspan");
                            row3.children[4].removeAttribute("rowspan");


                        }
                        else if (k == 1) {
                            row3.children[0].remove();
                            row3.children[0].remove();
                            row3.children[0].remove();
                        }
                        else if (k > 1 && k < table3Rows.length - 1) {
                            row3.children[1].setAttribute("align", "center");
                            row3.children[9].remove();
                            row3.children[8].remove();
                            row3.children[5].remove();
                            row3.children[4].remove();
                            row3.children[2].remove();
                        }
                        else {
                            row3.children[2].remove();
                        }

                    }

                    var table4 = row.querySelectorAll("table")[1];
                    var table4Rows = table4.querySelectorAll("tbody")[0].children;

                    for (var m = 1; m < table4Rows.length; m++) {

                        var row4 = table4Rows[m];
                        if (!row4.children[2].innerText.startsWith("T/No.") || row4.children[0].innerText == "") {
                            row4.style.display = "none";
                        }

                    }

                }

            }

            var table5 = body.querySelectorAll("table")[0];
            var table5Rows = table5.querySelectorAll("tbody")[0].children;

            for (var p = 0; p < table5Rows.length; p++) {
                var row5 = table5Rows[p];

                if (row5.querySelectorAll("th")[0] && row5.querySelectorAll("th")[0].innerText == "Covered Dues") {

                    var table6 = row5.querySelectorAll("table")[0];
                    var table6Rows = table6.querySelectorAll("tbody")[0].children;

                    if (table6Rows.length > 1) {

                        for (var q = 2; q < table6Rows.length; q++) {

                            var row6 = table6Rows[q];

                            if (row6.children[0].querySelectorAll("br")) {

                                var depotArray = row6.children[0].innerText.split("\n");
                                var poQtyArray = row6.children[1].innerText.split("\n");
                                var dueQtyArray = row6.children[2].innerText.split("\n");
                                var rateArray = row6.children[3].innerText.split("\n");
                                var dpArray = row6.children[4].innerText.split("\n");
                                var poSerialArray = row6.children[5].innerText.split("\n");

                                for (var n = 0; n < depotArray.length; n++) {

                                    var tr = document.createElement("tr");

                                    var td1 = document.createElement("td");
                                    var tdText1 = document.createTextNode(depotArray[n]);
                                    td1.appendChild(tdText1);
                                    tr.appendChild(td1);

                                    var td2 = document.createElement("td");
                                    var tdText2 = document.createTextNode(poQtyArray[n]);
                                    td2.appendChild(tdText2);
                                    tr.appendChild(td2);

                                    var td3 = document.createElement("td");
                                    var tdText3 = document.createTextNode(dueQtyArray[n]);
                                    td3.appendChild(tdText3);
                                    tr.appendChild(td3);

                                    var td4 = document.createElement("td");
                                    var tdText4 = document.createTextNode(rateArray[n]);
                                    td4.appendChild(tdText4);
                                    tr.appendChild(td4);

                                    var td5 = document.createElement("td");
                                    var tdText5 = document.createTextNode(dpArray[n]);
                                    td5.appendChild(tdText5);
                                    tr.appendChild(td5);

                                    var td6 = document.createElement("td");
                                    var tdText6 = document.createTextNode(poSerialArray[n]);
                                    td6.appendChild(tdText6);
                                    tr.appendChild(td6);

                                    var td7 = document.createElement("td");
                                    var tdText7 = document.createTextNode(row6.children[6].innerText);
                                    td7.appendChild(tdText7);
                                    tr.appendChild(td7);

                                    row6.parentElement.insertBefore(tr, row6);

                                }

                                if (row6.children[7] && (row6.children[7].innerText.includes("DRR") || row6.children[7].innerText.includes("ISL"))) {

                                    var accountalArray = row6.children[7].innerText.split(/DRR:|ISL:|R\/N:|Rej:/);

                                    for (var i = 1; i < accountalArray.length; i++) {

                                        var accountalRow = accountalArray[i];

                                        var tr2 = document.createElement("tr");

                                        var td1 = document.createElement("td");
                                        var tdText1 = document.createTextNode("Material under accountal at " + accountalRow.substring(0, accountalRow.indexOf(" ") - 9));
                                        td1.appendChild(tdText1);
                                        tr2.appendChild(td1);

                                        var td2 = document.createElement("td");
                                        var tdText2 = document.createTextNode("NA");
                                        td2.appendChild(tdText2);
                                        tr2.appendChild(td2);

                                        var td3 = document.createElement("td");
                                        var tdText3 = document.createTextNode(accountalRow.substring(accountalRow.indexOf("for") + 4));
                                        td3.appendChild(tdText3);
                                        tr2.appendChild(td3);

                                        var td4 = document.createElement("td");
                                        var tdText4 = document.createTextNode("NA");
                                        td4.appendChild(tdText4);
                                        tr2.appendChild(td4);

                                        var td5 = document.createElement("td");
                                        var tdText5 = document.createTextNode(accountalRow.substring(accountalRow.indexOf("dt.") + 3, accountalRow.indexOf("dt.") + 11));
                                        td5.appendChild(tdText5);
                                        tr2.appendChild(td5);

                                        var td6 = document.createElement("td");
                                        var tdText6 = document.createTextNode("NA");
                                        td6.appendChild(tdText6);
                                        tr2.appendChild(td6);

                                        var td7 = document.createElement("td");
                                        var tdText7 = document.createTextNode(row6.children[6].innerText);
                                        /*var tdText7 = document.createTextNode(row6.children[7].innerText.substring(row6.children[7].innerText.indexOf("for")+4));*/
                                        td7.appendChild(tdText7);
                                        tr2.appendChild(td7);

                                        row6.parentElement.insertBefore(tr2, row6);

                                    };

                                }

                                row6.remove();

                            }

                            else {

                                var depot = row6.children[0].innerText;
                                var dueQty = row6.children[2].innerText;
                                var dp = row6.children[4].innerText;

                                var tr = document.createElement("tr");

                                var td1 = document.createElement("td");
                                var tdText1 = document.createTextNode(depot);
                                td1.appendChild(tdText1);
                                tr.appendChild(td1);

                                var td2 = document.createElement("td");
                                var tdText2 = document.createTextNode(dueQty);
                                td2.appendChild(tdText2);
                                tr.appendChild(td2);

                                var td3 = document.createElement("td");
                                var tdText3 = document.createTextNode(dp);
                                td3.appendChild(tdText3);
                                tr.appendChild(td3);

                                var td4 = document.createElement("td");
                                var tdText4 = document.createTextNode(row6.children[6].innerText);
                                td4.appendChild(tdText4);
                                tr.appendChild(td4);

                                row6.parentElement.insertBefore(tr, row6);

                            }

                        }
                    }

                }
            }

            for (var p = 0; p < table5Rows.length; p++) {
                var row5 = table5Rows[p];

                if (row5.querySelectorAll("th")[4] && row5.querySelectorAll("th")[4].innerText == "Cons CY") {

                    var table6 = row5.querySelectorAll("table")[0];
                    var table6Rows = table6.querySelectorAll("tbody")[0].children;
                    var coverageTable = row5.nextElementSibling.querySelectorAll("table")[0];
                    var coverageRows = coverageTable.querySelectorAll("tbody")[0].children;
                    var cummulativeConsumptionCY = 0;
                    var cummulativeConsumptionLY = 0;
                    var cummulativeCoverage = 0;

                    for (var q = 0; q < table6Rows.length; q++) {

                        var row6 = table6Rows[q];

                        if (row6.children[4]) {
                            row6.insertBefore(row6.children[4], row6.children[3]);

                            if (!isNaN(parseInt(row6.children[3].innerText))) {
                                cummulativeConsumptionCY = cummulativeConsumptionCY + parseInt(row6.children[3].innerText);
                            }
                            if (!isNaN(parseInt(row6.children[4].innerText))) {
                                cummulativeConsumptionLY = cummulativeConsumptionLY + parseInt(row6.children[4].innerText);
                            }

                        }

                        if (q >= 2 && q < table6Rows.length - 1) {

                            var depotName = row6.children[0].innerText;
                            var totalCoverageQty = 0;
                            for (var r = 2; r < coverageRows.length; r++) {
                                var coverageDepot = coverageRows[r].children[0].innerText;
                                var coverageQty = coverageRows[r].children[2].innerText;
                                var coveragePO = coverageRows[r].children[6].innerText;

                                if (coverageDepot == depotName && coveragePO.substring(17, 18) != 8) {
                                    totalCoverageQty = +totalCoverageQty + +coverageQty;
                                }

                            }
                            var td = document.createElement("td");
                            var tdText = document.createTextNode(Math.round(+totalCoverageQty * 100) / 100);
                            td.appendChild(tdText);
                            td.style.border = "1px solid black";
                            td.setAttribute("align", "center");
                            row6.appendChild(td);

                        }

                        if (q == 0) {

                            var th0 = document.createElement("th");
                            var thText0 = document.createTextNode("Dues");
                            th0.appendChild(thText0);
                            row6.appendChild(th0);
                            var th1 = document.createElement("th");
                            var thText1 = document.createTextNode("Coverage");
                            th1.appendChild(thText1);
                            th1.setAttribute("colspan", "3");
                            row6.appendChild(th1);
                            var th2 = document.createElement("th");
                            var thText2 = document.createTextNode("Remarks");
                            th2.appendChild(thText2);
                            row6.appendChild(th2);
                            var th3 = document.createElement("th");
                            var thText3 = document.createTextNode("Remarks of Previous Meeting");
                            th3.appendChild(thText3);
                            row6.appendChild(th3);
                            row6.setAttribute("bgcolor", "lightBlue");

                        }

                        if (q == 1) {
                            row6.style.display = "none";
                        }

                        if (q == 2) {

                            var depotName = row6.children[0].innerText;
                            var td0 = document.createElement("td");
                            var table = document.createElement("table");
                            var tbody = document.createElement("tbody");
                            table.style.borderCollapse = "collapse";
                            table.setAttribute("width", "100%");
                            table.appendChild(tbody);
                            td0.appendChild(table);
                            td0.setAttribute("rowspan", table6Rows.length - 3);
                            td0.setAttribute("colspan", "3");
                            row6.appendChild(td0);

                            for (var r = 2; r < coverageRows.length; r++) {
                                var coverageDepot = coverageRows[r].children[0].innerText;
                                var coverageQty = coverageRows[r].children[2].innerText;
                                var coverageDP = coverageRows[r].children[4].innerText;
                                var coveragePO = coverageRows[r].children[6].innerText;
                                var coveragePOPrev = coverageRows[r - 1].children[6].innerText;
                                var coveragePONo = coveragePO.substring(9, 23);
                                var coveragePOPrevNo = coveragePOPrev.substring(9, 23);

                                if (coveragePO.substring(17, 18) != 8 && coveragePONo != coveragePOPrevNo) {
                                    var tr1 = document.createElement("tr");
                                    var td1 = document.createElement("td");
                                    var tdText1 = document.createTextNode(coveragePO);
                                    var tdText2;
                                    if (coverageDepot.startsWith("Material under accountal")) {
                                        tdText2 = document.createTextNode(coverageDepot + ": " + coverageQty + "; Date: " + coverageDP);
                                    }
                                    else {
                                        tdText2 = document.createTextNode(coverageDepot + ": " + coverageQty + "; DP: " + coverageDP);
                                    }
                                    var br = document.createElement("br");
                                    td1.setAttribute("colspan", "3");
                                    td1.style.border = "1px solid black";
                                    td1.appendChild(tdText1);
                                    td1.appendChild(br);
                                    td1.appendChild(tdText2);
                                    tr1.appendChild(td1);
                                    row6.lastChild.children[0].children[0].appendChild(tr1);

                                    cummulativeCoverage += +coverageQty;

                                }
                                if (coveragePO.substring(17, 18) != 8 && coveragePO === coveragePOPrev) {
                                    var tdText1;
                                    if (coverageDepot.startsWith("Material under accountal")) {
                                        tdText1 = document.createTextNode(coverageDepot + ": " + coverageQty + "; Date: " + coverageDP);
                                    }
                                    else {
                                        tdText1 = document.createTextNode(coverageDepot + ": " + coverageQty + "; DP: " + coverageDP);
                                    }
                                    var br = document.createElement("br");
                                    var tdNum = row6.lastChild.children[0].querySelectorAll("td").length;
                                    row6.lastChild.children[0].querySelectorAll("td")[tdNum - 1].appendChild(br);
                                    row6.lastChild.children[0].querySelectorAll("td")[tdNum - 1].appendChild(tdText1);

                                    cummulativeCoverage += +coverageQty;

                                }
                            }

                            row5.nextElementSibling.style.display = "none";

                            var uncoveredDuesTable = row5.children[1].querySelectorAll("table")[0];
                            var uncoveredRows = uncoveredDuesTable.querySelectorAll("tbody")[0].children;
                            var uncoveredTenderNoArray = [];
                            var uncoveredTenderDateArray = [];
                            var uncoveredTenderTextArray = [];

                            if (uncoveredRows.length > 1) {
                                for (var r = 1; r < uncoveredRows.length; r++) {
                                    var uncoveredDepotArray = uncoveredRows[r].children[0].innerText.split("\n");
                                    var uncoveredQtyArray = uncoveredRows[r].children[1].innerText.split("\n");
                                    var uncoveredTender = uncoveredRows[r].children[2].innerText;
                                    var uncoveredTenderDateText = uncoveredTender.substring(uncoveredTender.indexOf("due on ") + 7, uncoveredTender.indexOf("due on ") + 15);
                                    var uncoveredTenderDate = new Date("20" + uncoveredTenderDateText.split("/")[2] + "-" + uncoveredTenderDateText.split("/")[1] + "-" + uncoveredTenderDateText.split("/")[0]);
                                    var uncoveredTenderNo = uncoveredTender.split(" ")[1].substring(0, 8);

                                    if (uncoveredTender.startsWith("T/No.") && !uncoveredTenderNoArray.includes(uncoveredTenderNo)) {
                                        uncoveredTenderNoArray.push(uncoveredTenderNo);
                                        uncoveredTenderDateArray.push(uncoveredTenderDate);

                                        var tr1 = document.createElement("tr");
                                        var td1 = document.createElement("td");
                                        var tdText1 = document.createTextNode(uncoveredTender);
                                        td1.appendChild(tdText1);

                                        uncoveredDepotArray.forEach((uncoveredDepot, s) => {
                                            var br = document.createElement("br");
                                            td1.appendChild(br);
                                            var tdText2 = document.createTextNode(uncoveredDepotArray[s] + ": " + uncoveredQtyArray[s] + "; ");
                                            td1.appendChild(tdText2);
                                        });

                                        td1.style.border = "1px solid black";
                                        td1.setAttribute("colspan", "3");
                                        tr1.appendChild(td1);

                                        uncoveredTenderTextArray.push(tr1);
                                    }
                                    if (uncoveredTender.startsWith("T/No.") && uncoveredTenderNoArray.includes(uncoveredTenderNo)) {

                                        var x = uncoveredTenderNoArray.indexOf(uncoveredTenderNo);
                                        if (uncoveredTenderDate > uncoveredTenderDateArray[x]) {

                                            uncoveredTenderDateArray[x] = uncoveredTenderDate;

                                            var tr1 = document.createElement("tr");
                                            var td1 = document.createElement("td");
                                            var tdText1 = document.createTextNode(uncoveredTender);
                                            td1.appendChild(tdText1);

                                            uncoveredDepotArray.forEach((uncoveredDepot, s) => {
                                                var br = document.createElement("br");
                                                td1.appendChild(br);
                                                var tdText2 = document.createTextNode(uncoveredDepotArray[s] + ": " + uncoveredQtyArray[s] + "; ");
                                                td1.appendChild(tdText2);
                                            });

                                            td1.style.border = "1px solid black";
                                            td1.setAttribute("colspan", "3");
                                            tr1.appendChild(td1);

                                            uncoveredTenderTextArray[x] = tr1;

                                        }

                                    }

                                }

                            }

                            uncoveredTenderTextArray.forEach((uncoveredText) => {
                                row6.lastChild.children[0].children[0].appendChild(uncoveredText);
                            })

                            var td1 = document.createElement("td");
                            td1.setAttribute("rowspan", table6Rows.length - 3);
                            row6.appendChild(td1);

                            var td2 = document.createElement("td");
                            td2.setAttribute("rowspan", table6Rows.length - 3);
                            row6.appendChild(td2);

                            var descriptionText = row5.previousElementSibling.querySelectorAll("td")[0].innerText;
                            var slNo = descriptionText.split(" ")[0].split(".")[0];
                            var pl = descriptionText.split(" ")[1].split("-")[0];
                            var itemDescription = descriptionText.substring(descriptionText.indexOf("-") + 1, descriptionText.indexOf("(CP-Start"));
                            var cp = descriptionText.substring(descriptionText.indexOf("(CP-Start") + 11, descriptionText.indexOf("Pur.Sec:") - 2);
                            var purchaseSection = descriptionText.substr(descriptionText.indexOf("Pur.Sec: ") + 9, 2);

                            var td0 = document.createElement("td");
                            var table1 = document.createElement("table");
                            var tbody1 = document.createElement("tbody");
                            var tr1 = document.createElement("tr");
                            var th10 = document.createElement("th");
                            var text10 = document.createTextNode("Sl No");
                            th10.appendChild(text10);
                            th10.style.border = "1px solid black";
                            th10.setAttribute("bgcolor", "lightBlue");
                            var th11 = document.createElement("th");
                            var text11 = document.createTextNode("PL No");
                            th11.appendChild(text11);
                            th11.style.border = "1px solid black";
                            th11.setAttribute("bgcolor", "lightBlue");
                            var th12 = document.createElement("th");
                            var text12 = document.createTextNode("Item Description");
                            th12.appendChild(text12);
                            th12.style.textAlign = "left";
                            th12.style.border = "1px solid black";
                            th12.setAttribute("bgcolor", "lightBlue");
                            th12.setAttribute("colspan", "4");
                            var th13 = document.createElement("th");
                            var text13 = document.createTextNode("Vital/Safety");
                            th13.appendChild(text13);
                            th13.style.border = "1px solid black";
                            th13.setAttribute("bgcolor", "lightBlue");
                            var th14 = document.createElement("th");
                            var text14 = document.createTextNode("Category");
                            th14.appendChild(text14);
                            th14.style.border = "1px solid black";
                            th14.setAttribute("bgcolor", "lightBlue");
                            var th15 = document.createElement("th");
                            var text15 = document.createTextNode("Raised By");
                            th15.appendChild(text15);
                            th15.style.border = "1px solid black";
                            th15.setAttribute("bgcolor", "lightBlue");
                            tr1.appendChild(th10);
                            tr1.appendChild(th11);
                            tr1.appendChild(th12);
                            tr1.appendChild(th13);
                            tr1.appendChild(th14);
                            tr1.appendChild(th15);

                            var tr2 = document.createElement("tr");
                            var td20 = document.createElement("td");
                            var text20 = document.createTextNode(slNo);
                            td20.appendChild(text20);
                            td20.style.border = "1px solid black";
                            td20.style.width = "101px";
                            td20.setAttribute("bgcolor", "lightBlue");
                            td20.setAttribute("align", "center");
                            var td21 = document.createElement("td");
                            var text21 = document.createTextNode(pl);
                            td21.appendChild(text21);
                            td21.style.border = "1px solid black";
                            td21.style.width = "101px";
                            td21.setAttribute("bgcolor", "lightBlue");
                            td21.setAttribute("align", "center");
                            var td22 = document.createElement("td");
                            var text22 = document.createTextNode(itemDescription);
                            td22.appendChild(text22);
                            td22.style.border = "1px solid black";
                            td22.style.width = "411px";
                            td22.style.textAlign = "left";
                            td22.setAttribute("bgcolor", "lightBlue");
                            td22.setAttribute("colspan", "4");
                            var td23 = document.createElement("td");
                            var text23 = document.createTextNode("");
                            td23.appendChild(text23);
                            td23.style.border = "1px solid black";
                            td23.style.width = "100px";
                            td23.setAttribute("bgcolor", "lightBlue");
                            td23.setAttribute("align", "center");
                            var td24 = document.createElement("td");
                            var text24 = document.createTextNode("");
                            td24.appendChild(text24);
                            td24.style.border = "1px solid black";
                            td24.style.width = "100px";
                            td24.setAttribute("bgcolor", "lightBlue");
                            td24.setAttribute("align", "center");
                            var td25 = document.createElement("td");
                            var text25 = document.createTextNode("");
                            td25.appendChild(text25);
                            td25.style.border = "1px solid black";
                            td25.style.width = "100px";
                            td25.setAttribute("bgcolor", "lightBlue");
                            td25.setAttribute("align", "center");
                            tr2.appendChild(td20);
                            tr2.appendChild(td21);
                            tr2.appendChild(td22);
                            tr2.appendChild(td23);
                            tr2.appendChild(td24);
                            tr2.appendChild(td25);

                            /*var tr3 = document.createElement("tr");
                            var td31 = document.createElement("td");
                            td31.style.border = "1px solid black";
                            var td32 = document.createElement("td");
                            td32.style.border = "1px solid black";
                            var td33 = document.createElement("td");
                            var text33 = document.createTextNode(purchaseSection);
                            td33.appendChild(text33);
                            td33.style.border = "1px solid black";
                            var td34 = document.createElement("td");
                            var text34 = document.createTextNode(cp);
                            td34.style.border = "1px solid black";
                            td34.appendChild(text34);
                            tr3.appendChild(td31);
                            tr3.appendChild(td32);
                            tr3.appendChild(td33);
                            tr3.appendChild(td34);*/

                            tbody1.appendChild(tr1);
                            tbody1.appendChild(tr2);
                            table1.appendChild(tbody1);
                            table1.style.borderCollapse = "collapse";
                            td0.appendChild(table1);
                            row5.previousElementSibling.appendChild(td0);

                            uncoveredDuesTable.style.display = "none";
                            row5.children[0].setAttribute("width", "100%");
                            row5.previousElementSibling.querySelectorAll("td")[0].remove();

                        }

                        if (q == table6Rows.length - 1) {
                            var th1 = document.createElement("th");
                            var thText1 = document.createTextNode(cummulativeConsumptionCY);
                            th1.appendChild(thText1);
                            row6.appendChild(th1);
                            var th2 = document.createElement("th");
                            var thText2 = document.createTextNode(cummulativeConsumptionLY);
                            th2.appendChild(thText2);
                            row6.appendChild(th2);
                            var th3 = document.createElement("th");
                            var thText3 = document.createTextNode(cummulativeCoverage);
                            th3.appendChild(thText3);
                            row6.appendChild(th3);
                        }

                    }

                }
            }
        }

        if (document.title == "Manage List Groups for Reports" || document.title == "Run Form - IMMIS/LISTGROUPS") {
            body.classList.add("manage_list");

            var plInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_44")[0];
            plInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_53")[0].focus();

                }
            });
        }

        if (document.title == "Quantity Review Sheet" || document.title == "Run Form - IMMIS/PUR/QTYREVIEW") {
            body.classList.add("quantity_review");

            let getData = () => {

                var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];
                var date = divShowHtml1.children[1].querySelectorAll(":scope > table")[0].querySelectorAll("tr")[0].querySelectorAll("th")[1].innerText.substring(7, 15);
                var plNo = divShowHtml1.children[1].querySelectorAll(":scope > table")[0].querySelectorAll("tr")[1].querySelectorAll("td")[0].querySelectorAll("b")[0].innerText.substring(7);
                var itemDescription = divShowHtml1.children[1].querySelectorAll(":scope > table")[0].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerText;
                var descriptionText = divShowHtml1.children[1].querySelectorAll(":scope > table")[0].querySelectorAll("tr")[2].querySelectorAll("td")[0].innerText;
                var unit = descriptionText.substring(descriptionText.indexOf("BU:") + 4, descriptionText.indexOf("Pur.Sec:") - 1);
                var category = descriptionText.substring(descriptionText.indexOf("ABC-Cat:") + 9, descriptionText.indexOf("ABC-Cat:") + 10);
                var nature = descriptionText.substring(descriptionText.indexOf("V/S :") + 5);

                var consumptionTable = divShowHtml1.children[1].querySelectorAll(":scope > table")[1];
                var consumptionRows = consumptionTable.querySelectorAll("tbody")[0].children;
                var depotArray = [];
                var stockArray = [];
                var consumptionArray = [];
                var consumptionYearsArray = [];
                var aacArray = [];
                var mcArray = [];
                var ipRequirementsArray = [];
                var cpRequirementsArray = [];
                var bpRequirementsArray = [];
                var netRequirementsArray = [];

                for (var i = 2; i < Math.max((consumptionRows.length - 1), 3); i++) {

                    var row1 = consumptionRows[i];
                    depotArray.push(row1.querySelectorAll("td")[0].innerText);
                    stockArray.push(+row1.querySelectorAll("td")[4].innerText);
                    var array1 = [];
                    array1.push(+row1.querySelectorAll("td")[7].innerText);
                    array1.push(+row1.querySelectorAll("td")[8].innerText);
                    array1.push(+row1.querySelectorAll("td")[9].innerText);
                    array1.push(+row1.querySelectorAll("td")[10].innerText);
                    consumptionArray.push(array1);
                    aacArray.push(+row1.querySelectorAll("td")[13].innerText);
                    mcArray.push(+row1.querySelectorAll("td")[13].innerText / 12);
                }

                consumptionYearsArray.push(consumptionTable.querySelectorAll("tr")[1].children[0].innerText);
                consumptionYearsArray.push(consumptionTable.querySelectorAll("tr")[1].children[1].innerText);
                consumptionYearsArray.push(consumptionTable.querySelectorAll("tr")[1].children[2].innerText);
                consumptionYearsArray.push(consumptionTable.querySelectorAll("tr")[1].children[3].innerText);

                var udmStockBalance = divShowHtml1.children[1].querySelectorAll(":scope > table")[2].querySelectorAll("td")[0].innerText;
                var udmClone = divShowHtml1.children[1].querySelectorAll(":scope > table")[2].querySelectorAll("td")[0].querySelectorAll("a")[0].cloneNode(true);
                var coveredDuesTable = divShowHtml1.children[1].querySelectorAll(":scope > table")[3].querySelectorAll("tr")[0].children[0].querySelectorAll("table")[0];
                var coveredRows = coveredDuesTable.querySelectorAll("tbody")[0].children;
                var coveredDuesArray = [];
                var array2 = [];

                if (coveredRows.length > 1) {

                    for (var i = 1; i < coveredRows.length; i++) {

                        var row2 = coveredRows[i];

                        if (row2.children[0].innerHTML.search("<br>")) {

                            var coveredDepotArray = row2.children[0].innerHTML.split("<br>");
                            var coveredPOQtyArray = row2.children[1].innerHTML.split("<br>");
                            var coveredDueQtyArray = row2.children[2].innerHTML.split("<br>");
                            var coveredDPArray = row2.children[4].innerHTML.split("<br>");
                            var coveredPO = row2.children[5].innerText ? row2.children[5].innerText.split("Receipt under Accountal")[0] : "";

                            for (var j = 0; j < coveredDepotArray.length; j++) {

                                array2 = [];
                                array2.push(coveredDepotArray[j]);
                                array2.push(+coveredPOQtyArray[j]);
                                array2.push(+coveredDueQtyArray[j]);
                                array2.push(coveredDPArray[j]);
                                array2.push(coveredPO);
                                coveredDuesArray.push(array2);

                            }

                        }

                        else {

                            var coveredDepot = row2.children[0].innerText;
                            var coveredPOQty = +row2.children[1].innerText;
                            var coveredDueQty = +row2.children[2].innerText;
                            var coveredDP = row2.children[4].innerText;
                            var coveredPO = row2.children[5].innerText ? row2.children[5].innerText.split("Receipt under Accountal")[0] : "";

                            array2 = [];
                            array2.push(coveredDepot);
                            array2.push(+coveredPOQty);
                            array2.push(+coveredDueQty);
                            array2.push(coveredDP);
                            array2.push(coveredPO);
                            coveredDuesArray.push(array2);

                        }

                    }

                }

                var uncoveredDuesTable = divShowHtml1.children[1].querySelectorAll(":scope > table")[3].querySelectorAll("tr")[0].children[1].querySelectorAll("table")[0];
                var uncoveredRows = uncoveredDuesTable.querySelectorAll("tbody")[0].children;
                var uncoveredDuesArray = [];

                if (uncoveredRows.length > 1) {

                    for (var i = 1; i < uncoveredRows.length; i++) {

                        var row3 = uncoveredRows[i];

                        var uncoveredDepot = row3.children[0].innerText;
                        var uncoveredQty = +row3.children[1].innerText;
                        var uncoveredDemandNo = row3.children[2].innerText;
                        var uncoveredDemandDate = row3.children[3].innerText;
                        var uncoveredTenderDetails;
                        if (row3.children[4]) {
                            uncoveredTenderDetails = row3.children[4].innerText;
                        }
                        else {
                            uncoveredTenderDetails = "";
                        }

                        var array3 = [];
                        array3.push(uncoveredDepot);
                        array3.push(+uncoveredQty);
                        array3.push(uncoveredDemandNo);
                        array3.push(uncoveredDemandDate);
                        array3.push(uncoveredTenderDetails);
                        uncoveredDuesArray.push(array3);

                    }

                }

                var cpText = divShowHtml1.children[1].children[9].nextSibling.textContent;
                var cpFrom = cpText.substring(4, 12);
                var cpTo = cpText.substring(16, 24);
                var cpMM = parseInt(cpText.substring(27, 29));
                var ipFrom = cpText.substring(44, 52);
                var ipTo = cpText.substring(56, 64);
                var ipMM = parseInt(cpText.substring(67, 69));
                var bpText = divShowHtml1.children[1].children[10].nextSibling.textContent;
                var bpMM = parseInt(bpText.substring(8, 9));

                var data = new Object();
                data.date = date;
                data.plNo = plNo;
                data.itemDescription = itemDescription;
                data.descriptionText = descriptionText;
                data.unit = unit;
                data.category = category;
                data.nature = nature;

                data.depotArray = depotArray;
                data.stockArray = stockArray;
                data.consumptionArray = consumptionArray;
                data.consumptionYearsArray = consumptionYearsArray;
                data.aacArray = aacArray;
                data.mcArray = mcArray;
                data.udmStockBalance = udmStockBalance;
                data.udmClone = udmClone;
                data.coveredDuesArray = coveredDuesArray;
                data.uncoveredDuesArray = uncoveredDuesArray;

                data.cpFrom = cpFrom;
                data.cpTo = cpTo;
                data.cpMM = cpMM;
                data.ipFrom = ipFrom;
                data.ipTo = ipTo;
                data.ipMM = ipMM;
                data.bpMM = bpMM;

                return data;

            }

            let confirmData = () => {

                var data = getData();

                var date = data.date;
                var plNo = data.plNo;
                var itemDescription = data.itemDescription;
                var descriptionText = data.descriptionText;
                var unit = data.unit;
                var category = data.category;
                var nature = data.nature;

                var depotArray = data.depotArray;
                var stockArray = data.stockArray;
                var consumptionArray = data.consumptionArray;
                var consumptionYearsArray = data.consumptionYearsArray;
                var aacArray = data.aacArray;
                var mcArray = data.mcArray;
                var udmStockBalance = data.udmStockBalance;
                var udmClone = data.udmClone;
                var coveredDuesArray = data.coveredDuesArray;
                var uncoveredDuesArray = data.uncoveredDuesArray;

                var cpFrom = data.cpFrom;
                var cpTo = data.cpTo;
                var cpMM = data.cpMM;
                var ipFrom = data.ipFrom;
                var ipTo = data.ipTo;
                var ipMM = data.ipMM;
                var bpMM = data.bpMM;

                var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];

                if (divShowHtml1.querySelectorAll(".data_review")[0]) {

                    divShowHtml1.querySelectorAll(".data_review")[0].remove();

                }

                if (divShowHtml1.querySelectorAll(".qty_review_div")[0]) {

                    divShowHtml1.querySelectorAll(".qty_review_div")[0].remove();

                }

                var div = document.createElement("div");
                div.classList.add('data_review');

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td11 = document.createElement("td");
                var text11 = document.createTextNode("Review AAC");
                td11.appendChild(text11);
                td11.setAttribute("colspan", "2");
                tr1.appendChild(td11);
                tr1.setAttribute("bgcolor", "lightGrey");
                var tr2 = document.createElement("tr");
                var td21 = document.createElement("td");
                var text21 = document.createTextNode("Depot");
                td21.appendChild(text21);
                var td22 = document.createElement("td");
                var text22 = document.createTextNode("Revised AAC");
                td22.appendChild(text22);
                tr2.appendChild(td21);
                tr2.appendChild(td22);
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);

                for (var i = 0; i < depotArray.length; i++) {

                    var trP = document.createElement("tr");
                    var tdP1 = document.createElement("td");
                    var textP1 = document.createTextNode(depotArray[i]);
                    tdP1.appendChild(textP1);
                    var tdP2 = document.createElement("td");
                    var inputP2 = document.createElement("input");
                    inputP2.value = aacArray[i];
                    tdP2.appendChild(inputP2);
                    trP.appendChild(tdP1);
                    trP.appendChild(tdP2);
                    tbody1.appendChild(trP);

                }

                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td11 = document.createElement("td");
                var text11 = document.createTextNode("Review Uncovered Dues");
                td11.appendChild(text11);
                td11.setAttribute("colspan", "6");
                tr1.appendChild(td11);
                tr1.setAttribute("bgcolor", "lightGrey");
                var tr2 = document.createElement("tr");
                var td21 = document.createElement("td");
                var text21 = document.createTextNode("Depot");
                td21.appendChild(text21);
                var td22 = document.createElement("td");
                var text22 = document.createTextNode("Demand No");
                td22.appendChild(text22);
                var td23 = document.createElement("td");
                var text23 = document.createTextNode("Demand Date");
                td23.appendChild(text23);
                var td24 = document.createElement("td");
                var text24 = document.createTextNode("Qty");
                td24.appendChild(text24);
                var td25 = document.createElement("td");
                var text25 = document.createTextNode("Tender Details");
                td25.appendChild(text25);
                var td26 = document.createElement("td");
                var text26 = document.createTextNode("Action");
                td26.appendChild(text26);
                tr2.appendChild(td21);
                tr2.appendChild(td22);
                tr2.appendChild(td23);
                tr2.appendChild(td24);
                tr2.appendChild(td25);
                tr2.appendChild(td26);
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);

                for (var i = 0; i < uncoveredDuesArray.length; i++) {

                    var trQ = document.createElement("tr");
                    var tdQ1 = document.createElement("td");
                    var textQ1 = document.createTextNode(uncoveredDuesArray[i][0]);
                    tdQ1.appendChild(textQ1);
                    var tdQ2 = document.createElement("td");
                    var textQ2 = document.createTextNode(uncoveredDuesArray[i][2]);
                    tdQ2.appendChild(textQ2);
                    var tdQ3 = document.createElement("td");
                    var textQ3 = document.createTextNode(uncoveredDuesArray[i][3]);
                    tdQ3.appendChild(textQ3);
                    var tdQ4 = document.createElement("td");
                    var inputQ4 = document.createElement("input");
                    inputQ4.value = uncoveredDuesArray[i][1];
                    tdQ4.appendChild(inputQ4);
                    var tdQ5 = document.createElement("td");
                    var textQ5 = document.createTextNode(uncoveredDuesArray[i][4]);
                    tdQ5.appendChild(textQ5);
                    var tdQ6 = document.createElement("td");
                    var selectQ6 = document.createElement("select");
                    selectQ6.classList.add("demand_consider");
                    var optionQ61 = document.createElement("option");
                    optionQ61.value = "Ignore";
                    optionQ61.innerHTML = "Ignore";
                    selectQ6.appendChild(optionQ61);
                    var optionQ62 = document.createElement("option");
                    optionQ62.value = "Consider";
                    optionQ62.innerHTML = "Consider";
                    if (uncoveredDuesArray[i][0].substring(0, 1) == uncoveredDuesArray[i][4].substring(0, 1)) {
                        optionQ62.setAttribute("selected", "selected");
                        selectQ6.classList.add("considered");
                    }
                    selectQ6.appendChild(optionQ62);
                    tdQ6.appendChild(selectQ6);
                    trQ.appendChild(tdQ1);
                    trQ.appendChild(tdQ2);
                    trQ.appendChild(tdQ3);
                    trQ.appendChild(tdQ4);
                    trQ.appendChild(tdQ5);
                    trQ.appendChild(tdQ6);
                    tbody1.appendChild(trQ);

                }

                table1.appendChild(tbody1);
                div.appendChild(table1);

                var button = document.createElement("button");
                button.innerHTML = "Submit"
                button.classList.add("submit_aac_and_dues");
                button.onclick = () => {

                    var dataReviewDiv = document.querySelectorAll(".data_review")[0];

                    var aacTable = dataReviewDiv.querySelectorAll("table")[0];
                    var aacRows = aacTable.children[0].children;

                    var originalAacTable = divShowHtml1.children[1].querySelectorAll(":scope > table")[1];
                    var originalAacRows = originalAacTable.children[0].children;

                    for (var i = 2; i < originalAacRows.length; i++) {

                        for (var j = 1; j < aacRows.length; j++) {

                            if (originalAacRows[i].children[0].innerText == aacRows[j].children[0].innerText) {

                                originalAacRows[i].querySelectorAll("td")[13].innerText = aacRows[j].children[1].querySelectorAll("input")[0].value;

                            }

                        }

                    }

                    var uncoveredDuesTable = dataReviewDiv.querySelectorAll("table")[1];
                    var uncoveredRows = uncoveredDuesTable.children[0].children;

                    var originalUncoveredDuesTable = divShowHtml1.children[1].querySelectorAll(":scope > table")[3].querySelectorAll("tr")[0].children[1].querySelectorAll("table")[0];
                    var originalUncoveredRows = originalUncoveredDuesTable.querySelectorAll("tbody")[0].children;

                    var j = 1;
                    for (var i = 2; i < uncoveredRows.length; i++) {

                        if (uncoveredRows[i].children[5].querySelectorAll("select")[0].value == "Consider") {
                            originalUncoveredRows[j].querySelectorAll("td")[1].innerText = uncoveredRows[i].children[3].querySelectorAll("input")[0].value;
                        }
                        else {

                            originalUncoveredRows[j].remove();
                            j--;

                        }
                        j++;

                    }

                    divShowHtml1.children[2].style.display = "none";
                    showQWS();

                }
                div.appendChild(button);

                divShowHtml1.appendChild(div);
                divShowHtml1.children[0].querySelectorAll("input[value='Print']")[0].removeAttribute('onclick');

            }

            let showQWS = () => {

                var data = getData();

                var date = data.date;
                var plNo = data.plNo;
                var itemDescription = data.itemDescription;
                var descriptionText = data.descriptionText;
                var unit = data.unit;
                var category = data.category;
                var nature = data.nature;

                var depotArray = data.depotArray;
                var stockArray = data.stockArray;
                var consumptionArray = data.consumptionArray;
                var consumptionYearsArray = data.consumptionYearsArray;
                var aacArray = data.aacArray;
                var mcArray = data.mcArray;
                var udmStockBalance = data.udmStockBalance;
                var udmClone = data.udmClone;
                var coveredDuesArray = data.coveredDuesArray;
                var uncoveredDuesArray = data.uncoveredDuesArray;

                var cpFrom = data.cpFrom;
                var cpTo = data.cpTo;
                var cpMM = data.cpMM;
                var ipFrom = data.ipFrom;
                var ipTo = data.ipTo;
                var ipMM = data.ipMM;
                var bpMM = data.bpMM;

                var ipRequirementsArray = [];
                var cpRequirementsArray = [];
                var bpRequirementsArray = [];
                var netRequirementsArray = [];

                var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];

                if (divShowHtml1.querySelectorAll(".qty_review_div")[0]) {

                    divShowHtml1.querySelectorAll(".qty_review_div")[0].remove();

                }

                var div = document.createElement("div");
                div.classList.add('qty_review_div');

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td1 = document.createElement("td");
                var text1 = document.createTextNode("QUANTITY REVIEW SHEET");
                td1.appendChild(text1);
                tr1.appendChild(td1);
                tbody1.appendChild(tr1);
                var tr2 = document.createElement("tr");
                var td2 = document.createElement("td");
                var text2 = document.createTextNode("Date: " + date);
                td2.appendChild(text2);
                tr2.appendChild(td2);
                tr1.setAttribute("bgcolor", "lightBlue");
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);
                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td1 = document.createElement("td");
                var text1 = document.createTextNode("PL No");
                td1.appendChild(text1);
                var td2 = document.createElement("td");
                var text2 = document.createTextNode(plNo);
                td2.appendChild(text2);
                var td3 = document.createElement("td");
                var text3 = document.createTextNode("Nature");
                td3.appendChild(text3);
                var td4 = document.createElement("td");
                var natureText = nature == "S" ? "Safety" : nature == "V" ? "Vital" : "Ordinary";
                var text4 = document.createTextNode(natureText);
                td4.appendChild(text4);
                var td5 = document.createElement("td");
                var text5 = document.createTextNode("Category");
                td5.appendChild(text5);
                var td6 = document.createElement("td");
                var text6 = document.createTextNode(category);
                td6.appendChild(text6);
                var td7 = document.createElement("td");
                var text7 = document.createTextNode("Unit");
                td7.appendChild(text7);
                var td8 = document.createElement("td");
                var text8 = document.createTextNode(unit);
                td8.appendChild(text8);
                tr1.appendChild(td1);
                tr1.appendChild(td2);
                tr1.appendChild(td3);
                tr1.appendChild(td4);
                tr1.appendChild(td5);
                tr1.appendChild(td6);
                tr1.appendChild(td7);
                tr1.appendChild(td8);
                var tr2 = document.createElement("tr");
                var td9 = document.createElement("td");
                var text9 = document.createTextNode("Description");
                td9.appendChild(text9);
                var td10 = document.createElement("td");
                var text10 = document.createTextNode(itemDescription);
                td10.appendChild(text10);
                td10.setAttribute("colspan", "7");
                tr2.appendChild(td9);
                tr2.appendChild(td10);
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);
                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td1 = document.createElement("td");
                var text1 = document.createTextNode("Stock and Consumption History");
                td1.appendChild(text1);
                td1.setAttribute("colspan", 8);
                tr1.appendChild(td1);
                var tr2 = document.createElement("tr");
                var td2 = document.createElement("td");
                var text2 = document.createTextNode("Depot");
                td2.appendChild(text2);
                var td3 = document.createElement("td");
                var text3 = document.createTextNode("Cons " + consumptionYearsArray[0]);
                td3.appendChild(text3);
                var td4 = document.createElement("td");
                var text4 = document.createTextNode("Cons " + consumptionYearsArray[1]);
                td4.appendChild(text4);
                var td5 = document.createElement("td");
                var text5 = document.createTextNode("Cons " + consumptionYearsArray[2]);
                td5.appendChild(text5);
                var td6 = document.createElement("td");
                var text6 = document.createTextNode("Cons " + consumptionYearsArray[3]);
                td6.appendChild(text6);
                var td7 = document.createElement("td");
                var text7 = document.createTextNode("Weighted Avg Consumption");
                td7.appendChild(text7);
                var td8 = document.createElement("td");
                var text8 = document.createTextNode("AAC");
                td8.appendChild(text8);
                var td9 = document.createElement("td");
                var text9 = document.createTextNode("Stock");
                td9.appendChild(text9);
                tr2.appendChild(td2);
                tr2.appendChild(td3);
                tr2.appendChild(td4);
                tr2.appendChild(td5);
                tr2.appendChild(td6);
                tr2.appendChild(td7);
                tr2.appendChild(td8);
                tr2.appendChild(td9);
                tr1.setAttribute("bgcolor", "lightBlue");
                tr2.setAttribute("bgcolor", "lightBlue");
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);

                for (var i = 0; i < depotArray.length; i++) {

                    var tri = document.createElement("tr");
                    var tdi1 = document.createElement("td");
                    var texti1 = document.createTextNode(depotArray[i]);
                    tdi1.appendChild(texti1);
                    var tdi2 = document.createElement("td");
                    var texti2 = document.createTextNode(consumptionArray[i][0]);
                    tdi2.appendChild(texti2);
                    var tdi3 = document.createElement("td");
                    var texti3 = document.createTextNode(consumptionArray[i][1]);
                    tdi3.appendChild(texti3);
                    var tdi4 = document.createElement("td");
                    var texti4 = document.createTextNode(consumptionArray[i][2]);
                    tdi4.appendChild(texti4);
                    var tdi5 = document.createElement("td");
                    var texti5 = document.createTextNode(consumptionArray[i][3]);
                    tdi5.appendChild(texti5);
                    var dateArray = date.split("/");
                    var numMonths = +dateArray[1] - 4 + +dateArray[0] / 30;
                    var avgConsumption = Math.round((+consumptionArray[i][0] * 1 + +consumptionArray[i][1] * 2 + +consumptionArray[i][2] * 3 + +consumptionArray[i][3] * 3) / (6 + 3 * numMonths / 12) * 100) / 100;
                    var tdi6 = document.createElement("td");
                    var texti6 = document.createTextNode(avgConsumption);
                    tdi6.appendChild(texti6);
                    var tdi7 = document.createElement("td");
                    var texti7 = document.createTextNode(aacArray[i]);
                    tdi7.appendChild(texti7);
                    var tdi8 = document.createElement("td");
                    var texti8 = document.createTextNode(stockArray[i]);
                    tdi8.appendChild(texti8);
                    tri.appendChild(tdi1);
                    tri.appendChild(tdi2);
                    tri.appendChild(tdi3);
                    tri.appendChild(tdi4);
                    tri.appendChild(tdi5);
                    tri.appendChild(tdi6);
                    tri.appendChild(tdi7);
                    tri.appendChild(tdi8);
                    tbody1.appendChild(tri);

                }

                var tri = document.createElement("tr");
                var tdi1 = document.createElement("td");
                var texti1 = document.createTextNode("UDM");
                tdi1.appendChild(texti1);
                var tdi2 = document.createElement("td");
                var texti2 = document.createTextNode("-");
                tdi2.appendChild(texti2);
                var tdi3 = document.createElement("td");
                var texti3 = document.createTextNode("-");
                tdi3.appendChild(texti3);
                var tdi4 = document.createElement("td");
                var texti4 = document.createTextNode("-");
                tdi4.appendChild(texti4);
                var tdi5 = document.createElement("td");
                var texti5 = document.createTextNode("-");
                tdi5.appendChild(texti5);
                var tdi6 = document.createElement("td");
                var texti6 = document.createTextNode("-");
                tdi6.appendChild(texti6);
                var tdi7 = document.createElement("td");
                var texti7 = document.createTextNode("-");
                tdi7.appendChild(texti7);
                var tdi8 = document.createElement("td");
                var texti8 = document.createTextNode(udmStockBalance);
                tdi8.appendChild(texti8);
                tri.appendChild(tdi1);
                tri.appendChild(tdi2);
                tri.appendChild(tdi3);
                tri.appendChild(tdi4);
                tri.appendChild(tdi5);
                tri.appendChild(tdi6);
                tri.appendChild(tdi7);
                tri.appendChild(tdi8);
                tbody1.appendChild(tri);

                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td1 = document.createElement("td");
                var text1 = document.createTextNode("Covered Dues");
                td1.appendChild(text1);
                td1.setAttribute("colspan", 3);
                tr1.appendChild(td1);
                var tr2 = document.createElement("tr");
                var td2 = document.createElement("td");
                var text2 = document.createTextNode("Depot");
                td2.appendChild(text2);
                var td30 = document.createElement("td");
                var tr33 = document.createElement("tr");
                var td3 = document.createElement("td");
                var text3 = document.createTextNode("PO Details");
                td3.appendChild(text3);
                var td4 = document.createElement("td");
                var text4 = document.createTextNode("Due Qty");
                td4.appendChild(text4);
                var td5 = document.createElement("td");
                var text5 = document.createTextNode("Total Qty");
                td5.appendChild(text5);
                tr2.appendChild(td2);
                tr33.appendChild(td3);
                tr33.appendChild(td4);
                td30.appendChild(tr33);
                tr2.appendChild(td30);
                tr2.appendChild(td5);
                tr1.setAttribute("bgcolor", "lightBlue");
                tr2.setAttribute("bgcolor", "lightBlue");
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);

                var totalCoveredDuesArray = [];

                for (var i = 0; i < depotArray.length; i++) {

                    var trJ = document.createElement("tr");
                    var tdJ1 = document.createElement("td");
                    var textJ1 = document.createTextNode(depotArray[i]);
                    tdJ1.appendChild(textJ1);
                    var tdJ2 = document.createElement("td");
                    var tdJ3 = document.createElement("td");
                    var tdJ4 = document.createElement("td");

                    var totalDues = 0;
                    for (var j = 0; j < coveredDuesArray.length; j++) {

                        var row4 = coveredDuesArray[j];

                        if ((row4[0] == depotArray[i].substring(0, 2)) && (row4[4].substring(16, 17) != "8") && (row4[4].substring(16, 17) != "7")) {

                            var trK1 = document.createElement("tr");
                            var tdK1 = document.createElement("td");
                            var textK1 = document.createTextNode(row4[4].slice(0, 35) + " " + row4[4].slice(35));
                            var br = document.createElement("br");
                            var textK2 = document.createTextNode("DP: " + row4[3]);
                            tdK1.appendChild(textK1);
                            tdK1.appendChild(br);
                            tdK1.appendChild(textK2);
                            trK1.appendChild(tdK1);

                            var tdK2 = document.createElement("td");
                            var textK3 = document.createTextNode(row4[2]);
                            tdK2.appendChild(textK3);
                            trK1.appendChild(tdK2);
                            tdJ3.appendChild(trK1);

                            totalDues += +row4[2];

                        }

                    }

                    totalCoveredDuesArray.push(totalDues);
                    var textK4 = document.createTextNode(totalDues);
                    tdJ4.appendChild(textK4);
                    trJ.appendChild(tdJ1);
                    trJ.appendChild(tdJ3);
                    trJ.appendChild(tdJ4);
                    tbody1.appendChild(trJ);

                }

                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td11 = document.createElement("td");
                var text11 = document.createTextNode("Uncovered Dues");
                td11.appendChild(text11);
                td11.setAttribute("colspan", 3);
                tr1.appendChild(td11);
                var tr2 = document.createElement("tr");
                var td21 = document.createElement("td");
                var text21 = document.createTextNode("Depot");
                td21.appendChild(text21);
                var td22 = document.createElement("td");
                var tr3 = document.createElement("tr");
                var td31 = document.createElement("td");
                var text31 = document.createTextNode("Demand No");
                td31.appendChild(text31);
                var td32 = document.createElement("td");
                var text32 = document.createTextNode("Demand Date");
                td32.appendChild(text32);
                var td33 = document.createElement("td");
                var text33 = document.createTextNode("Tender Details");
                td33.appendChild(text33);
                var td34 = document.createElement("td");
                var text34 = document.createTextNode("Qty");
                td34.appendChild(text34);
                tr3.appendChild(td31);
                tr3.appendChild(td32);
                tr3.appendChild(td33);
                tr3.appendChild(td34);
                td22.appendChild(tr3);
                var td23 = document.createElement("td");
                var text23 = document.createTextNode("Total Qty");
                td23.appendChild(text23);
                tr2.appendChild(td21);
                tr2.appendChild(td22);
                tr2.appendChild(td23);
                tr1.setAttribute("bgcolor", "lightBlue");
                tr2.setAttribute("bgcolor", "lightBlue");
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);

                var totalUncoveredDuesArray = [];

                for (var i = 0; i < depotArray.length; i++) {

                    var trJ = document.createElement("tr");
                    var tdJ1 = document.createElement("td");
                    var textJ1 = document.createTextNode(depotArray[i]);
                    tdJ1.appendChild(textJ1);
                    var tdJ2 = document.createElement("td");
                    var tdJ3 = document.createElement("td");

                    var totalDues = 0;
                    for (var j = 0; j < uncoveredDuesArray.length; j++) {

                        var row4 = uncoveredDuesArray[j];

                        if (row4[0] == depotArray[i]) {

                            var trK1 = document.createElement("tr");
                            var tdK1 = document.createElement("td");
                            var textK1 = document.createTextNode(row4[2]);
                            tdK1.appendChild(textK1);
                            trK1.appendChild(tdK1);

                            var tdK2 = document.createElement("td");
                            var textK2 = document.createTextNode(row4[3]);
                            tdK2.appendChild(textK2);
                            trK1.appendChild(tdK2);

                            var tdK3 = document.createElement("td");
                            var textK3 = document.createTextNode(row4[4]);
                            tdK3.appendChild(textK3);
                            trK1.appendChild(tdK3);

                            var tdK4 = document.createElement("td");
                            var textK4 = document.createTextNode(row4[1]);
                            tdK4.appendChild(textK4);
                            trK1.appendChild(tdK4);

                            tdJ2.appendChild(trK1);
                            trK1.appendChild(tdK2);
                            trK1.appendChild(tdK3);
                            trK1.appendChild(tdK4);
                            tdJ2.appendChild(trK1);

                            totalDues += +row4[1];

                        }

                    }

                    totalUncoveredDuesArray.push(totalDues);
                    var textJ3 = document.createTextNode(totalDues);
                    tdJ3.appendChild(textJ3);
                    trJ.appendChild(tdJ1);
                    trJ.appendChild(tdJ2);
                    trJ.appendChild(tdJ3);
                    tbody1.appendChild(trJ);
                }

                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td1 = document.createElement("td");
                var text1 = document.createTextNode("Period Under Consideration");
                td1.appendChild(text1);
                td1.setAttribute("colspan", 3);
                tr1.appendChild(td1);
                tr1.setAttribute("bgcolor", "lightBlue");

                var tr2 = document.createElement("tr");
                var td21 = document.createElement("td");
                var text21 = document.createTextNode("IP");
                td21.appendChild(text21);
                var td22 = document.createElement("td");
                var text22 = document.createTextNode(ipFrom + " to " + ipTo);
                td22.appendChild(text22);
                var td23 = document.createElement("td");
                var text23 = document.createTextNode(ipMM + " Months");
                td23.appendChild(text23);
                tr2.appendChild(td21);
                tr2.appendChild(td22);
                tr2.appendChild(td23);

                var tr3 = document.createElement("tr");
                var td31 = document.createElement("td");
                var text31 = document.createTextNode("CP");
                td31.appendChild(text31);
                var td32 = document.createElement("td");
                var text32 = document.createTextNode(cpFrom + " to " + cpTo);
                td32.appendChild(text32);
                var td33 = document.createElement("td");
                var text33 = document.createTextNode(cpMM + " Months");
                td33.appendChild(text33);
                tr3.appendChild(td31);
                tr3.appendChild(td32);
                tr3.appendChild(td33);

                var tr4 = document.createElement("tr");
                var td41 = document.createElement("td");
                var text41 = document.createTextNode("Buffer");
                td41.appendChild(text41);
                var td42 = document.createElement("td");
                var text42 = document.createTextNode("-");
                td42.appendChild(text42);
                var td43 = document.createElement("td");
                var text43 = document.createTextNode(bpMM + " Months");
                td43.appendChild(text43);
                tr4.appendChild(td41);
                tr4.appendChild(td42);
                tr4.appendChild(td43);

                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);
                tbody1.appendChild(tr3);
                tbody1.appendChild(tr4);
                table1.appendChild(tbody1);
                div.appendChild(table1);

                var table1 = document.createElement("table");
                var tbody1 = document.createElement("tbody");
                var tr1 = document.createElement("tr");
                var td1 = document.createElement("td");
                var text1 = document.createTextNode("Net Requirements");
                td1.appendChild(text1);
                td1.setAttribute("colspan", 10);
                tr1.appendChild(td1);
                var tr2 = document.createElement("tr");
                var td2 = document.createElement("td");
                var text2 = document.createTextNode("Depot");
                td2.appendChild(text2);
                var td3 = document.createElement("td");
                var text3 = document.createTextNode("AAC");
                td3.appendChild(text3);
                var td4 = document.createElement("td");
                var text4 = document.createTextNode("Monthly Requirement");
                td4.appendChild(text4);
                var td5 = document.createElement("td");
                var text5 = document.createTextNode("IP Requirement");
                td5.appendChild(text5);
                var td6 = document.createElement("td");
                var text6 = document.createTextNode("CP Requirement");
                td6.appendChild(text6);
                var td7 = document.createElement("td");
                var text7 = document.createTextNode("BP Requirement");
                td7.appendChild(text7);
                var td8 = document.createElement("td");
                var text8 = document.createTextNode("CD");
                td8.appendChild(text8);
                var td9 = document.createElement("td");
                var text9 = document.createTextNode("UCD");
                td9.appendChild(text9);
                var td10 = document.createElement("td");
                var text10 = document.createTextNode("Stock");
                td10.appendChild(text10);
                var td11 = document.createElement("td");
                var text11 = document.createTextNode("Total Requirement");
                td11.appendChild(text11);
                tr2.appendChild(td2);
                tr2.appendChild(td3);
                tr2.appendChild(td4);
                tr2.appendChild(td5);
                tr2.appendChild(td6);
                tr2.appendChild(td7);
                tr2.appendChild(td8);
                tr2.appendChild(td9);
                tr2.appendChild(td10);
                tr2.appendChild(td11);
                tr1.setAttribute("bgcolor", "lightBlue");
                tr2.setAttribute("bgcolor", "lightBlue");
                tbody1.appendChild(tr1);
                tbody1.appendChild(tr2);

                for (var i = 0; i <= depotArray.length; i++) {

                    var trM = document.createElement("tr");
                    var tdM1 = document.createElement("td");
                    var textM1;
                    if (i == depotArray.length) {
                        textM1 = document.createTextNode("Total");
                    }
                    else {
                        textM1 = document.createTextNode(depotArray[i]);
                    }
                    tdM1.appendChild(textM1);

                    var tdM2 = document.createElement("td");
                    var textM2;
                    if (i == depotArray.length) {
                        textM2 = document.createTextNode(aacArray.reduce((a, b) => a + b, 0));
                    }
                    else {
                        textM2 = document.createTextNode(aacArray[i]);
                    }
                    tdM2.appendChild(textM2);

                    var tdM3 = document.createElement("td");
                    var textM3;
                    if (i == depotArray.length) {
                        textM3 = document.createTextNode(Math.round(mcArray.reduce((a, b) => a + b, 0) * 100) / 100);
                    }
                    else {
                        textM3 = document.createTextNode(Math.round(mcArray[i] * 100) / 100);
                    }
                    tdM3.appendChild(textM3);

                    var tdM4 = document.createElement("td");
                    var textM4;
                    if (i == depotArray.length) {
                        textM4 = document.createTextNode(Math.round(ipRequirementsArray.reduce((a, b) => a + b, 0) * 100) / 100);
                    }
                    else {
                        var ipRequirement = mcArray[i] * ipMM;
                        ipRequirementsArray.push(+ipRequirement);
                        textM4 = document.createTextNode(Math.round(ipRequirement * 100) / 100);
                    }
                    tdM4.appendChild(textM4);

                    var tdM5 = document.createElement("td");
                    var textM5;
                    if (i == depotArray.length) {
                        textM5 = document.createTextNode(Math.round(cpRequirementsArray.reduce((a, b) => a + b, 0) * 100) / 100);
                    }
                    else {
                        var cpRequirement = aacArray[i];
                        cpRequirementsArray.push(+cpRequirement);
                        textM5 = document.createTextNode(Math.round(cpRequirement * 100) / 100);
                    }
                    tdM5.appendChild(textM5);

                    var tdM6 = document.createElement("td");
                    var textM6;
                    if (i == depotArray.length) {
                        textM6 = document.createTextNode(Math.round(bpRequirementsArray.reduce((a, b) => a + b, 0) * 100) / 100);
                    }
                    else {
                        var bpRequirement = mcArray[i] * bpMM;
                        bpRequirementsArray.push(+bpRequirement);
                        textM6 = document.createTextNode(Math.round(bpRequirement * 100) / 100);
                    }
                    tdM6.appendChild(textM6);

                    var tdM7 = document.createElement("td");
                    var textM7;
                    if (i == depotArray.length) {
                        textM7 = document.createTextNode(totalCoveredDuesArray.reduce((a, b) => a + b, 0));
                    }
                    else {
                        textM7 = document.createTextNode(totalCoveredDuesArray[i]);
                    }
                    tdM7.appendChild(textM7);

                    var tdM8 = document.createElement("td");
                    var textM8;
                    if (i == depotArray.length) {
                        textM8 = document.createTextNode(totalUncoveredDuesArray.reduce((a, b) => a + b, 0));
                    }
                    else {
                        textM8 = document.createTextNode(totalUncoveredDuesArray[i]);
                    }
                    tdM8.appendChild(textM8);

                    var tdM9 = document.createElement("td");
                    var textM9;
                    if (i == depotArray.length) {
                        textM9 = document.createTextNode(stockArray.reduce((a, b) => a + b, 0));
                    }
                    else {
                        textM9 = document.createTextNode(stockArray[i]);
                    }
                    tdM9.appendChild(textM9);

                    var tdM10 = document.createElement("td");
                    var textM10;
                    if (i == depotArray.length) {
                        textM10 = document.createTextNode(Math.round(netRequirementsArray.reduce((a, b) => a + b, 0) * 100) / 100);
                    }
                    else {
                        var netRequirement = ipRequirement + cpRequirement + bpRequirement - totalCoveredDuesArray[i] - totalUncoveredDuesArray[i] - stockArray[i];
                        netRequirementsArray.push(+netRequirement);
                        textM10 = document.createTextNode(Math.round(netRequirement * 100) / 100);
                    }
                    tdM10.appendChild(textM10);

                    trM.appendChild(tdM1);
                    trM.appendChild(tdM2);
                    trM.appendChild(tdM3);
                    trM.appendChild(tdM4);
                    trM.appendChild(tdM5);
                    trM.appendChild(tdM6);
                    trM.appendChild(tdM7);
                    trM.appendChild(tdM8);
                    trM.appendChild(tdM9);
                    trM.appendChild(tdM10);

                    tbody1.appendChild(trM);

                }

                table1.appendChild(tbody1);
                div.appendChild(table1);

                divShowHtml1.appendChild(div);

            }

            var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];

            document.addEventListener("click", (e) => {
                if (e.target.name == "btn_Show_0") {
                    confirmData();

                    divShowHtml1.children[1].style.display = "none";
                }
                if (e.target.value == "Print") {

                    var qty_review_div = divShowHtml1.querySelectorAll(".qty_review_div")[0];

                    var a = window.open('', '', 'fullscreen=yes');
                    a.document.write('<html>');
                    a.document.write('<body >');
                    a.document.write(qty_review_div.outerHTML);
                    a.document.write('</body></html>');
                    a.document.close();
                    a.print();
                }
            });

            document.addEventListener("change", (e) => {
                if (e.target.classList.contains("demand_consider")) {
                    if (e.target.value == "Consider") {
                        e.target.classList.add("considered");
                    }
                    else {
                        e.target.classList.remove("considered");
                    }
                }
            });

            var plInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_7")[0];
            plInput.focus();
            plInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_13")[0].focus();

                }
            });
        }

        if (document.title == "Auto DRR Status Report" || document.title == "Run Form - IMMIS/DEP/AUTODRR") {
            body.classList.add("auto_drr_report");

            document.addEventListener("click", (e) => {
                if (e.target.name == "SHOW_EDISP_0") {

                    var depotInput = document.querySelectorAll("#s_0_11")[0].value;
                    var titleBar = document.querySelectorAll("#TitleBar")[0];
                    var depotCode;
                    zoneDepotArray.forEach((depot) => {

                        if (depot[0] == depotInput) {
                            depotCode = depot[1];
                        }
                    })

                    var zoneCode = titleBar.querySelectorAll("td")[0].innerText.split(":")[0].substring(1, 3);

                    var s_3 = document.querySelectorAll("#s_3")[0];
                    var rows = s_3.querySelectorAll("div")[0].querySelectorAll("tbody")[0].children;

                    for (var i = 1; i < rows.length; i++) {

                        var row = rows[i];
                        var eDispatchNo = row.querySelectorAll("td")[1].innerText;
                        var eDispatchDepot = eDispatchNo.split("/")[1];

                        if (eDispatchDepot != "00" + depotCode + "00") {

                            row.style.display = "none";

                        }

                        var poNo = row.querySelectorAll("td")[7].innerText;
                        var poDate = row.querySelectorAll("td")[8].innerText;
                        var poYear = "20" + poDate.split("-")[2];

                        var link = document.createElement("a");
                        var linkText = document.createTextNode(poNo);
                        link.appendChild(linkText);
                        link.title = poNo;
                        link.href =
                            "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/" +
                            poYear +
                            "/" +
                            zoneCode +
                            "/" +
                            poNo +
                            ".pdf";
                        link.target = "_blank";
                        row.children[7].innerHTML = "";
                        row.children[7].appendChild(link);

                    }

                }
            });
        }

        if (document.title == "Consignee Wise AAC Master" || document.title == "Run Form - IMMIS/PUR/CONSAAC") {
            body.classList.add("consignee_aac");

            document.addEventListener("click", (e) => {
                if (e.target.title == "View Added Cons. AAC.") {
                    var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;
                    var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];
                    scrollTop += 150;

                    divShowHtml1.style.top = scrollTop + "px";
                }
                if (e.target.title == "Select This PL." && e.target.closest("table").id == "tab_fwd_aislist") {
                    var s_4 = body.querySelectorAll("#s_4")[0];
                    var consumptionTable = s_4.querySelectorAll("fieldset")[1].querySelectorAll("tbody")[0];

                    var consumption1st = 0;
                    var consumption2nd = 0;

                    for (var i = 1; i < consumptionTable.children.length; i++) {
                        var consigneeRow = consumptionTable.children[i];
                        var consigneeConsumption1st = 0;
                        var consigneeConsumption2nd = 0;

                        if (typeof (consigneeRow.children[3]) != "undefined" || consigneeRow.children[3] != null) {
                            consigneeConsumption1st = consigneeRow.children[3].innerText;
                        }
                        if (typeof (consigneeRow.children[4]) != "undefined" || consigneeRow.children[4] != null) {
                            consigneeConsumption2nd = consigneeRow.children[4].innerText;
                        }

                        consumption1st += +consigneeConsumption1st;
                        consumption2nd += +consigneeConsumption2nd;
                    }

                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var text1 = document.createTextNode("Total consumption");
                    td1.appendChild(text1);
                    td1.setAttribute("colspan", 3);
                    td1.style.textAlign = "center";
                    var td2 = document.createElement("td");
                    var text2 = document.createTextNode(consumption1st);
                    td2.appendChild(text2);
                    td2.style.textAlign = "center";
                    var td3 = document.createElement("td");
                    var text3 = document.createTextNode(consumption2nd);
                    td3.appendChild(text3);
                    td3.style.textAlign = "center";
                    var td4 = document.createElement("td");
                    td4.setAttribute("colspan", 2);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    consumptionTable.appendChild(tr);
                }
            });
        }

        if (document.title == "Map Consignee in Depot" || document.title == "Run Form - IMMIS/DEP/DOCONSMAP") {
            body.classList.add("depot_consignee_mapping");
        }

        if (document.title == "TPI Status" || document.title == "Run Form - IMMIS/PUR/TPINSP") {
            body.classList.add("tpi_status");

            var monthSelect = document.querySelectorAll("#s_0_10")[0];
            monthSelect.selectedIndex = new Date().getMonth();

            document.addEventListener("click", (e) => {
                if (e.target.id == "s_0_15") {

                    var s_2 = body.querySelectorAll("#s_2")[0];
                    var s_3 = body.querySelectorAll("#s_3")[0];

                    if (s_2.querySelectorAll(":scope > table").length > 1) {

                        s_2.querySelectorAll(":scope > table")[1].remove();

                    }

                    var tableHeader = s_3.querySelectorAll("div")[0].querySelectorAll("tr")[0];
                    var tableHeaderClone = tableHeader.cloneNode(true);

                    var tableHeaderCloneChildren = tableHeaderClone.children;
                    for (var i = 0; i < tableHeaderCloneChildren.length; i++) {

                        var tableHeaderCloneChild = tableHeaderCloneChildren[i];
                        tableHeaderCloneChild.style.width = window.getComputedStyle(tableHeader.querySelectorAll("td")[i]).getPropertyValue("width");
                    }

                    var table1 = document.createElement("table");
                    var tbody1 = document.createElement("tbody");
                    tbody1.appendChild(tableHeaderClone);
                    table1.appendChild(tbody1);
                    s_2.appendChild(table1);

                    var inspectionTable = s_3.querySelectorAll("table")[1];
                    var inspectionTableRows = inspectionTable.querySelectorAll("tbody")[0].children;

                    for (var j = 1; j < inspectionTableRows.length; j++) {

                        var inspectionRow = inspectionTableRows[j];
                        var poNo = inspectionRow.children[6].innerText;
                        var qtyRejected = inspectionRow.children[14].innerText;
                        var qtyPassed = inspectionRow.children[12].innerText;

                        var p = document.createElement("p");
                        var pText = document.createTextNode("Get PO");
                        p.appendChild(pText);
                        p.className = "get_po_url";
                        inspectionRow.children[6].appendChild(p);

                        if (+qtyRejected > +qtyPassed) {
                            var br = document.createElement("br");
                            var rText = document.createTextNode("Rejected");
                            inspectionRow.children[16].appendChild(br);
                            inspectionRow.children[16].appendChild(rText);
                            inspectionRow.children[16].style.color = "red";

                        }

                    }

                }

                if (e.target.classList.contains("get_po_url")) {

                    async function getPOUrl() {

                        var poNo = e.target.parentElement.innerText.substring(0, 15);
                        var poYear = "20" + poNo.substring(2, 4);
                        var poZone = currentZone;

                        var url = "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/" +
                            poYear +
                            "/" +
                            zoneJson[poZone] +
                            "/" +
                            poNo +
                            ".pdf";

                        try {
                            const urlExists = await checkUrl(url);
                            if (!urlExists) {
                                poYear = +poYear + 1;
                                url = "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/" +
                                    poYear +
                                    "/" +
                                    zoneJson[poZone] +
                                    "/" +
                                    poNo +
                                    ".pdf";
                            }

                            var link = document.createElement("a");
                            var linkText = document.createTextNode(poNo);
                            link.appendChild(linkText);
                            link.title = poNo;
                            link.href = url;
                            link.target = "_blank";
                            e.target.parentElement.appendChild(link);
                        } catch (error) {
                            console.error(`Error in exampleUsage: ${error.message}`);
                        }

                    }

                    getPOUrl();

                }
            });
        }

        if (document.title == "Spare Stock Entry" || document.title == "Run Form - IMMIS/DEP/SPARESTKENTRY") {
            body.classList.add("spare_stock_entry");

            var CanvassHolder = document.querySelectorAll("#CanvassHolder")[0];
            var s_3 = document.querySelectorAll("#s_3")[0];
            var div = s_3.querySelectorAll("tr")[1].querySelectorAll("div")[0];
            var divCssText = div.style.cssText;
            var divCssTextNew = divCssText.slice(0, divCssText.indexOf("overflow:") - 2) + " !important" + divCssText.slice(divCssText.indexOf("overflow:") - 2);
            div.style.cssText = divCssTextNew;
        }

        if (document.title == "BIN CARD" || document.title == "Run Form - IMMIS/DEP/BINCARD") {
            body.classList.add("bin_card");

            var plInput = document.querySelectorAll("#s_0_8")[0];
            var monthFromInput = document.querySelectorAll("#s_0_15")[0];
            var yyCode = "";

            if (new Date().getMonth() < 3) {
                yyCode = +currentYear.substring(2, 4) - 1;
            }
            else {
                yyCode = currentYear.substring(2, 4)
            }

            monthFromInput.value = yyCode + "04";

            plInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.key === "Enter") {
                    e.target.parentElement.nextElementSibling.nextElementSibling.querySelectorAll("select")[0].value = currentDepotCode;
                    e.target.parentElement.nextElementSibling.nextElementSibling.querySelectorAll("select")[0].dispatchEvent(new Event('change', { bubbles: true }));
                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_19")[0].focus();
                }
            });
        }

        if (document.title == "Status of Receipt Accountal" || document.title == "Run Form - IMMIS/DEP/DRRSTAT") {
            body.classList.add("drr_status");

            var dateFromInput = document.querySelectorAll("#s_0_11")[0];
            var yyCode = "";

            if (new Date().getMonth() < 3) {
                yyCode = +currentYear.substring(2, 4) - 1;
            }
            else {
                yyCode = currentYear.substring(2, 4)
            }

            dateFromInput.value = "01-APR-" + yyCode;

            var statisticsButton = document.querySelectorAll("#s_0_29")[0];
            statisticsButton.click();
        }
    },
    false
);