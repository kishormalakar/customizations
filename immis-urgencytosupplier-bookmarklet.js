javascript: (() => {
	var po = prompt("Purchase Order No").trim();
	var depot = prompt("Depot").trim();

	var divShowHtml1 = document.querySelectorAll("#divShowHtml1")[0];
	var divShowHtml1Tables = divShowHtml1.children[1].children;
	var coveredDuesTable;
	var ordersTable;
	var poString;
	var dueQtyArray = [];
	var dueDateArray = [];

	for (var i = 0; i < divShowHtml1Tables.length; i++) {
		var table = divShowHtml1Tables[i];
		if (table.querySelectorAll("td")[0].innerText == "COVERED DUES DETAILS") {
			coveredDuesTable = table;
		}
		if (table.querySelectorAll("td")[0].innerText == "ORDERS PLACED DURING LAST 3 YEARS") {
			ordersTable = table;
		}
	}

	for (var j = 2; j < coveredDuesTable.querySelectorAll("tbody")[0].children.length; j++) {
		coveredDuesRow = coveredDuesTable.querySelectorAll("tbody")[0].children[j];

		if (coveredDuesRow.children.length == 10) {
			poString = coveredDuesRow.children[0].innerText.trim();

			if (coveredDuesRow.children[2].innerText == depot) {
				dueQtyArray.push(coveredDuesRow.children[5].innerText);
				dueDateArray.push(coveredDuesRow.children[7].innerText);
			}

			for (var k = 1; k < 20; k++) {
				if (coveredDuesTable.querySelectorAll("tbody")[0].children[j + k].children.length == 10) {
					break;
				} else {
					if (coveredDuesTable.querySelectorAll("tbody")[0].children[j + k].children[1].innerText == depot) {
						dueQtyArray.push(
							coveredDuesTable.querySelectorAll("tbody")[0].children[j + k].children[5].innerText
						);
						dueDateArray.push(
							coveredDuesTable.querySelectorAll("tbody")[0].children[j + k].children[7].innerText
						);
					}
				}
			}
		}
	}

	window.console.log(poString);
	window.console.log(dueQtyArray);
	window.console.log(dueDateArray);
})();
