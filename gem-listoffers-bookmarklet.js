javascript: (() => {

    var style = document.createElement("style");
    style.innerHTML = "@media print{body{visibility: hidden;} #content{visibility: visible;position: absolute;top: 0;left: 0;margin: 0;width: 100%;} #content .container{width: 100% !important;padding: 0;} #content .container .panel-group .panel:nth-of-type(1){display: none;} #content .container .panel-group .panel:nth-of-type(2){visibility: visible;position: relative;top: 0;left: 0;margin: 0;width: 100%;} #content .container .progress-indicator{display: none;} #content .container #sellers_form > .technical_eligible > .table-responsive > p{display: none;} #content .container #create_order_area{display: none !important;}}";
    document.head.append(style);

})();