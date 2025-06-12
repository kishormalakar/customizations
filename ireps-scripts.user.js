// ==UserScript==
// @name         IREPS
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/epsn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener(
	"load",
	function () {
		var pathname = location.pathname;

		if (pathname.startsWith("/epsn/supply/bid/techBidSupplyTabulation.do")) {
			var technoCommercialTabulation = document.querySelectorAll("table")[0].children[0];

			var conditionTables = technoCommercialTabulation.querySelectorAll("td")[1].querySelectorAll("tbody")[0].lastElementChild.children[0].querySelectorAll(":scope > table");
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
					conditionTables[i].setAttribute("id", "table-make");
				}

				if (conditionTables[i].querySelectorAll("td")[0].innerText.trim() == "GST Jurisdictional Assessing Officer Details") {
					jurisdictionalOfficerTable = conditionTables[i + 1].querySelectorAll("tbody")[0].children;
				}

				if (conditionTables[i].querySelectorAll("td")[0].innerText.trim() == "Deviations") {
					conditionTables[i].setAttribute("id", "table-deviations");
				}

				if (conditionTables[i].querySelectorAll("td")[0].innerText.trim() == "Commercial Compliance") {
					conditionTables[i].setAttribute("id", "table-commercialcompliance");
				}
			}

			industryTable = technoCommercialTabulation.querySelectorAll("#oiDiv")[0].querySelectorAll("table")[1].querySelectorAll("tbody")[0].children;
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
						jurisdictionalOfficerTable[0].parentElement.insertBefore(cloneNode, jurisdictionalOfficerTable[k + 1]);
					}
				}

				for (var n = 1; n < industryTable.length; n++) {
					if (industryTable[n].children[0].innerText.trim() == firmName) {
						cloneNode = industryTable[n];
						industryTable[0].parentElement.insertBefore(cloneNode, industryTable[k + 1]);
					}
				}
			}

			var leftSidebar = technoCommercialTabulation.children[0].children[0];
			var mainContent = technoCommercialTabulation.children[0].children[1];
			var rightSidebar = technoCommercialTabulation.children[0].children[2];

			leftSidebar.style.width = "50px";
			mainContent.style.width = "1024px";
			rightSidebar.style.width = "300px";

			var sidebarDiv = document.createElement("div");
			sidebarDiv.classList.add("sidebar-div");
			sidebarDiv.style.cssText = "position: fixed; top: 100px; display: flex; flex-direction: column";
			var a1 = document.createElement("a");
			var a1Text = document.createTextNode("Local Content");
			a1.appendChild(a1Text);
			a1.setAttribute("href", "#table-commercialcompliance");
			var a2 = document.createElement("a");
			var a2Text = document.createTextNode("Deviations");
			a2.appendChild(a2Text);
			a2.setAttribute("href", "#table-deviations");
			var a3 = document.createElement("a");
			var a3Text = document.createTextNode("Make/brand");
			a3.appendChild(a3Text);
			a3.setAttribute("href", "#table-make");
			var a4 = document.createElement("a");
			var a4Text = document.createTextNode("Industry Type");
			a4.appendChild(a4Text);
			a4.setAttribute("href", "#oiDiv");
			sidebarDiv.appendChild(a1);
			sidebarDiv.appendChild(a2);
			sidebarDiv.appendChild(a3);
			sidebarDiv.appendChild(a4);
			rightSidebar.appendChild(sidebarDiv);
		}

		if (pathname.startsWith("/epsn/jsp/supply/tds/firmMSEDetailsPage.jsp")) {
			var industryDropdown = document.querySelectorAll("tbody")[0].children[5].querySelectorAll("select#indsType")[0];
			var industryDropdownOptions = industryDropdown.children;
			var mseTypeDropdown = document.querySelectorAll("tbody")[0].children[5].querySelectorAll("select#mseType")[0];
			var mseTypeDropdownOptions = mseTypeDropdown.children;

			industryDropdown.addEventListener("change", () => {
				if (industryDropdown.value == "1") {
					mseTypeDropdown.value = "8";
				}

				document.querySelectorAll("tbody")[0].children[5].querySelectorAll("input[name='scsttype']")[2].checked = true;
				document.querySelectorAll("tbody")[0].children[5].querySelectorAll("input[name='wYN']")[1].checked = true;
			});

			var tabulationId = window.opener.document.querySelectorAll("input#oid")[0].value;
			var bidderName = document.querySelectorAll("tbody")[0].children[2].querySelectorAll("tr")[0].children[1].innerText.trim().split(" (")[0];

			var req = new XMLHttpRequest();
			req.open("GET", "https://ireps.gov.in/epsn/supply/bid/techBidSupplyTabulation.do?oid=" + tabulationId, false);
			req.send(null);

			if (req.status == 200) {
				var parser = new DOMParser();
				var technoCommercialTabulation = parser.parseFromString(req.responseText, "text/html");

				var tod = technoCommercialTabulation.querySelectorAll("body")[0].querySelectorAll("table")[1].querySelectorAll("tbody")[0].children[2].querySelectorAll("tr")[0].children[3].innerText.trim().split(" ")[0].substring(2).replaceAll("/", "");

				var industryTable = technoCommercialTabulation.querySelectorAll("#oiDiv")[0].querySelectorAll("table")[1].querySelectorAll("tbody")[0].children;
				for (var x = 1; x < industryTable.length; x++) {
					if (industryTable[x].children.length == 1) {
						industryTable[x].remove();
					}
				}

				for (var n = 1; n < industryTable.length; n++) {
					var firmName = industryTable[n].children[0].innerText.trim().split(" [")[0];

					if (firmName == bidderName) {
						cloneNode = industryTable[n];

						var technoCommercialScript = technoCommercialTabulation.querySelectorAll("body")[0].querySelectorAll("script")[0];
						//document.querySelectorAll("head")[0].appendChild(technoCommercialScript);

						var mseDocumentLink = cloneNode.children[2].querySelectorAll("a")[0];
						var mseDocumentParams = mseDocumentLink.getAttribute("onclick").toString().trim().split("(")[1].split(")")[0];
						var bidId = mseDocumentParams.split(",")[0].split("'")[1].split("'")[0];
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
				} else {
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
			var text7 = document.createTextNode(numTotalOrders + " ( " + Math.round((numTotalOrders / numTotalTenders) * 100) + "% )");
			var td8 = document.createElement("td");
			var text8 = document.createTextNode(numTotalRetenders + " ( " + Math.round((numTotalRetenders / numTotalTenders) * 100) + "% )");
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

		if (pathname.startsWith("/epsn/buyerInboxLink.do")) {
			if (confirm("Do you want to display additional details?") == true) {
				var buyerInboxLinkForm = document.querySelectorAll("form[name='buyerInboxLinkForm']")[0];

				buyerInboxLinkForm.parentElement.setAttribute("width", "80%");
				buyerInboxLinkForm.parentElement.previousElementSibling.setAttribute("width", "10%");
				buyerInboxLinkForm.parentElement.nextElementSibling.setAttribute("width", "10%");

				var tenderTable = buyerInboxLinkForm.querySelectorAll(".nit_summary")[0];
				var tenderList = tenderTable.children[0].children;

				var headerRow = tenderList[0];
				var td = document.createElement("td");
				var strong = document.createElement("strong");
				var strongText = document.createTextNode("Value");
				strong.appendChild(strongText);
				td.appendChild(strong);
				td.style.cssText = headerRow.children[4].cssText;
				td.style.textAlign = "center";
				headerRow.insertBefore(td, headerRow.children[5]);

				for (var i = 1; i < tenderList.length; i++) {
					var tenderRow = tenderList[i];

					var actionsContainer = tenderRow.lastChild.previousElementSibling.previousElementSibling;
					var finTabLink = actionsContainer.children[2];
					var commTabLink = actionsContainer.children[3];

					var finTabUrl = finTabLink.getAttribute("onclick").split("('/epsn/")[1].split("',")[0];
					var commTabUrl = commTabLink.getAttribute("onclick").split("('/epsn/")[1].split("',")[0];

					finTabLink.setAttribute("href", finTabUrl);
					finTabLink.setAttribute("target", "_blank");
					finTabLink.removeAttribute("onclick");
					commTabLink.setAttribute("href", commTabUrl);
					commTabLink.setAttribute("target", "_blank");
					commTabLink.removeAttribute("onclick");

					var todText = tenderRow.children[4].innerText;
					var tod = new Date(+todText.split(" ")[0].split("/")[2], +todText.split(" ")[0].split("/")[1] - 1, +todText.split(" ")[0].split("/")[0]);
					tod.setHours(11);
					var today = new Date();
					var numDays = Math.round((today - tod) / (1000 * 60 * 60 * 24));

					var br = document.createElement("br");
					var span = document.createElement("span");
					var spanText = document.createTextNode(numDays + " days");
					span.appendChild(spanText);
					if (numDays >= 12) {
						span.style.color = "red";
						span.style.fontWeight = "bold";
					}
					if (numDays >= 10) {
						span.style.color = "red";
					}
					tenderRow.children[4].appendChild(br);
					tenderRow.children[4].appendChild(span);

					var req = new XMLHttpRequest();
					req.open("GET", "https://ireps.gov.in/epsn/" + finTabUrl, false);
					req.send(null);

					if (req.status == 200) {
						var parser = new DOMParser();
						var financialTabulation = parser.parseFromString(req.responseText, "text/html");
						var tenderValue = financialTabulation.querySelectorAll("#schForm")[0].querySelectorAll("tr")[4].children[3].innerText;

						var td = document.createElement("td");
						var span = document.createElement("span");
						var spanText = document.createTextNode(new Intl.NumberFormat("en-IN").format(Math.round(+tenderValue)));
						span.appendChild(spanText);
						td.appendChild(span);
						td.style.textAlign = "right";
						td.style.verticalAlign = "top";
						if (+tenderValue > 5000000) {
							td.style.color = "red";
						}
						tenderRow.insertBefore(td, tenderRow.children[5]);
					}
				}
			}
		}

		if (pathname.startsWith("/epsn/jsp/supply/tds/tdDiscussionPopup.jsp")) {
			var selectFirm = document.querySelectorAll("select#bidId")[0];
			var tabulationId = window.opener.document.querySelectorAll("input#oid")[0].value;

			var makeArray = [];
			var makes = [];
			var accountsArray = [];
			var localContentArray = [];

			var req = new XMLHttpRequest();
			req.open("GET", "https://ireps.gov.in/epsn/supply/bid/techBidSupplyTabulation.do?oid=" + tabulationId, false);
			req.send(null);

			if (req.status == 200) {
				var parser = new DOMParser();
				var technoCommercialTabulation = parser.parseFromString(req.responseText, "text/html");

				var conditionTables = technoCommercialTabulation.querySelectorAll("tbody")[1].lastElementChild.querySelectorAll("td")[0].querySelectorAll(":scope > table");

				for (var k = 0; k < conditionTables.length; k++) {
					if (conditionTables[k].querySelectorAll("td")[0].innerText.trim() == "Make Brand") {
						makeArray = conditionTables[k + 1].querySelectorAll("tbody")[0].children;
					}
					if (conditionTables[k].querySelectorAll("td")[1] != null && conditionTables[k].querySelectorAll("td")[1].innerText.trim().startsWith("Please enter the percentage of local content")) {
						localContentArray.push(conditionTables[k + 1].querySelectorAll("tbody")[0].children);
					}
				}

				for (var i = 1; i < makeArray.length; i++) {
					var item = makeArray[i];
					var pl = item.querySelectorAll("td")[0].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
					var offeredMakes = item.querySelectorAll("td")[1].children.length != 0 ? item.querySelectorAll("tbody")[0].children : [];

					var itemMake = {};
					itemMake.pl = pl;
					itemMake.offers = [];

					for (var j = 0; j < offeredMakes.length; j++) {
						var offeredMake = offeredMakes[j];

						var itemMakeOffered = {};
						var firm = offeredMake.querySelectorAll("td")[0].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
						var firmMake = offeredMake.querySelectorAll("td")[1].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
						var firmName = firm.split("[")[0].trim();
						var firmId = firm.split("[")[1].split("]")[0];
						var accountId = offeredMake.querySelectorAll("td")[0].querySelectorAll("a")[0].getAttribute("onclick").split("accId=")[1].split("',")[0];

						itemMakeOffered.firmName = firmName;
						itemMakeOffered.firmId = firmId;
						itemMakeOffered.make = firmMake;

						itemMake.offers.push(itemMakeOffered);
						accountsArray.push([firmId, accountId]);
					}

					makes.push(itemMake);
				}
			}

			selectFirm.addEventListener("change", (e) => {
				var firmId = e.target.value;
				var makeDetailsString = "";
				var offerDetailsDiv = document.querySelectorAll("table#tcdaCase")[0].querySelectorAll("#devDtls")[0];

				if (document.querySelectorAll(".additional-details")[0]) {
					document.querySelectorAll(".additional-details")[0].remove();
				}

				var additionalDetailsDiv = document.createElement("div");
				additionalDetailsDiv.classList.add("additional-details");
				additionalDetailsDiv.style.cssText = "width: 95%; margin: 5px; margin-top: 10px";
				var b = document.createElement("b");
				var bText = document.createTextNode("Offered Make/brand");
				b.appendChild(bText);
				additionalDetailsDiv.appendChild(b);

				makes.forEach((make) => {
					make.offers.forEach((makeOffered) => {
						if (makeOffered.firmId == firmId) {
							makeDetailsString += "For " + make.pl + ": " + makeOffered.make;
							var br = document.createElement("br");
							var span2 = document.createElement("span");
							var span2Text = document.createTextNode(makeDetailsString);
							span2.appendChild(br);
							span2.appendChild(span2Text);
							additionalDetailsDiv.appendChild(span2);
						}
					});
				});

				var br = document.createElement("br");
				var b = document.createElement("b");
				var bText = document.createTextNode("Local Content Declaration");
				b.appendChild(bText);
				b.style.marginTop = "10px";
				b.style.display = "block";
				additionalDetailsDiv.appendChild(br);
				additionalDetailsDiv.appendChild(b);
				additionalDetailsDiv.appendChild(localContentArray[0][0].cloneNode(true));

				localContentArray.forEach((localContent) => {
					Array.from(localContent).forEach((localContentByFirm) => {
						if (localContentByFirm.children[0].innerText.indexOf("[") != -1 && localContentByFirm.children[0].innerText.split("[")[1].split("]")[0] == firmId) {
							additionalDetailsDiv.appendChild(localContentByFirm.cloneNode(true));
						}
					});
				});

				var accountId = "";
				accountsArray.forEach((account) => {
					if (account[0] == firmId) {
						accountId = account[1];
					}
				});

				var req2 = new XMLHttpRequest();
				req2.open("GET", "https://ireps.gov.in/epsn/tbo/downloaddocs.do?tenderOID=" + tabulationId + "&accountID=" + accountId + "&bid_id=" + firmId, false);
				req2.send(null);

				if (req2.status == 200) {
					var parser2 = new DOMParser();
					var documentsBody = parser2.parseFromString(req2.responseText, "text/html");
					var documentsTable = documentsBody.querySelectorAll("table")[1].cloneNode(true);
					documentsTable.style.width = "100%";
					documentsTable.style.marginTop = "10px";
					var innerTables = documentsTable.querySelectorAll("table");

					for (var i = 0; i < innerTables.length; i++) {
						innerTables[i].style.marginLeft = "0px";
					}

					var downloadAllButton = documentsTable.querySelectorAll("input[value='Download All Pdfs']")[0];
					var openAllButton = downloadAllButton.cloneNode(true);
					openAllButton.value = "Open All PDFs";

					openAllButton.onclick = () => {
						var list = downloadAllButton.closest("tbody").querySelectorAll("a");

						for (var i = 0; i < list.length; i++) {
							list[i].click();
						}
					};

					downloadAllButton.parentElement.appendChild(openAllButton);
					additionalDetailsDiv.appendChild(documentsTable);
				}

				offerDetailsDiv.appendChild(additionalDetailsDiv);
			});
		}

		if (pathname.startsWith("/epsn/reports/shieldCriteriaReport/adequacyOfCoverageOfCurrentData.do")) {
			var adequacyTable = document.querySelectorAll(".lightGrayTbl")[0].children[0].children;

			var th = adequacyTable[0].children[3].cloneNode(true);
			th.innerText = "Adequacy %";
			adequacyTable[0].appendChild(th);

			for (var i = 1; i < adequacyTable.length; i++) {
				var row = adequacyTable[i];
				var adequacyItemCount;
				var inadequacyItemCount;

				if (i == adequacyTable.length - 1) {
					adequacyItemCount = row.children[1].innerText;
					inadequacyItemCount = row.children[2].innerText;
				} else {
					adequacyItemCount = row.children[2].innerText;
					inadequacyItemCount = row.children[3].innerText;
				}

				var adequacyPercentage = Math.round((+adequacyItemCount / (+adequacyItemCount + +inadequacyItemCount)) * 10000, 2) / 100;

				var td = row.children[2].cloneNode(true);
				td.innerText = adequacyPercentage + "%";
				row.appendChild(td);
			}
		}
	},
	false
);
