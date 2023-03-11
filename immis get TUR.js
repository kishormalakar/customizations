javascript: (() => {

    var canvasHolder = document.querySelectorAll('#CanvassHolder')[0];
    var hdrRow = canvasHolder.querySelectorAll('#s_3')[0].querySelectorAll('.hdrrow')[2];
    var th = document.createElement('td');
    th.innerText = "TUR";
    hdrRow.insertBefore(th, hdrRow.children[3]);

    var dtlRows = canvasHolder.querySelectorAll('#s_3')[0].querySelectorAll('.dtlrow');
    dtlRows.forEach((row) => {
        var poValueText = row.querySelectorAll('td')[2].innerText;
        var poQtyText = row.querySelectorAll('td')[7];

        var poValue = poValueText.substring(0, poValueText.indexOf("<br>"));
        var poQty = poQtyText.substring(0, poQtyText.indexOf(" "));
        var TUR = +poValue / +poQty;
        
        var td = document.createElement('td');
        td.innerText = poValue;
        row.insertBefore(td, row.children[3]);
    })

})();