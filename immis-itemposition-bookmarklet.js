javascript: (() => {
	var pl = 90701057;
	var rlyCode = 10;
	var depotCode = 43;
	var depotName = "ROH/BRWD";
	var output = {};

	var req = new XMLHttpRequest();
	req.open("GET", "https://ireps.gov.in/iMMS/depot/itempos/gethistsheet?rly=" + rlyCode + "&plno=" + pl, false);
	req.send(null);

	if (req.status == 200) {
		var parser = new DOMParser();
		var document = parser.parseFromString(req.responseText, "text/html");
		output.pl = document.querySelectorAll("table")[0].querySelectorAll("tr")[2].querySelectorAll("td")[0].innerText;
		output.purchaseSection = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[2]
			.querySelectorAll("td")[4].innerText;
		output.cp = document.querySelectorAll("table")[0].querySelectorAll("tr")[2].querySelectorAll("td")[6].innerText;
		output.srs = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[2]
			.querySelectorAll("td")[7].innerText;
		output.safety = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[2]
			.querySelectorAll("td")[8].innerText;
		output.category = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[2]
			.querySelectorAll("td")[9].innerText;
		output.passengerNecessity = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[2]
			.querySelectorAll("td")[10].innerText;
		output.mustChange = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[2]
			.querySelectorAll("td")[11].innerText;
		output.itemDescription = document
			.querySelectorAll("table")[0]
			.querySelectorAll("tr")[3]
			.querySelectorAll("td")[0].innerText;

		var stockRows = document.querySelectorAll("table")[1].querySelectorAll("tbody")[0].querySelectorAll("tr");
		var row;
		var rowChildren;
		output.stock = [];

		for (var i = 3; i < stockRows.length - 1; i++) {
			row = stockRows[i];
			var stockJson = {};

			stockJson.depotCode = row.querySelectorAll("td")[0].innerText.trim();
			stockJson.depotName = row.querySelectorAll("td")[1].innerText;
			stockJson.aac = row.querySelectorAll("td")[9].innerHTML.split("<br>")[0];
			stockJson.stock = row.querySelectorAll("td")[10].innerHTML.split("<br>")[0];
			stockJson.stockMonths = row.querySelectorAll("td")[10].innerHTML.split("<br>")[1];
			stockJson.lastIssue = row.querySelectorAll("td")[12].innerHTML.split("<br>")[0];
			stockJson.lastReceipt = row.querySelectorAll("td")[12].innerHTML.split("<br>")[1];
			stockJson.bar = row.querySelectorAll("td")[13].innerHTML.split("<br>")[0];
			stockJson.stockingUnit = row.querySelectorAll("td")[13].innerHTML.split("<br>")[1];

			output.stock.push(stockJson);
		}

		var uncoveredDuesRows = document
			.querySelectorAll("table")[2]
			.querySelectorAll("tbody")[0]
			.querySelectorAll("tr");
		output.uncoveredDues = [];

		for (i = 2; i < uncoveredDuesRows.length; i++) {
			row = uncoveredDuesRows[i];
			var uncoveredDuesJson = {};

			uncoveredDuesJson.depotCode = row.querySelectorAll("td")[0].innerText.trim();
			uncoveredDuesJson.depotName = row.querySelectorAll("td")[1].innerText.trim();
			uncoveredDuesJson.demandNo = row.querySelectorAll("td")[2].innerText.trim();
			uncoveredDuesJson.demandDate = row.querySelectorAll("td")[3].innerText.trim();
			uncoveredDuesJson.demandQty = row.querySelectorAll("td")[4].innerText.trim();
			uncoveredDuesJson.demandType = row.querySelectorAll("td")[6].innerText.trim();

			output.uncoveredDues.push(uncoveredDuesJson);
		}

		var coveredDuesRows = document.querySelectorAll("table")[4].querySelectorAll("tbody")[0].querySelectorAll("tr");
		output.coveredDues = [];

		for (i = 2; i < coveredDuesRows.length; i++) {
			row = coveredDuesRows[i];
			var coveredDuesJson = {};
			var poString;

			rowChildren = row.querySelectorAll(":scope > td").length;
			if (rowChildren == 10) {
				poString = row.querySelectorAll("td")[0].innerText.trim();
				coveredDuesJson.poNo = poString.substring(7, 21);
				coveredDuesJson.poDate = poString.substring(25, 37);
				coveredDuesJson.firm = poString.substring(poString.indexOf("M/s."), poString.indexOf("RITES"));
				coveredDuesJson.poSrNo = row.querySelectorAll("td")[1].innerText.trim();
				coveredDuesJson.depotName = row.querySelectorAll("td")[2].innerText.trim();
				coveredDuesJson.rate = row.querySelectorAll("td")[3].innerText.trim();
				coveredDuesJson.poQty = row.querySelectorAll("td")[4].innerText.trim();
				coveredDuesJson.unit = row.querySelectorAll("td")[5].innerText.trim();
				coveredDuesJson.dueQty = row.querySelectorAll("td")[6].innerText.trim();
				coveredDuesJson.dpStart = row.querySelectorAll("td")[7].innerText.trim();
				coveredDuesJson.dpEnd = row.querySelectorAll("td")[8].innerText.trim();
				coveredDuesJson.demandNo = row.querySelectorAll("td")[9].innerText.trim();
			} else if (rowChildren == 9) {
				poString = coveredDuesRows[i - 1].querySelectorAll("td")[0].innerText.trim();
				coveredDuesJson.poNo = poString.substring(7, 21);
				coveredDuesJson.poDate = poString.substring(25, 37);
				coveredDuesJson.firm = poString.substring(poString.indexOf("M/s."), poString.indexOf("RITES"));
				coveredDuesJson.poSrNo = row.querySelectorAll("td")[0].innerText.trim();
				coveredDuesJson.depotName = row.querySelectorAll("td")[1].innerText.trim();
				coveredDuesJson.rate = row.querySelectorAll("td")[2].innerText.trim();
				coveredDuesJson.poQty = row.querySelectorAll("td")[3].innerText.trim();
				coveredDuesJson.unit = row.querySelectorAll("td")[4].innerText.trim();
				coveredDuesJson.dueQty = row.querySelectorAll("td")[5].innerText.trim();
				coveredDuesJson.dpStart = row.querySelectorAll("td")[6].innerText.trim();
				coveredDuesJson.dpEnd = row.querySelectorAll("td")[7].innerText.trim();
				coveredDuesJson.demandNo = row.querySelectorAll("td")[8].innerText.trim();
			}

			output.coveredDues.push(coveredDuesJson);
		}

		window.console.log(output);
	}
})();
