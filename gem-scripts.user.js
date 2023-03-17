// ==UserScript==
// @name         GeM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.gem.gov.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	var pathname = location.pathname;

	if (pathname.startsWith("/finance")) {
		document.addEventListener("focusout", (e) => {
			if (e.target.parentElement.classList.contains("search_contract")) {
				var searchContract = document.querySelectorAll(".search_contract")[0];
				var contract = searchContract.querySelectorAll("input")[0].value;
				searchContract.querySelectorAll("input")[0].value = contract.split(" ").join("");
			}
		});
	}

	if (pathname.endsWith("/checkouts/payment_method_new")) {
		var form = document.querySelectorAll("#proceed-to-checkout")[0];

		var adminApproval = form.querySelectorAll("#pi_details_designation_admin_approval")[0];
		var financeApproval = form.querySelectorAll("#pi_details_designation_finance_approval")[0];

		adminApproval.addEventListener("focusout", (e) => {
			financeApproval.value = adminApproval.value;
		});

		var gstConsignee = form.querySelectorAll("#pi_details_gst_invoice_owner_consignee")[0];
		gstConsignee.checked = true;
		var tdsIT = form.querySelectorAll("#pi_details_tds_details_in_checkout_deducted_under_income_tax")[0];
		tdsIT.checked = false;
		var accountingUnit = form.querySelectorAll("#accounting-unit-dropdown")[0];
		accountingUnit.value = 3003;
		var accountingUnitConfirm = form.querySelectorAll("#accounting-unit-confirm-dropdown")[0];
		accountingUnitConfirm.value = 3003;
	}

	if (pathname.startsWith("/buyer-bid-tech-finance-evaluation/")) {
		document.addEventListener("click", (e) => {
			if (e.target.classList.contains("mse_prefer_allow") && e.target.value == 1) {
				document.querySelectorAll("textarea#comment_msepp")[0].value =
					"Verified as Eligible for MSE Purchase Preference/Reservation";
			}

			if (e.target.classList.contains("mse_prefer_allow") && e.target.value == 0) {
				document.querySelectorAll("textarea#comment_msepp")[0].value =
					"Verified as Not Eligible for MSE Purchase Preference/Reservation";
			}
		});
	}

	if (pathname.endsWith("/view_contracts")) {
		document.addEventListener("focusout", (e) => {
			if (e.target.parentElement.id == "bno") {
				var contract = document.querySelectorAll("#bno")[0];
				var contractValue = contract.value;
				contract.value = contractValue.trim().split(" ").join("");
			}
		});
	}
})();
