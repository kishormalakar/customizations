// ==UserScript==
// @name         IMMIS
// @namespace    http://tampermonkey.net/
// @version      1.0.16
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/fcgi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

window.addEventListener(
	"load",
	function () {
		if (document.title.startsWith("Run Form - ")) {
			var titleBar = document.querySelectorAll("#TitleBar")[0];
			var title = titleBar.querySelectorAll("td")[1].innerText;
			document.title = title;
			titleBar.style.width = "100%";
		}

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

		if (document.title != "System Start Page") {
			setRelativePositioning();

			document.addEventListener("click", (e) => {
				setRelativePositioning();
			});
		}

		if (document.title == "Search Purchase Orders" || document.title == "Run Form - IMMIS/PUR/POSEARCH") {
			body.classList.add("po_search");

			var rlyName = document.querySelectorAll('input[name="RLYNM_0"]')[0];
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

					LovDiv.scrollIntoView({block: "end", inline: "nearest"});
				}
			});
		}

		if (document.title == "PO Modification" || document.title == "Run Form - IMMIS/PUR/POMA") {
			body.classList.add("po_modification");
		}

		if (
			document.title == "Purchase Order Generation" ||
			document.title == "Run Form - IMMIS/PUR/ORDER" ||
			document.title == "Run Form - IMMIS/PUR/ORDERGEN"
		) {
			body.classList.add("po_generation");
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
		}

		if (document.title == "Purchase Proposal" || document.title == "Run Form - IMMIS/PUR/PURPROP") {
			body.classList.add("purchase_proposal");
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
		}

		if (document.title == "RR/Challan/DRR Registration" || document.title == "Run Form - IMMIS/DEP/DRR") {
			body.classList.add("drr_registration");
		}
	},
	false
);
