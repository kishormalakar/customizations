// ==UserScript==
// @name         IMMIS
// @namespace    http://tampermonkey.net/
// @version      1.0.12
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

		var canvasHolder = document.querySelectorAll("#CanvassHolder")[0];
		var body = document.querySelectorAll("body")[0];

		let setRelativePositioning = () => {
			var childElements = canvasHolder.children;
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

		setRelativePositioning();

		document.addEventListener("click", (e) => {
			setRelativePositioning();
		});

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
					var lov = document.querySelectorAll("#LovDiv")[0];

					lov.style.top = +scrollTop + +e.clientY + "px";
					lov.style.left = e.clientX + "px";
				}
			});
		}

		if (document.title == "PO Modification" || document.title == "Run Form - IMMIS/PUR/POMA") {
			canvasHolder.classList.add("po_modification");
		}

		if (
			document.title == "Purchase Order Generation" ||
			document.title == "Run Form - IMMIS/PUR/ORDER" ||
			document.title == "Run Form - IMMIS/PUR/ORDERGEN"
		) {
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

			document.addEventListener("keydown", (e) => {
				if (e.key === "Escape") {
					document.querySelectorAll("#divShowHtml1")[0].style.display = "none";
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

				if (e.target.value == "AAC") {
					var s_3 = document.querySelectorAll("#s_3")[0];

					scrollTop += 150;

					s_3.style.cssText =
						"top: " +
						scrollTop +
						"px !important; border: 2px solid black; padding: 5px; background-color: #66ffff;";
				}
				if (e.target.value == "Save/Forward/Authorize") {
					var DivAlertBox = document.querySelectorAll("#DivAlertBox")[0];

					scrollTop += 150;

					DivAlertBox.style.cssText =
						"top: " +
						scrollTop +
						"px !important; border: 2px solid black; padding: 5px; background-color: #66ffff; z-index: 99; position: absolute;";
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
					alert("sdss");
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
