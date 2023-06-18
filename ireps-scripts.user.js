// ==UserScript==
// @name         IREPS
// @namespace    http://tampermonkey.net/
// @version      1.0.1
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
	},
	false
);
