// ==UserScript==
// @name         IMMIS
// @namespace    http://tampermonkey.net/
// @version      1.0.9
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

		if (document.title == "Search Purchase Orders" || document.title == "Run Form - IMMIS/PUR/POSEARCH") {
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

		var canvasHolder = document.querySelectorAll("#CanvassHolder")[0];
		var body = document.querySelectorAll("body")[0];

		if (document.title == "Depot Transfer Transactions" || document.title == "Run Form - IMMIS/DEP/DTBT") {
			canvasHolder.classList.add("depot_transfer");
		}

		if (document.title == "Availability Status of Items" || document.title == "Run Form - IMMIS/DEP/AVAILSTAT") {
			canvasHolder.classList.add("availability");
		}

		if (document.title == "Review / Act on Pending Demands" || document.title == "Run Form - IMMIS/PUR/DEMREVIEW") {
			canvasHolder.classList.add("review_process_demand");

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
			canvasHolder.classList.add("gem_po_mapping");
		}

		if (document.title == "Demand Registration (Non-Stock)" || document.title == "Run Form - IMMIS/PUR/DMDREGNS") {
			document.addEventListener("click", (e) => {
				if (e.target.title == "Return this Demand") {
					var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;
					var s_2 = document.querySelectorAll("#s_2")[0];
					var s__cnvs3 = document.querySelectorAll("#s__cnvs3")[0];
					scrollTop += 150;

					s__cnvs3.style.top = scrollTop + "px";
				}
			});
		}

		if (document.title == "PO Modification" || document.title == "Run Form - IMMIS/PUR/POMA") {
			canvasHolder.classList.add("po_modification");
		}

		if (document.title == "Purchase Order Generation" || document.title == "Run Form - IMMIS/PUR/ORDER") {
			canvasHolder.classList.add("po_generation");
		}

		if (document.title == "Publish Tender Document" || document.title == "Run Form - IMMIS/PUR/TENDERNEW") {
			canvasHolder.classList.add("tender_publishing");
		}

		if (
			document.title == "Coverage Status of Non-Stock Demands" ||
			document.title == "Run Form - IMMIS/PUR/NSDMDSTAT"
		) {
			canvasHolder.classList.add("ns_demand_status");
		}

		if (
			document.title == "Coverage Status of stock Demands" ||
			document.title == "Run Form - IMMIS/PUR/STKDMDSTAT"
		) {
			canvasHolder.classList.add("ns_demand_status");
		}

		if (document.title == "Position of Items" || document.title == "Run Form - IMMIS/PUR/ITEMPOS") {
			canvasHolder.classList.add("item_position");
			var consigneeArray = [
				"C&W/SUPDT/OBRADAM",
				"H.TXR/PATRATU",
				"Sr.SE/C&W/IC/PEH",
				"CWS/BOXN/ROH/BRWD",
				"SRSE/CS/RS/DHN",
			];

			document.addEventListener("click", (e) => {
				if (e.target.closest("div") !== null && e.target.closest("div").id == "section_udm") {
					var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];
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

		if (document.title == "DRR Status Update" || document.title == "Run Form - IMMIS/DEP/DRRDEL") {
			body.classList.add("drop_drr");
		}

		if (document.title == "Vendor Performance" || document.title == "Run Form - IMMIS/PUR/VENDPOS") {
			canvasHolder.classList.add("vendor_performance");

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
	},
	false
);
