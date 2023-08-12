javascript: (() => {

    var leaveDetailsModal = document.querySelectorAll("#leave-details")[0].querySelectorAll(".modal-content")[0];

    var applicationHeader = leaveDetailsModal.querySelectorAll(".modal-title")[0];
    applicationHeader.innerHTML = "Leave Application Form (HRMS)";

    var style = document.createElement("style");
    style.innerHTML = "@media print {body {visibility: hidden} #leave-details {visibility: visible; position: absolute; left: 0; top: 0; margin: 0 !important; padding: 0 !important} #leave-details > div {display: flex; margin: 0 !important; padding: 0 !important; width: 100%; max-width: 1400px} #leave-details .modal-content {visibility: visible; position: absolute; left: 0; top: 0; margin: 0 !important; padding: 0 !important} #leave-details .modal-header div:nth-of-type(2){display: none} #leave-details .modal-title{font-size: 20px} #leave-details .the-fieldset > .row > div > .row > div{display: flex; width: 40%} #leave-details .the-fieldset > .row > div > .row > label{display: flex; width: 60%} #leave-details .the-fieldset:nth-of-type(n+2){margin-top: 20px} #leave-details .the-fieldset .the-legend b{font-size: 18px}}";
    document.head.append(style);

})();