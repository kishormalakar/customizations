javascript: (() => {
    var href = window.location.href;
    var url = new URL(href);
    var tabulationId = url.searchParams.get("nitOId");

    var req = new XMLHttpRequest();
    req.open("GET", "https://ireps.gov.in/epsn/supply/bid/techBidSupplyTabulation.do?oid=" + tabulationId, false);
    req.send(null);

    if (req.status == 200) {
        var parser = new DOMParser();
        var technoCommercialTabulation = parser.parseFromString(req.responseText, "text/html");
        var tenderNo = technoCommercialTabulation
            .querySelectorAll("tbody")[0]
            .children[4].querySelectorAll("tr")[1]
            .querySelectorAll("td")[1].innerText;
        var conditionTables = technoCommercialTabulation
            .querySelectorAll("tbody")[0]
            .lastElementChild.querySelectorAll("td")[0]
            .querySelectorAll(":scope > table");
        var makeArray = [];
        var firmContactsArray = [];
        for (var k = 0; k < conditionTables.length; k++) {
            if (conditionTables[k].querySelectorAll("td")[0].innerText.trim() == "Make Brand") {
                makeArray = conditionTables[k + 1].querySelectorAll("tbody")[0].children;
            }

            if (conditionTables[k].querySelectorAll("td")[0].innerText.trim() == "Digital Certificates Used") {
                firmContactsArray = conditionTables[k + 1].querySelectorAll("tbody")[0].children;
            }
        }

        let makes = [];

        for (var i = 1; i < makeArray.length; i++) {
            var item = makeArray[i];
            var pl = item.querySelectorAll("td")[0].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
            var offeredMakes =
                item.querySelectorAll("td")[1].children.length != 0 ? item.querySelectorAll("tbody")[0].children : [];

            var itemMake = {};
            itemMake.pl = pl;
            itemMake.offers = [];

            for (var j = 0; j < offeredMakes.length; j++) {
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

            makes.push(itemMake);

        }

        let firmContacts = [];

        for (var i = 1; i < firmContactsArray.length; i++) {
            var firm = firmContactsArray[i];
            var firmName = firm.querySelectorAll("td")[0].querySelectorAll("a")[0].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");
            var firmContact = firm.querySelectorAll("td")[1].innerText.trim().replace(/\n/g, "").replace(/\t/g, "");

            firmContacts.push({ "firmName": firmName, "firmContact": firmContact });

        }

        var tncDivs = document.querySelectorAll("[id^=othTNCDiv]");

        tncDivs.forEach((tncDiv) => {
            var tncDivId = tncDiv.id.substring(9);

            var bidderDetailsDivId = "bidderDetailDiv" + tncDivId;
            var bidderDetailsHeader = tncDiv.parentElement.querySelectorAll("#" + bidderDetailsDivId)[0];
            var bidderAccount = bidderDetailsHeader.querySelectorAll("[id^=bidderAcctName]")[0].innerText;
            var bidderId = bidderAccount.split("[Bid Id : ")[1].split("]")[0];
            var bidderName = bidderAccount.split("[Bid Id : ")[0].split(",")[0];
            var bidderIndustryFormLink = bidderDetailsHeader.querySelectorAll("a")[0];
            bidderIndustryFormUrl = "https://ireps.gov.in/epsn/jsp/supply/tds/firmMSEDetailsPage.jsp?bidId=" + tncDivId + "&tabulationId=" + tabulationId;

            var plConsigneeArray = [];
            var consignee, consigneeTrimmed;
            var recommendationDivs = tncDiv.parentElement.querySelectorAll("div[id^=reccOf]");
            recommendationDivs.forEach((recommendationDiv) => {

                var recommendationDivId = recommendationDiv.id.slice(-8);
                if (recommendationDivId == tncDivId) {

                    consignee = recommendationDiv.querySelectorAll("tr")[4].querySelectorAll("span")[0].innerText;
                    consigneeTrimmed = consignee.split(",")[0].trim();

                    var recommendationDivRows = recommendationDiv.querySelectorAll("tr");

                    for (var i = 0; i < recommendationDivRows.length; i += 5) {
                        var pl = recommendationDivRows[i].querySelectorAll("b")[0].innerText;
                        var plConsignee = recommendationDivRows[i + 4].querySelectorAll("span")[0].innerText;

                        plConsigneeArray.push([pl, plConsignee]);
                    }

                }

            });

            var inspectionDivs = tncDiv.parentElement.querySelectorAll("[id^=inspTNCDiv]");

            inspectionDivs.forEach(inspectionDiv => {
                var inspectionRows = inspectionDiv.querySelectorAll("table")[1].querySelectorAll("tbody")[0].children;

                for (var j = 1; j < inspectionRows.length; j++) {
                    var pl = inspectionRows[j].children[0].querySelectorAll("span")[0].innerText;
                    var plInspection = inspectionRows[j].children[1].querySelectorAll("select")[0].value;

                    if (plInspection == 10) {
                        plConsigneeArray.forEach((plConsignee) => {

                            if (plConsignee[0] == pl) {
                                inspectionRows[j].children[2].querySelectorAll("input")[0].value = plConsignee[1];
                            }
                        });
                    }

                    if (plInspection == 50) {
                        inspectionRows[j].children[2].querySelectorAll("input")[0].value = "At manufacturer's premises";
                    }
                }
            });

            var securityMoney = tncDiv.querySelectorAll("[id^=securityMoney]")[0];
            var modeOfDispatch = tncDiv.querySelectorAll("[id^=modeOfDispatch]")[0];
            var svc = tncDiv.querySelectorAll("textarea[id^=othrTNC]")[0];
            var svcLabel = svc.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var sgc = tncDiv.querySelectorAll("table")[2].querySelectorAll("textarea")[0];

            securityMoney.value = "Not Applicable";
            modeOfDispatch.value = "By Rail/Road";
            svc.value = "Applicable";
            svcLabel.value = 3;
            sgc.value =
                "This tender and the contract/purchase order placed against this tender shall be governed by all the terms and conditions mentioned in the schedule of tender, IRS conditions of contract (latest version), Integrated Bid Document (IBD) of ECR and the documents attached with this tender.";
            sgc.style.height = sgc.scrollHeight;

            var addButton = svc.parentElement.nextElementSibling.querySelectorAll("a")[1];
            addButton.click();
            var remarks = tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var remarksLabel = remarks.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var remarksType = remarks.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];

            remarks.value =
                "1. Inspection by consignee or authorized representative of consignee. \n2. The firm shall provide products with drug standards printed such as IP/USP/BP/EURO/PHARMACOPOEIA standards at the time of supply to hospital stores.\n3. Each strip/packet/bottle that contains the tendered item should have a printing/stamping with indelible ink of Indian Railways - Not for sale. Firms are advised to put their hologram on their products/cartons also.\n4. The remaining shelf life of the offered product should not be less than 80% of total shelf life or it should not be older than 06 months from the date of manufacture (whichever is more) at the time of supply.";
            remarks.style.height = remarks.scrollHeight;
            remarksLabel.value = 1;
            remarksType.value = "Remarks";
            remarksType.style.display = "block";

            var contactsArray = [];
            contactsArray = [
                ["SSE/E/DHN", "SSE/E/DHN", 9771426318, "dk505832@gmail.com", "Office of the Sr. Section Engineer (Electrical), Dhanbad, Old Station Power House, Dhanbad, Jharkhand, 826001", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["SSE/C&W/CSRS/DHN", "SSE/CSRS/DHN", 9771445149, "iahmad.grd@gmail.com", "Office of Sr. Section Engineer (C&W), Central Stores (CSRS), Near Vivekanand Bhawan Old Station Area, East Central Railway,  Dhanbad, Jharkhand, 826001", "DME/C&W/DHN", 9771426402, "dmecw123@gmail.com"],
                ["C.S.I./STORE/DHN", "SSE/SIGNAL/ STORE/DHN", 9771426172, "ssesigstoredhn@gmail.com", "Office of Sr. Section Engineer (Signal), Near DRM Office, Dhanbad, Jharkhand, 826001", "DSTE/SIGNAL", 9771426801, "sandeep.ies.@gov.in"],
                ["SSE/E/GMO", "SSE/E/GMO", 9771426370, "ajaykumarsseph9771@gmail.com", "Office of Sr.Section Engineer(Electric), Near Girls School, Gomoh, Dhanbad, Jharkhand, 828401", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["A.T.F/R.SHED/GMO", "CHIEF CREW CONTROLLER GOMOH", 9771445285, "scpandey6@gmail.com", "Office of the Chief Crew Controller, New Shed, Gomoh, Dhanbad, Jharkhand", "DEE/OP/DHN", 9771426309, "saourabh.rathour@gov.in"],
                ["Sr.DOM/DHN", "OS/TRAFFIC/STORE", 9771445750, "pk801374@gmail.com", "Traffic store, DRM Office, Dhanbad, Jharkhand, 826001", "AOM", 9771426906, "shishirkumar.2203@gov.in"],
                ["D.EN/I/DHN", "PWI/TD/DHN", 9771426240, "dhnssetd@gmail.com", "Office of PWI/TD/DHN, Engineering Store, Near DRM Office, Dhanbad, Jharkhand, 826001", "Sr. DEN/1/DHN", 9771426203, "hansraj.0107@gov.in"],
                ["COMOFF/10BN/RPSF/DHN", "ASC/RPSF/DHN", 9771426725, "surendrapratapmishra3@gmail.com", "10 Battalion RPSF, Near Railway Hospital, Hill colony, Dhanbad, Jharkhand, 826001", "ASC/RPSF/DHN", 9771426725, "surendrapratapmishra3@gmail.com"],
                ["SSE/TRD/S&W/ECR/DHN", "SSE/TRD/S&W/ECR/DHN", 9771426583, "srsetrddhn@gmail.com", "Office of SSE/TRD/S&W/DHN, Near Gaya Bridge, Rangatand, Dhanbad, Jharkhand, 826001", "DEE/TRD/DHN", 9771426304, "uttam.maiti@gov.in"],
                ["Sr.DSC/DHN", "IPF/DQM", 9771426717, "dhn.dqm@gmail.com", "Office of RPF Divisional Store Dhanbad, Near Dhanbad Railway Station, Dhanbad, Jharkhand, 826001", "ASC/DHN", 9771426701, "ascrpfecrdhn@gmail.com"],
                ["J.E./TELE-1/G/DHN", "SSE/TELE/STORE/DHN", 9771445859, "prakashkrmandalecr@gmail.com", "Office of SSE/TELE/Store, DRM Office, Dhanbad, Jharkhand, 826001", "DSTE/TELE/DHN", 9771426807, "rajeev.ext.bit@gmail.com"],
                ["SSE/E/PTRU", "SSE/E/PTRU", 7002551224, "pranabkumar.1304@gov.in", "Office of the Sr. Section Engineer (Electrical), Patratu, Ramgarh, Jharkhand, 829118", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["SSE/E/CPU", "SSE/E/CPU", 9794849694, "chandankumar.0779@gov.in", "Office of the Sr. Section Engineer (Electrical), Chopan, Sonebhadra,  UP, 231205", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["SSE/E/PEH", "SSE/E/PEH", 9771468627, "malmin.7008@gov.in", "Office of the Sr. Section Engineer (Electrical), Pathardih (PEH), Loco Bazar Power House, Jharkhand, 828119", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["P.W.I./T.D/DHN", "SSE/TD/DHN", 9771426240, "dhnssetd@gmail.com", "Office of the Sr. Section Engineer (PWI), Track Depot, Near Gaya Bridge, Dhanbad, Jharkhand, 826001", "DEN/HQ/DHN", 7781016676, "ram.071964@gov.in"],
                ["I.O.W-I/DHN", "SSE/W-I/DHN", 9794849684, "sshankar2008@gmail.com", "Office of the Sr. Section Engineer (Works-I), IOW-1, Near Dhanbad Rly. Station, Dhanbad, Jharkhand, 826001", "DEN/HQ/DHN", 7781016676, "ram.071964@gov.in"],
                ["I.O.W-II/DHN", "SSE/W-II/DHN", 9771426234, "sunilpnc71@gmail.com", "Office of the Sr. Section Engineer (Works-II), (IOW-2), Dhanbad, Jharkhand, 826001", "DEN/HQ/DHN", 7781016676, "ram.071964@gov.in"],
                ["SSE/E/BRKA", "SSE/E/BRKA", 9771426373, "jaywantlakra1@gmail.com", "Office of Sr. Section Engineer (Electrical), Barkakana, Ramgarh, Jharkhand, 829102", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["SSE/TRS/GMO", "SSE/TRS/GMO", 7004190621, "akhilesh.1411@gov.in", "Office of the Sr. Section Engineer (TRS), Gomoh, Jharkhand, 828401 ", "DEE/TRS", 9771426307, "sudhakar.kumar01@gov.in"],
                ["SSE/S/W/DHN", "SSE/S/W/DHN", 9771425829, "bislamecr4570@gmail.com", "Office of the Sr. Section Engineer/Signal/Works. Under Dy. CSTE/Works/DHN, 2nd Floor, DRM Office, Dhanbad, Jharkhand, 826001", "Dy.CSTE/Works/DHN", 9771426806, "rajnishkumar.0806@gov.in"],
                ["Sr.DEE/DHN", "SSE/E/DHN", 9771426318, "dilip.0172@gov.in", "Office of the Sr. Section Engineer (Electrical),Power House, Near Bharat Petroleum Depot, Dhanbad, Jharkhand, 826001", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["Sr.SE/D/PTRU", "CMS/PTRU", 9771445158, "elsptru@gmail.com", "Office of the Sr. Section Engineer (Store), Diesel Loco Shed, Patratu, Jharkhand, 829118", "DEE/TRS/PTRU", 9771445153, "amit.191993@gov.in"],
                ["Sr.DPO/DHN", "OS/Personnel", 9771445166, "gautam3tiwary@gmail.com", "Office of Sr. DPO, Inside DRM Office, Dhanbad, Jharkhand, 826001", "DPO/DHN", 9771426625, "nirajk.2612@gov.in"],
                ["Sr.DCM/DHN", "Ch.OS/Commercial", 9771445925, "dhiraj.4444ravi@gmail.com", "Office of Sr. DCM, Inside DRM Office, Dhanbad, Jharkhand, 826001", "ACM/DHN", 9771426953, "acm2dhn@gmail.com"],
                ["C.A.SUPDT/DHN", "Coal Area Superintendent", 7091092303, "rajuneha365@gmail.com", "Coal Area Superintendent, Office of Coal Area Manager, DRM Office, Dhanbad, Jharkhand, 826001", "CAM/DHN", 9771426905, "camecrdhn@gmail.com"],
                ["DMO/DHN", "OS/CMS/DHN/ECR", 9771445938, "vivekkumar.2507@gov.in", "Office of the Chief Medical Superintendent, Divisional Railway Hospital, Near RPSF Camp, Dhanbad, Jharkhand, 826001", "CMS/DHN/ECR", 9771426500, "deepankar.chaurasia@gov.in"],
                ["SSE/SIG/CON/DHN", "SSE/SIGNAL/CON/DHN", 9771463875, "jan90cpr@gmail.com", "Office of the Sr. Section Engineer (Signal/Construction), Under Dy. CSTE/Con/DHN, Near VIP Siding, Dhanbad, Jharkhand, 826001", "ASTE/DHN", 9771460855, "amitkumar1102@gmail.com"],
                ["SSE/Elect/SGRL", "SSE/E/SGRL", 9794849690, "maheshprasad.2604@gov.in", "Office of the Sr. Section Engineer (Electrical), Singrauli, Sidhi, Madhya Pradhesh, 486889", "AEE/G/DHN", 9771426308, "abhishek.0812@gov.in"],
                ["SSE/TL & AC/DHN", "SSE/TL&AC/DHN", 9771426320, "ssetlacdhn@gmail.com", "Office of the Sr. Section Engineer, TL & AC, Coaching Depot, Old Station, Dhanbad, Jharkhand, 826001", "DME/C&W/DHN", 9771426402, "dmecw123@gmail.com"],
                ["DFM/DHN", "Sr. SO/Accounts", 9771426143, "ravi.1601@gov.in", "Office of Sr. DFM, Inside DRM Office, Dhanbad, Jharkhand, 826001", "DFM/DHN", 9771426101, "santoshkumar.3009@gov.in"],
                ["DRH/ECR/Dhanbad", "Pharmacist/DRH/DHN", 8797955536, "rabindra.7514@gov.in", "Divisional Railway Hospital, Near RPSF Camp, Dhanbad, Jharkhand, 826001", "Sr. DMO", 9771426504, "jayanti.kashyap83@gov.in"],
                ["ROH/BRWD", "CDMS/Receipt/BRWD", 7858800977, "cdmsbrwd@gmail.com", "Store Depot Barwadih, Near Barwadih Railway Station, Latehar, Jharkhand, 822111", "ADFM/1/DHN", 9771426103, "naustopno.2502@gov.in"],
                ["Divisional Store Depot Dhanbad", "DMS/Receipt/DHN", 7542022562, "dmssunilrai@gmail.com", "Divisional Store Depot Dhanbad, Near Dhanbad Railway Station (VIP Siding), Jharkhand, 826001", "ADFM/1/DHN", 9771426103, "naustopno.2502@gov.in"],
                ["SSE/TELE/GS/DHN", "SSE/TELE/GS/DHN", 9771445860, "bikramsum@gmail.com", "Office of Sr. Section Engineer (Telecom - Gati Shakti), Near DRM Office, Dhanbad, Jharkhand, 826001", "Sr. DSTE/GS/DHN", 9771426819, "srdstegsdhn@gmail.com"],
                ["COMOFF/108N/RPSF/DHN", "ASC/RPSF/DHN", 9771426725, "surendrapratapmishra3@gmail.com", "10 Battalion RPSF, Near Railway Hospital, Hill colony, Dhanbad, Jharkhand, 826001", "ASC/RPSF/DHN", 9771426725, "surendrapratapmishra3@gmail.com"],
                ["DEN/1/ECR/DHN", "SSE/PW/COMP/DHN", 9123252811, "pankajkantigupta64@gmail.com", "Office of SSE/PW/COMP/DHN, Engineering Store, Near DRM Office, Dhanbad, Jharkhand, 826001", "Sr. DEN/3/DHN", 9771426204, "sden3dhnireps@gmail.com"],
                ["DSL/PTRU", "CDMS/Receipt/PTRU", 8340274149, "", "Stores Depot, Diesel Loco Shed Patratu, Patratu, Jharkhand, 829118", "ADFM/1/DHN", 9771426103, "naustopno.2502@gov.in"],
                ["", "", "", "", "", "", "", ""]
            ];

            addButton.click();
            var contactDetails =
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[2] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var contactDetailsLabel = contactDetails.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var contactDetailsType =
                contactDetails.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];
            var contactDetailsString = "";

            contactsArray.forEach((contact) => {
                if (contact[0] == consigneeTrimmed) {
                    contactDetailsString = "For dispatch of material and receipt/acceptance related issues:";
                    contactDetailsString += " " + contact[1];
                    contactDetailsString += "; Phone No: +91-" + contact[2];
                    contactDetailsString += "; Email: " + contact[3];
                    contactDetailsString += "; Address: " + contact[4];
                    contactDetailsString += "; For payment related issues:";
                    contactDetailsString += " " + contact[5];
                    contactDetailsString += "; Phone No: +91-" + contact[6];
                    contactDetailsString += "; Email: " + contact[7];
                }
            });

            contactDetails.value = contactDetailsString;
            contactDetails.style.height = contactDetails.scrollHeight;
            contactDetailsLabel.value = 1;
            contactDetailsType.value = "Consignee Details:";
            contactDetailsType.style.display = "block";

            addButton.click();
            var makeDetails =
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[3] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[2] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var makeDetailsLabel = makeDetails.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var makeDetailsType =
                makeDetails.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];
            var makeDetailsString = "";

            plConsigneeArray.forEach((plConsignee) => {
                if (makeDetailsString != "") {
                    makeDetailsString += ";\n";
                }

                makes.forEach((make) => {
                    if (make.pl == plConsignee[0]) {
                        make.offers.forEach((makeOffered) => {
                            if (makeOffered.firmId == bidderId) {
                                makeDetailsString += "For " + plConsignee[0] + ": " + makeOffered.make;
                            }
                        });
                    }
                });
            });

            makeDetails.value = makeDetailsString;
            makeDetails.style.height = makeDetails.scrollHeight;
            makeDetailsLabel.value = 1;
            makeDetailsType.value = "Make/Brand:";
            makeDetailsType.style.display = "block";

            addButton.click();
            var poModificationDetails =
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[4] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[3] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[2] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var poModificationLabel =
                poModificationDetails.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var poModificationType =
                poModificationDetails.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];

            poModificationDetails.value =
                "Firm should carefully examine the purchase order and immediately inform the purchaser in case of any corrections. Firm should raise PO Modification/Amendment requests in IREPS only. Requests received through other means shall not be entertained.";
            poModificationDetails.style.height = poModificationDetails.scrollHeight;
            poModificationLabel.value = 1;
            poModificationType.value = "Amendment Request:";
            poModificationType.style.display = "block";

            addButton.click();
            var gstDetails =
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[5] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[4] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[3] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[2] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var gstDetailsLabel = gstDetails.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var gstDetailsType = gstDetails.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];

            gstDetails.value =
                "Bihar: 10AAAGM0289C1ZY; Jharkhand: 20AAAGM0289C1ZX; UP: 09AAAGM0289C1ZH; MP: 23AAAGM0289C1ZR";
            gstDetails.style.height = gstDetails.scrollHeight;
            gstDetailsLabel.value = 1;
            gstDetailsType.value = "GSTIN:";
            gstDetailsType.style.display = "block";

            addButton.click();
            var dispatchDetails =
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[6] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[5] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[4] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[3] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[2] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var dispatchDetailsLabel = dispatchDetails.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var dispatchDetailsType = dispatchDetails.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];

            dispatchDetails.value =
                "Firm should submit dispatch details in IREPS Portal and should generate e-Dispatch Note for the same.";
            dispatchDetails.style.height = dispatchDetails.scrollHeight;
            dispatchDetailsLabel.value = 1;
            dispatchDetailsType.value = "Dispatch Details:";
            dispatchDetailsType.style.display = "block";

            addButton.click();
            var firmContactDetails =
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[7] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[6] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[5] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[4] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[3] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[2] ||
                tncDiv.querySelectorAll("textarea[id^=othrTNC]")[1];
            var firmContactDetailsLabel = firmContactDetails.parentElement.previousElementSibling.querySelectorAll("select")[0];
            var firmContactDetailsType = firmContactDetails.parentElement.previousElementSibling.querySelectorAll("input[id^=custom]")[0];

            firmContacts.forEach(firmContact2 => {
                if (firmContact2.firmName == bidderName) {
                    firmContactDetails.value = firmContact2.firmContact;
                }
            });

            firmContactDetails.style.height = firmContactDetails.scrollHeight;
            firmContactDetailsLabel.value = 1;
            firmContactDetailsType.value = "Firm's Contact:";
            firmContactDetailsType.style.display = "block";
        });
    }
})();
