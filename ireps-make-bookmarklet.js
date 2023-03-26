javascript: (() => {
	var href = window.location.href;
	var url = new URL(href);
	var tabulationId = url.searchParams.get("nitOId");

	var req = new XMLHttpRequest();
	req.open("GET", "https://ireps.gov.in/epsn/supply/bid/techBidSupplyTabulation.do?oid=" + tabulationId, false);
	req.send(null);

	if (req.status == 200) {
		var parser = new DOMParser();
		var document = parser.parseFromString(req.responseText, "text/html");
		var tenderNo = document
			.querySelectorAll("tbody")[0]
			.children[4].querySelectorAll("tr")[1]
			.querySelectorAll("td")[1].innerText;
		var makeDetails = document
			.querySelectorAll("tbody")[0]
			.lastElementChild.querySelectorAll("td")[0]
			.querySelectorAll(":scope > table")[51]
			.querySelectorAll("tbody")[0].children;
		let make = [];

		for (var i = 1; i < makeDetails.length; i++) {
			var item = makeDetails[i];
			var pl = item.querySelectorAll("td")[0].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
			var offeredMakes = item.querySelectorAll("tbody")[0].children;

			var itemMake = {};
			itemMake.pl = pl;
			itemMake.offers = [];

			for (var j = 0; j < makeDetails.length; j++) {
				var offeredMake = offeredMakes[j];

				var itemMakeOffered = {};
				var firm = offeredMake.querySelectorAll("td")[0].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
				var firmMake = offeredMake
					.querySelectorAll("td")[1]
					.innerText.trim()
					.replace(/\n/g, "")
					.replace(/\t/g, "");
				var firmName = firm.split("[")[0].trim();
				var firmId = firm.split("[")[1].split("]")[0];

				itemMakeOffered.firmName = firmName;
				itemMakeOffered.firmId = firmId;
				itemMakeOffered.make = firmMake;

				itemMake.offers.push(itemMakeOffered);
			}

			make.push(itemMake);
		}

		window.console.log(make);
	}
})();
