// ==UserScript==
// @name         IMMIS
// @namespace    http://tampermonkey.net/
// @version      1.0.2
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

		if (document.title == "Search Purchase Orders") {
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

		if (document.title == "Depot Transfer Transactions") {
			canvasHolder.classList.add("depot_transfer");
		}

		if (document.title == "Availability Status of Items") {
			canvasHolder.classList.add("availability");
		}

		if (document.title == "Review / Act on Pending Demands") {
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

		if (document.title == "IMMIS Proposal GeM PO Mapping") {
			canvasHolder.classList.add("gem_po_mapping");
		}

		if (document.title == "Run Form - IMMIS/PUR/DMDREGNS") {
			document.addEventListener("click", (e) => {
				if (e.target.title == "Return this Demand") {
					var scrollTop = window.pageYOffset || e.target.scrollTop || document.body.scrollTop;
					var s_2 = document.querySelectorAll("#s_2")[0];
					var s__cnvs3 = document.querySelectorAll("#s__cnvs3")[0];

					s_2.style.top = scrollTop + "px";
					s__cnvs3.style.top = scrollTop + "px";
				}
			});
		}
	},
	false
);
