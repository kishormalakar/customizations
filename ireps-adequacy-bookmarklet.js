javascript: (() => {
    
    var req = new XMLHttpRequest();
    req.open("GET", "https://ireps.gov.in/epsn/reports/shieldCriteriaReport/adequacyOfCoverageOfCurrentData.do?&zone=10&yrTOR=25&reportName=AdeqCoverage&zoneName=ECR", false);
    req.send(null);

    if (req.status == 200) {
        var parser = new DOMParser();
        var html = parser.parseFromString(req.responseText, "text/html");
        var table = html.querySelectorAll("tbody")[3];
        var list = table.children;

        var section1 = "04";
        var section2 = "05";
        var section3 = "12";
        var section4 = "13";
        var adequacySection1 = 0;
        var adequacySection2 = 0;
        var adequacySection3 = 0;
        var adequacySection4 = 0;

        for(var i = 1; i < list.length; i++){

            var section = list[i];

            if(section.children[1].innerText == section1){
                adequacySection1 = section.children[5].innerText;
            }
            if(section.children[1].innerText == section2){
                adequacySection2 = section.children[5].innerText;
            }
            if(section.children[1].innerText == section3){
                adequacySection3 = section.children[5].innerText;
            }
            if(section.children[1].innerText == section4){
                adequacySection4 = section.children[5].innerText;
            }

        }

        alert("Adequacy \n "+section1+" : "+adequacySection1+" \n "+section2+" : "+adequacySection2+" \n "+section3+" : "+adequacySection3+" \n "+section4+" : "+adequacySection4);
        
    }
})();
