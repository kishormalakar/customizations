javascript: (() => {

	var tncDivs = document.querySelectorAll('[id^=othTNCDiv]');

    tncDivs.forEach(tncDiv => {
        
        var tncHeader = tncDiv.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelectorAll('.tableHdrTnc')[0];
        var consignee = tncHeader.querySelectorAll('tr')[4].querySelectorAll('span')[0].innerText;
        var consigneeTrimmed = consignee.split(",")[0].trim();

        var plConsigneeArray = [];
        var tncHeaderRows = tncHeader.querySelectorAll('tr');

        for (var i = 0; i < tncHeaderRows.length; i += 5){
            var pl = tncHeaderRows[i].querySelectorAll('b')[0].innerText;
            var plConsignee = tncHeaderRows[i + 4].querySelectorAll('span')[0].innerText;
            
            plConsigneeArray.push([pl, plConsignee]);
        }

        var inspectionDiv = tncDiv.previousElementSibling.previousElementSibling.previousElementSibling;
        var inspectionRows = inspectionDiv.querySelectorAll('table')[1].querySelectorAll('tbody')[0].children;

        for (var j = 1; j < inspectionRows.length; j++){
            var pl = inspectionRows[j].children[0].querySelectorAll('span')[0].innerText;
            var plInspection = inspectionRows[j].children[1].querySelectorAll('select')[0].value;

            if (plInspection == 10) {
                plConsigneeArray.forEach((plConsignee) => {
                    if (plConsignee[0] == pl) {
                        inspectionRows[j].children[2].querySelectorAll('input')[0].value = plConsignee[1];
                    }
                })
            }
        }

        var securityMoney = tncDiv.querySelectorAll('[id^=securityMoney]')[0];
        var modeOfDispatch = tncDiv.querySelectorAll('[id^=modeOfDispatch]')[0];
        var svc = tncDiv.querySelectorAll('textarea[id^=othrTNC]')[0];
        var svcLabel = svc.parentElement.previousElementSibling.querySelectorAll('select')[0];
        var sgc = tncDiv.querySelectorAll('table')[2].querySelectorAll('textarea')[0];

        securityMoney.value = "Not Applicable";
        modeOfDispatch.value = "By Rail/Road";
        svc.value = "Applicable";
        svcLabel.value = 3;
        sgc.value = "This tender and the contract/purchase order placed against this tender shall be governed by all the terms and conditions mentioned in the schedule of tender, IRS conditions of contract (latest version), Integrated Bid Document (IBD) of ECR and the documents attached with this tender.";
        
        var addButton = svc.parentElement.nextElementSibling.querySelectorAll('a')[1];
        addButton.click();
        addButton.click();
        var remarks = tncDiv.querySelectorAll('textarea[id^=othrTNC]')[1];
        var remarksLabel = remarks.parentElement.previousElementSibling.querySelectorAll('select')[0];
        var remarksType = remarks.parentElement.previousElementSibling.querySelectorAll('input[id^=custom]')[0];

        remarks.value = "1. Inspection by consignee or authorized representative of consignee. \n2. The firm shall provide products with drug standards printed such as IP/USP/BP/EURO/PHARMACOPOEIA standards at the time of supply to hospital stores.\n3. Each strip/packet/bottle that contains the tendered item should have a printing/stamping with indelible ink of Indian Railways - Not for sale. Firms are advised to put their hologram on their products/cartons also.\n4. The remaining shelf life of the offered product should not be less than 80% of total shelf life or it should not be older than 06 months from the date of manufacture (whichever is more) at the time of supply.";
        remarksLabel.value = 1;
        remarksType.value = "Remarks";
        remarksType.style.display = "block";

        var contactsArray = [];
        contactsArray = [["SSE/E/DHN","SSE/E/DHN",9771426318,"dk505832@gmail.com","Office of the Sr. Section Engineer (Electrical), Dhanbad, Old Station Power House, Dhanbad, Jharkhand, 826001","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["SSE/C&W/CSRS/DHN","SSE/CSRS/DHN",9771445149,"iahmad.grd@gmail.com","Office of Sr. Section Engineer (C&W), Central Stores (CSRS), Near Vivekanand Bhawan Old Station Area, East Central Railway,  Dhanbad, Jharkhand, 826001","DME/C&W/DHN",9771426402,"dmecw123@gmail.com"],["C.S.I./STORE/DHN","SSE/SIGNAL/ STORE/DHN",9771426172,"ssesigstoredhn@gmail.com","Office of Sr. Section Engineer (Signal), Near DRM Office, Dhanbad, Jharkhand, 826001","DSTE/SIGNAL",9771426801,"sandeep.ies.@gov.in"],["SSE/E/GMO","SSE/E/GMO",9771426370,"ajaykumarsseph9771@gmail.com","Office of Sr.Section Engineer(Electric), Near Girls School, Gomoh, Dhanbad, Jharkhand, 828401","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["A.T.F/R.SHED/GMO","CHIEF CREW CONTROLLER GOMOH",9771445285,"scpandey6@gmail.com","Office of the Chief Crew Controller, New Shed, Gomoh, Dhanbad, Jharkhand","DEE/OP/DHN",9771426309,"saourabh.rathour@gov.in"],["Sr.DOM/DHN","OS/TRAFFIC/STORE",9771445750,"pk801374@gmail.com","Traffc store, DRM Office, Dhanbad, Jharkhand, 826001","AOM",9771426906,"shishirkumar.2203@gov.in"],["D.EN/I/DHN","PWI/TD/DHN",9771426240,"dhnssetd@gmail.com","Office of PWI/TD/DHN, Engineering Store, Near DRM Office, Dhanbad, Jharkhand, 826001","Sr. DEN/1/DHN",9771426203,"hansraj.0107@gov.in"],["COMOFF/10BN/RPSF/DHN","COMOFF/10BN/RPSF/DHN",9771426724,"surendrapratapmishra3@gmail.com","10 Battalion RPSF, Near Railway Hospital, Hill colony, Dhanbad, Jharkhand, 826001","COMOFF/10BN/RPSF/DHN",9771426724,"surendrapratapmishra3@gmail.com"],["SSE/TRD/S&W/ECR/DHN","SSE/TRD/S&W/ECR/DHN",9771426583,"srsetrddhn@gmail.com","Office of SSE/TRD/S&W/DHN, Near Gaya Bridge, Rangatand, Dhanbad, Jharkhand, 826001","DEE/TRD/DHN",9771426304,"uttam.maiti@gov.in"],["Sr.DSC/DHN","IPF/DQM",9771426717,"dhn.dqm@gmail.com","Office of RPF Divisional Store Dhanbad, Near Dhanbad Railway Station, Dhanbad, Jharkhand, 826001","ASC/DHN",9771426701,"ascrpfecrdhn@gmail.com"],["J.E./TELE-1/G/DHN","SSE/TELE/STORE/DHN",9771445859,"prakashkrmandalecr@gmail.com","Office of SSE/TELE/Store, DRM Office, Dhanbad, Jharkhand, 826001","DSTE/TELE/DHN",9771426807,"rajeev.ext.bit@gmail.com"],["SSE/E/PTRU","SSE/E/ECR/PTRU",7002551224,"pranabkumar.1304@gov.in","Office of the Sr. Section Engineer (Electrical), Patratu, Ramgarh, Jharkhand, 829118","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["SSE/E/CPU","SSE/E/ECR/CPU",9794849694,"chandankumar.0779@gov.in","Office of the Sr. Section Engineer (Electrical), Chopan, Sonebhadra,  UP, 231205","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["SSE/E/PEH","SSE/E/PEH",9771468627,"malmin.7008@gov.in","Office of the Sr. Section Engineer (Electrical), Pathardih (PEH), Loco Bazar Power House, Jharkhand, 828119","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["P.W.I./T.D/DHN","SSE/TD/DHN",9771426240,"dhnssetd@gmail.com","Office of the Sr. Section Engineer (PWI), Track Depot, Near Gaya Bridge, Dhanbad, Jharkhand, 826001","DEN/HQ/DHN",7781016676,"ram.071964@gov.in"],["I.O.W-I/DHN","SSE/W-I/DHN",9794849684,"sshankar2008@gmail.com","Office of the Sr. Section Engineer (Works-I), IOW-1, Near Dhanbad Rly. Station, Dhanbad, Jharkhand, 826001","DEN/HQ/DHN",7781016676,"ram.071964@gov.in"],["I.O.W-II/DHN","SSE/W-II/DHN",9771426234,"sunilpnc71@gmail.com","Office of the Sr. Section Engineer (Works-II), (IOW-2), Dhanbad, Jharkhand, 826001","DEN/HQ/DHN",7781016676,"ram.071964@gov.in"],["SSE/E/BRKA","SSE/E/BRKA",9771426373,"jaywantlakra1@gmail.com","Office of Sr. Section Engineer (Electrical), Barkakana, Ramgarh, Jharkhand, 829102","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["SSE/TRS/GMO","SSE/TRS/GMO",7004190621,"akhilesh.1411@gov.in","Office of the Sr. Section Engineer (TRS), Gomoh, Jharkhand, 828401 ","DEE/TRS",9771426307,"sudhakar.kumar01@gov.in"],["SSE/S/W/DHN","SSE/S/W/DHN",9771425829,"bislamecr4570@gmail.com","Office of the Sr. Section Engineer/Signal/Works. Under Dy. CSTE/Works/DHN, 2nd Floor, DRM Office, Dhanbad, Jharkhand, 826001","Dy.CSTE/Works/DHN",9771426806,"rajnishkumar.0806@gov.in"],["Sr.DEE/DHN","SSE/E/DHN",9771426318,"dilip.0172@gov.in","Office of the Sr. Section Engineer (Electrical),Power House, Near Bharat Petroleum Depot, Dhanbad, Jharkhand, 826001","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["Sr.SE/D/PTRU","SSE/STORE/PTRU",9065516802,"pushpitapriti@gmail.com","Diesel Loco Shed, Patratu, Jharkhand","DME/DSL",9771426911,"anurag.scra1203@gov.in"],["Sr.DPO/DHN","OS/Personnel",9771445166,"gautam3tiwary@gmail.com","Office of Sr. DPO, Inside DRM Office, Dhanbad, Jharkhand, 826001","DPO/DHN",9771426625,"nirajk.2612@gov.in"],["Sr.DCM/DHN","Ch.OS/Commercial",9771445925,"dhiraj.4444ravi@gmail.com","Office of Sr. DCM, Inside DRM Office, Dhanbad, Jharkhand, 826001","ACM/DHN",9771426953,"acm2dhn@gmail.com"],["C.A.SUPDT/DHN","Coal Area Superintendent",7091092303,"rajuneha365@gmail.com","Coal Area Superintendent, Office of Coal Area Manager, DRM Office, Dhanbad, Jharkhand, 826001","CAM/DHN",9771426905,"camecrdhn@gmail.com"],["DMO/DHN","OS/CMS/DHN/ECR",9771445938,"vivekkumar.2507@gov.in","Office of the Chief Medical Superintendent, Divisional Railway Hospital, Near RPSF Camp, Dhanbad, 826001","CMS/DHN/ECR",9771426500,"deepankar.chaurasia@gov.in"],["SSE/SIG/CON/DHN","SSE/SIGNAL/CON/DHN",9771463875,"jan90cpr@gmail.com","Office of the Sr. Section Engineer/Signal/Construction, Under Dy. CSTE/Con/DHN, Near VIP Siding, Dhanbad, Jharkhand, 826001","ASTE/DHN",9771460855,"amitkumar1102@gmail.com"],["SSE/Elect/SGRL","SSE/E/SGRL",9794849690,"maheshprasad.2604@gov.in","Office of the Sr. Section Engineer (Electrical), Singrauli, Sidhi, Madhya Pradhesh, 486889","AEE/G/DHN",9771426308,"abhishek.0812@gov.in"],["SSE/TL & AC/DHN","SSE/TL&AC/DHN",9771426320,"ssetlacdhn@gmail.com","Office of the Sr. Section Engineer, TL & AC, Coaching Depot, Old Station, Dhanbad, Jharkhand, 826001","DME/C&W/DHN",9771426402,"dmecw123@gmail.com"],["DFM/DHN","Sr. SO/Accounts",9771426143,"ravi.1601@gov.in","Office of Sr. DFM, Inside DRM Office, Dhanbad, Jharkhand, 826001","DFM/DHN",9771426101,"santoshkumar.3009@gov.in"],["DRH/ECR/Dhanbad","Pharmacist/DRH/DHN",8797955536,"rabindra.7514@gov.in","Divisional Railway Hospital, Near RPSF Camp, Dhanbad, 826001","Sr. DMO",9771426504,"jayanti.kashyap83@gov.in"]];
        var contactDetails = tncDiv.querySelectorAll('textarea[id^=othrTNC]')[2] || tncDiv.querySelectorAll('textarea[id^=othrTNC]')[1];
        var contactDetailsLabel = contactDetails.parentElement.previousElementSibling.querySelectorAll('select')[0];
        var contactDetailsType = contactDetails.parentElement.previousElementSibling.querySelectorAll('input[id^=custom]')[0];
        var contactDetailsString = "";

        contactsArray.forEach(contact => {

            if (contact[0] == consigneeTrimmed) {
                contactDetailsString = "Consignee Details (For dispatch of material and receipt/acceptance related issues):";
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
        contactDetailsLabel.value = 1;
        contactDetailsType.value = "Consignee Details";
        contactDetailsType.style.display = "block";

    });

})();