// ==UserScript==
// @name         IREPS
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://ireps.gov.in/epsn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// ==/UserScript==

window.addEventListener(
	"load",
	function () {
		var pathname = location.pathname;

		if (pathname.startsWith("/epsn/supply/bid/techBidSupplyTabulation.do")) {
			var technoCommercialTabulation = document.querySelectorAll("table")[0].children[0];
			var financialTabulationLink = technoCommercialTabulation.children[0].children[2].querySelectorAll("a")[2];
			var financialTabulationURL = financialTabulationLink.getAttribute("onclick");
			window.console.log(financialTabulationURL);

			// var req = new XMLHttpRequest();
			// req.open(
			// 	"GET",
			// 	"https://ireps.gov.in/epsn/supply/bid/techBidSupplyTabulation.do?oid=" + tabulationId,
			// 	false
			// );
			// req.send(null);

			// if (req.status == 200) {
			// 	var parser = new DOMParser();
			// 	var financialTabulation = parser.parseFromString(req.responseText, "text/html");
			// }
		}
	},
	false
);
