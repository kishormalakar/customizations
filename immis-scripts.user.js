// ==UserScript==
// @name         IMMIS
// @namespace    http://tampermonkey.net/
// @version      1.0.34
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

        var currentZone = "ECR";
        var currentZoneCode = "10";
        var currentYear = "2023";

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

        if (document.title != "System Start Page" && document.title != "Output of Report - LISTPOS") {
            setRelativePositioning();

            document.addEventListener("click", (e) => {
                setRelativePositioning();
            });
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
                    listOffsetTop = e.target.closest("tr").offsetHeight;

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
            //rlyName.value = "IR";

            var stockNS = document.querySelectorAll('select[name="STKNS_0"]')[0];
            stockNS.value = "N";

            var poTo = document.querySelectorAll("#LBL_TB_DT_TO")[0].nextElementSibling.value;
            var poToArray = poTo.split("-");

            var poFromDay = +poToArray[0] + 1;
            var poFromMonth = poToArray[1];
            var poFromYear = +poToArray[2] - 1;

            poFromDay = poFromDay.toString().length == 2 ? poFromDay : "0" + poFromDay;

            var poFrom = poFromDay + "-" + poFromMonth + "-" + poFromYear;
            document.querySelectorAll("#LBL_TB_DT_FR")[0].nextElementSibling.value = poFrom;

            document.addEventListener("click", (e) => {
                if (e.target.id == "s_0_7") {
                    var table = LovDiv.querySelectorAll("#_LovTable")[0].querySelectorAll("tbody")[0];
                    var lastRow = table.lastChild.cloneNode(true);
                    table.prepend(lastRow);
                }
                if (
                    e.target.id == "s_0_40" ||
                    e.target.id == "s_0_49" ||
                    e.target.id == "s_0_50" ||
                    e.target.id == "s_0_51" ||
                    e.target.id == "s_0_52"
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

                        var poNo = poRow.children[1].innerText.split(" ")[0];
                        var poSerial = poRow.children[5].innerText;
                        var purchaseType = poNo.substring(8, 9) == "2" ? "GM" : "TN";

                        var td2 = document.createElement("td");
                        var link = document.createElement("a");
                        var linkText = document.createTextNode("Check");
                        link.appendChild(linkText);
                        link.title = "Check Bill Status";
                        link.href =
                            "https://ireps.gov.in/iMMS/caseHistoryBillPOPopUp?poNumber=" +
                            poNo +
                            "&poSr=" +
                            poSerial +
                            "&rly=10&purType=" +
                            purchaseType;
                        link.target = "_blank";
                        td2.appendChild(link);
                        td2.setAttribute("align", "right");
                        poRow.appendChild(td2);
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

            let poLinking = () => {
                var s_6 = body.querySelectorAll("#s_6")[0];
                var maList = s_6.querySelectorAll("[id^=TrMAList_]");
                var maNum = maList.length;

                for (i = 0; i < maList.length; i++) {

                    var maRow = maList[i];
                    var poNo = maRow.children[5].innerText;
                    var poYear = "20" + poNo.substring(2, 4);
                    var poZone = currentZone;

                    var link = document.createElement("a");
                    var linkText = document.createTextNode(poNo);
                    link.appendChild(linkText);
                    link.title = poNo;
                    var url = "https://ireps.gov.in/ireps/etender/pdfdocs/MMIS/PO/" +
                        poYear +
                        "/" +
                        zoneJson[poZone] +
                        "/" +
                        poNo +
                        ".pdf";
                    link.href = url;
                    link.target = "_blank";
                    maRow.children[5].innerText = "";
                    maRow.children[5].appendChild(link);

                }

                var maNumP = document.createElement("h3");
                var maNumText = document.createTextNode("PO Modification Requests Pending : " + maNum);
                maNumP.appendChild(maNumText);
                maList[0].closest("div").insertBefore(maNumP, maList[0].closest("div").children[0]);
            }

            poLinking();
            document.addEventListener("click", (e) => {
                if (e.target.name == "btn_Refresh_0") {
                    poLinking();
                }
            });

            var maKeyInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_34")[0];
            maKeyInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_54")[0].focus();

                }
            });
        }

        if (
            document.title == "Purchase Order Generation" ||
            document.title == "Run Form - IMMIS/PUR/ORDER" ||
            document.title == "Run Form - IMMIS/PUR/ORDERGEN"
        ) {
            body.classList.add("po_generation");

            var poKeyInput = document.querySelectorAll("#s_3")[0].querySelectorAll("#s_0_147")[0];
            poKeyInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_27")[0].focus();

                }
            });
        }

        if (document.title == "Publish Tender Document" || document.title == "Run Form - IMMIS/PUR/TENDERNEW") {
            body.classList.add("tender_publishing");
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

                    var button = document.createElement("button");
                    var buttonText = document.createTextNode("Demand Review");
                    button.setAttribute("id", "SHOW_DR");
                    button.appendChild(buttonText);
                    button.style.marginRight = "17px";
                    divShowHtml1.querySelectorAll("table")[0].querySelectorAll("tr")[0].querySelectorAll("td")[1].insertBefore(button, divShowHtml1.querySelectorAll("table")[0].querySelectorAll("tr")[0].querySelectorAll("td")[1].firstChild);
                }

                if (e.target.id == "SHOW_DR") {

                    var plHeader = divShowHtml1.querySelectorAll("div")[1].children[0];
                    var depotDetails = divShowHtml1.querySelectorAll("div")[1].children[1];
                    var uncoveredDuesDetails = divShowHtml1.querySelectorAll("div")[1].children[4];
                    var coveredDuesDetails = divShowHtml1.querySelectorAll("div")[1].children[6];

                    var plNo = plHeader.querySelectorAll("tr")[2].children[0].innerText;
                    var purchaseSection = plHeader.querySelectorAll("tr")[2].children[4].innerText;
                    var cpMonth = plHeader.querySelectorAll("tr")[2].children[6].innerText;
                    var nature = plHeader.querySelectorAll("tr")[2].children[8].innerText;
                    var category = plHeader.querySelectorAll("tr")[2].children[9].innerText;
                    var itemDescription = plHeader.querySelectorAll("tr")[3].children[0].innerText;

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
            plInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_15")[0].focus();

                }
            });
        }

        if (document.title == "Purchase Proposal" || document.title == "Run Form - IMMIS/PUR/PURPROP") {
            body.classList.add("purchase_proposal");

            var ppInput = document.querySelectorAll("#s_3")[0].querySelectorAll("#s_0_111")[0];
            ppInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {

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
            var s__cnvs4 = document.querySelectorAll("#s__cnvs3")[0];

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
        }

        if (document.title == "Vendor Performance" || document.title == "Run Form - IMMIS/PUR/VENDPOS") {
            body.classList.add("vendor_performance");
            var vendorNameInput = document.querySelectorAll("input[name='VNAME_0']")[0];

            document.addEventListener("click", (e) => {
                if (e.target.name == "btn_Show_0") {
                    var s_2 = document.querySelectorAll("#s_2")[0];
                    var table = s_2.querySelectorAll("tbody")[0];

                    if (!e.target.closest("tr").nextSibling) {
                        var tr1 = document.createElement("tr");
                        var td1 = document.createElement("td");
                        var text1 = document.createTextNode("Total Orders");
                        td1.appendChild(text1);
                        var td2 = document.createElement("td");
                        tr1.appendChild(td1);
                        tr1.appendChild(td2);
                        table.appendChild(tr1);

                        var tr2 = document.createElement("tr");
                        var td3 = document.createElement("td");
                        var text2 = document.createTextNode("Partly Supplied");
                        td3.appendChild(text2);
                        var td4 = document.createElement("td");
                        tr2.appendChild(td3);
                        tr2.appendChild(td4);
                        table.appendChild(tr2);

                        var tr3 = document.createElement("tr");
                        var td5 = document.createElement("td");
                        var text3 = document.createTextNode("Fully Supplied");
                        td5.appendChild(text3);
                        var td6 = document.createElement("td");
                        tr3.appendChild(td5);
                        tr3.appendChild(td6);
                        table.appendChild(tr3);
                    }

                    var numTotalPO = 0;
                    var numPCPO = 0;
                    var numFCPO = 0;

                    var poQty = 0;
                    var cancelledQty = 0;
                    var suppliedQty = 0;

                    var s_3 = document.querySelectorAll("#s_3")[0];
                    var rows =
                        s_3.children[2].children[0].children[1].querySelectorAll("table")[1].children[0].children;

                    for (var i = 1; i < rows.length; i = i + 2) {
                        var row = rows[i];
                        numTotalPO++;

                        if (row.children.length == 9) {
                            poQty = row.children[3].innerText.split(" ")[0];
                            cancelledQty = row.children[4].innerText == "-" ? 0 : row.children[4].innerText;
                            suppliedQty = row.children[5].innerText == "-" ? 0 : row.children[5].innerText;

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
                            suppliedQty = row.children[4].innerText == "-" ? 0 : row.children[4].innerText;
                        }

                        if (+suppliedQty > 0 && +suppliedQty < 0.95 * +poQty) {
                            numPCPO++;
                        }

                        if (+suppliedQty >= 0.95 * +poQty) {
                            numFCPO++;
                        }
                    }

                    e.target.closest("tr").nextElementSibling.querySelectorAll("td")[1].innerText = numTotalPO;
                    e.target.closest("tr").nextElementSibling.nextElementSibling.querySelectorAll("td")[1].innerText =
                        numPCPO;
                    e.target
                        .closest("tr")
                        .nextElementSibling.nextElementSibling.nextElementSibling.querySelectorAll("td")[1].innerText =
                        numFCPO;
                }
            });

            vendorNameInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {
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
                            row2.children[7].remove();
                            row2.children[5].remove();
                            row2.children[3].remove();
                            row2.children[1].remove();

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
                            var thText2 = document.createTextNode("Consumption LY");
                            th2.appendChild(thText2);
                            rowTh.parentElement.insertBefore(th2, rowTh);

                            var th3 = document.createElement("th");
                            var thText3 = document.createTextNode("Consumption CY");
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
                                var dueQtyArray = row6.children[1].innerText.split("\n");
                                var dpArray = row6.children[2].innerText.split("\n");

                                for (var n = 0; n < depotArray.length; n++) {

                                    var tr = document.createElement("tr");

                                    var td1 = document.createElement("td");
                                    var tdText1 = document.createTextNode(depotArray[n]);
                                    td1.appendChild(tdText1);
                                    tr.appendChild(td1);

                                    var td2 = document.createElement("td");
                                    var tdText2 = document.createTextNode(dueQtyArray[n]);
                                    td2.appendChild(tdText2);
                                    tr.appendChild(td2);

                                    var td3 = document.createElement("td");
                                    var tdText3 = document.createTextNode(dpArray[n]);
                                    td3.appendChild(tdText3);
                                    tr.appendChild(td3);

                                    var td4 = document.createElement("td");
                                    var tdText4 = document.createTextNode(row6.children[3].innerText);
                                    td4.appendChild(tdText4);
                                    tr.appendChild(td4);

                                    row6.parentElement.insertBefore(tr, row6);

                                    if (n == depotArray.length - 1) {
                                        row6.remove();
                                    }

                                }

                            }

                        }
                    }

                }
            }

            for (var p = 0; p < table5Rows.length; p++) {
                var row5 = table5Rows[p];

                if (row5.querySelectorAll("th")[4] && row5.querySelectorAll("th")[4].innerText == "Consumption CY") {

                    var table6 = row5.querySelectorAll("table")[0];
                    var table6Rows = table6.querySelectorAll("tbody")[0].children;
                    var cummulativeConsumptionCY = 0;
                    var cummulativeConsumptionLY = 0;

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

                        if (q == 0) {

                            var th1 = document.createElement("th");
                            var thText1 = document.createTextNode("Coverage");
                            th1.appendChild(thText1);
                            row6.appendChild(th1);
                            var th2 = document.createElement("th");
                            var thText2 = document.createTextNode("Remarks");
                            th2.appendChild(thText2);
                            row6.appendChild(th2);

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
                            row6.appendChild(td0);

                            var coverageTable = row5.nextElementSibling.querySelectorAll("table")[0];
                            var coverageRows = coverageTable.querySelectorAll("tbody")[0].children;

                            for (var r = 2; r < coverageRows.length; r++) {
                                var coverageDepot = coverageRows[r].children[0].innerText;
                                var coverageQty = coverageRows[r].children[1].innerText;
                                var coverageDP = coverageRows[r].children[2].innerText;
                                var coveragePO = coverageRows[r].children[3].innerText;
                                var coveragePOPrev = coverageRows[r - 1].children[3].innerText;
                                var coveragePONo = coveragePO.substring(9, 23);
                                var coveragePOPrevNo = coveragePOPrev.substring(9, 23);

                                if (coveragePO.substring(17, 18) != 8 && coveragePONo != coveragePOPrevNo) {
                                    var tr1 = document.createElement("tr");
                                    var td1 = document.createElement("td");
                                    var tdText1 = document.createTextNode(coveragePO);
                                    var tdText2 = document.createTextNode(coverageDepot + ": " + coverageQty + "; DP: " + coverageDP);
                                    var br = document.createElement("br");
                                    td1.style.border = "1px solid black";
                                    td1.appendChild(tdText1);
                                    td1.appendChild(br);
                                    td1.appendChild(tdText2);
                                    tr1.appendChild(td1);
                                    row6.lastChild.children[0].children[0].appendChild(tr1);

                                }
                                if (coveragePO.substring(17, 18) != 8 && coveragePO === coveragePOPrev) {
                                    var tdText1 = document.createTextNode(coverageDepot + ": " + coverageQty + "; DP: " + coverageDP);
                                    var br = document.createElement("br");
                                    var tdNum = row6.lastChild.children[0].querySelectorAll("td").length;
                                    row6.lastChild.children[0].querySelectorAll("td")[tdNum - 1].appendChild(br);
                                    row6.lastChild.children[0].querySelectorAll("td")[tdNum - 1].appendChild(tdText1);
                                }
                            }

                            row5.nextElementSibling.style.display = "none";

                            var uncoveredDuesTable = row5.children[1].querySelectorAll("table")[0];
                            var uncoveredRows = uncoveredDuesTable.querySelectorAll("tbody")[0].children;
                            var uncoveredTenderNoArray = [];

                            if (uncoveredRows.length > 1) {
                                for (var r = 1; r < uncoveredRows.length; r++) {
                                    var uncoveredDepotArray = uncoveredRows[r].children[0].innerText.split("\n");
                                    var uncoveredQtyArray = uncoveredRows[r].children[1].innerText.split("\n");
                                    var uncoveredTender = uncoveredRows[r].children[2].innerText;
                                    var uncoveredTenderNo = uncoveredTender.split(" ")[1].substring(0, 8);

                                    if (uncoveredTender.startsWith("T/No.") && !uncoveredTenderNoArray.includes(uncoveredTenderNo)) {
                                        uncoveredTenderNoArray.push(uncoveredTenderNo);

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
                                        tr1.appendChild(td1);
                                        row6.lastChild.children[0].children[0].appendChild(tr1);

                                    }

                                }

                            }

                            var td1 = document.createElement("td");
                            td1.setAttribute("rowspan", table6Rows.length - 3);
                            row6.appendChild(td1);

                            uncoveredDuesTable.style.display = "none";
                            row5.children[0].setAttribute("width", "100%");
                            row5.previousElementSibling.querySelectorAll("td")[0].style.border = "1px solid black";
                            row5.previousElementSibling.querySelectorAll("td")[0].setAttribute("bgcolor", "lightYellow");
                            row5.previousElementSibling.querySelectorAll("td")[0].setAttribute("colspan", "1");

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
                        }
                    }
                }
            }
        }

        if (document.title == "Manage List Groups for Reports" || document.title == "Run Form - IMMIS/LISTGROUPS") {
            body.classList.add("manage_list");

            var plInput = document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_44")[0];
            plInput.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {

                    document.querySelectorAll("#s_2")[0].querySelectorAll("#s_0_53")[0].focus();

                }
            });
        }

    },
    false
);