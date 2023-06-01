javascript: (() => {
	var aac = prompt("Revised AAC");
	var regex = /^\d+(\.\d{1,20})?$/;

	window.console.log(aac);
	window.console.log(regex.test(aac));

	if (regex.test(aac)) {
		var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];

		var bar = divShowHtml1.children[1].querySelectorAll("table")[3].querySelectorAll("tbody")[0].children[3]
			.children[2].innerText;
		var aac1 = divShowHtml1.children[1].querySelectorAll("table")[3].querySelectorAll("tbody")[0].children[3]
			.children[15];
		var aac2 = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[1]
			.children[1];
		var ip_requirement = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0]
			.children[1].children[2];
		var cp_requirement = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0]
			.children[1].children[3];
		var bp_requirement = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0]
			.children[1].children[4];

		var ip_months = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[0]
			.children[2].innerText;
		var cp_months = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[0]
			.children[3].innerText;
		var bp_months = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[0]
			.children[4].innerText;

		var ip_mm = ip_months.substring(ip_months.indexOf("(") + 1, ip_months.indexOf("mths") - 1).trim();
		var cp_mm = cp_months.substring(cp_months.indexOf("(") + 1, cp_months.indexOf("mths") - 1).trim();
		var bp_mm = bp_months.substring(bp_months.indexOf("(") + 1, bp_months.indexOf("mths") - 1).trim();

		aac1.innerText = aac;
		aac2.innerText = aac;

		var ip_requirement_qty = Math.round((parseFloat(aac) / 12) * parseFloat(ip_mm));
		var cp_requirement_qty = Math.round((parseFloat(aac) / 12) * parseFloat(bp_mm));
		var bp_requirement_qty = Math.round((parseFloat(aac) / 12) * parseFloat(cp_mm));

		ip_requirement.innerText = ip_requirement_qty;
		bp_requirement.innerText = cp_requirement_qty;
		cp_requirement.innerText = bp_requirement_qty;

		var stock = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[1]
			.children[5].innerText;
		var cov_dues = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[1]
			.children[6].innerText;
		var uncov_dues = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[1]
			.children[7].innerText;

		var net_requirement = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0]
			.children[1].children[8];
		var net_value = divShowHtml1.children[1].querySelectorAll("table")[4].querySelectorAll("tbody")[0].children[1]
			.children[9];

		var net_requirement_qty = Math.round(
			ip_requirement_qty +
				cp_requirement_qty +
				bp_requirement_qty -
				parseFloat(stock) -
				parseFloat(cov_dues) -
				parseFloat(uncov_dues)
		);
		var net_value_amount = net_requirement_qty * parseFloat(bar);

		net_requirement.innerText = net_requirement_qty;
		net_value.innerText = net_value_amount.toFixed(2);

		var uncoveredDuesTable = divShowHtml1.children[1]
			.querySelectorAll("table")[6]
			.querySelectorAll("tbody")[0].children;
		var prevDemandNumber = "";

		if (uncoveredDuesTable.length > 1) {
			for (var i = 1; i < uncoveredDuesTable.length; i++) {
				var uncoveredDuesRow = uncoveredDuesTable[i];
				var uncoveredDemandNumber = uncoveredDuesRow.children[3].innerText;

				if (uncoveredDemandNumber == prevDemandNumber) {
					uncoveredDuesRow.style.display = "none";
				}
				prevDemandNumber = uncoveredDemandNumber;
			}
		}
	}
})();
