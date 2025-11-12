javascript: (() => {
    
    var today = new Date();
    var monday;
    if(today.getDay() != 0){
        monday = new Date(today - (today.getDay() - 1)*24*60*60*1000);
    }
    else{
        monday = new Date(today - (7 - 1)*24*60*60*1000);
    }
    var todayString = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    var mondayString = monday.getDate() + "/" + (monday.getMonth() + 1) + "/" + monday.getFullYear();

    var req = new XMLHttpRequest();
    req.open("GET", "https://ireps.gov.in/epsn/reports/viewTenders.do?&department=28017&startDt="+mondayString+"&endDt="+todayString+"&displayType=publishR", false);
    req.send(null);

    if (req.status == 200) {
        var parser = new DOMParser();
        var html = parser.parseFromString(req.responseText, "text/html");
        var table = html.querySelectorAll("tbody")[0].querySelectorAll("tbody")[0];
        var list = table.children;

        var section1 = "P4";
        var section2 = "P5";
        var section3 = "P12";
        var section4 = "P13";
        var numSection1 = 0; 
        var numSection2 = 0;
        var numSection3 = 0;
        var numSection4 = 0;

        for(var i = 1; i < list.length; i++){

            var tender = list[i];

            if(tender.children[4].innerText == section1){
                numSection1++;
            }
            if(tender.children[4].innerText == section2){
                numSection2++;
            }
            if(tender.children[4].innerText == section3){
                numSection3++;
            }
            if(tender.children[4].innerText == section4){
                numSection4++;
            }

        }

        alert("No of tenders publshed from "+mondayString+" to "+todayString+": \n "+section1+"   : "+numSection1+" \n "+section2+"  : "+numSection2+" \n "+section3+" : "+numSection3+" \n "+section4+" : "+numSection4);
        
    }
})();
