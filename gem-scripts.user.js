// ==UserScript==
// @name         GeM
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  try to take over the world!
// @author       You
// @match        https://*.gem.gov.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        var pathname = location.pathname;
        var body = document.querySelectorAll("body")[0];

        if (document.querySelectorAll(".advanced-header-widget")[0]) {
            var cartWrapper = document.querySelectorAll(".advanced-header-widget")[0].querySelectorAll(".cart-wrapper")[0];
            var cartLink = cartWrapper.querySelectorAll("a")[0];
            cartLink.setAttribute("href", "/my_save_list/shopping_cart");
            var cartLinkNew = cartLink.cloneNode(true);
            cartWrapper.appendChild(cartLinkNew);
            cartWrapper.removeChild(cartLink);
        }

        if (pathname.startsWith("/finance")) {
            var searchContract = document.querySelectorAll(".search_contract")[0].querySelectorAll("input")[0];
            searchContract.value = "GEMC-";
        }

        if (pathname.endsWith("/checkouts/payment_method_new")) {
            var form = document.querySelectorAll("#proceed-to-checkout")[0];

            var adminApproval = form.querySelectorAll("#pi_details_designation_admin_approval")[0];
            var financeApproval = form.querySelectorAll("#pi_details_designation_finance_approval")[0];

            adminApproval.addEventListener("focusout", (e) => {
                financeApproval.value = adminApproval.value;
            });

            var gstConsignee = form.querySelectorAll("#pi_details_gst_invoice_owner_Consignee")[0];
            gstConsignee.checked = true;
            var billProcessConsigneeNo = form.querySelectorAll("#pi_details_is_consignee_a_bill_processor_false")[0];
            billProcessConsigneeNo.checked = true;
            var tdsIT = form.querySelectorAll("#pi_details_tds_details_in_checkout_deducted_under_income_tax")[0];
            tdsIT.checked = false;
            var hodApproval = form.querySelectorAll("#pi_details_ifd_concurrence_rqd_0")[0];
            hodApproval.checked = true;

            var ifdDiaryNo = form.querySelectorAll("#pi_details_ifd_diary_no")[0];
            ifdDiaryNo.disabled = true;
            var ifdDiaryDate = form.querySelectorAll(".pi_details_ifd_diary_date")[0];
            ifdDiaryDate.disabled = true;

            var accountingUnit = form.querySelectorAll("#accounting-unit-dropdown")[0];
            accountingUnit.value = 3003;
            var accountingUnitConfirm = form.querySelectorAll("#accounting-unit-confirm-dropdown")[0];
            accountingUnitConfirm.value = 3003;
        }

        if (pathname.startsWith("/buyer-bid-tech-finance-evaluation/")) {

            body.classList.add("bid-evaluation");

            document.addEventListener("click", (e) => {
                if (e.target.classList.contains("mse_prefer_allow") && e.target.value == 1) {
                    document.querySelectorAll("textarea#comment_msepp")[0].value =
                        "Verified as Eligible for MSE Purchase Preference/Reservation";
                }

                if (e.target.classList.contains("mse_prefer_allow") && e.target.value == 0) {
                    document.querySelectorAll("textarea#comment_msepp")[0].value =
                        "Verified as Not Eligible for MSE Purchase Preference/Reservation";
                }
            });
        }

        if (pathname.endsWith("/view_contracts")) {
            document.addEventListener("focusout", (e) => {
                if (e.target.id == "bno") {
                    var contract = document.querySelectorAll("#bno")[0];
                    var contractValue = contract.value;
                    contract.value = contractValue.trim().split(" ").join("");
                }
            });
        }

        if (pathname.startsWith("/esignservice/api/esignresponse/dscredirect")) {
            body.classList.add("dsc_sign");

            var tokenSelect = body.querySelectorAll("#tokenSelect")[0];
            var certSelect = body.querySelectorAll("#certSelect")[0];
            var passwordInput = body.querySelectorAll("#password")[0];
            var signButton = body.querySelectorAll("#signButton")[0];

            tokenSelect.tabIndex = 1;
            certSelect.tabIndex = 2;
            passwordInput.tabIndex = 3;
            signButton.tabIndex = 4;

        }

        if (pathname.endsWith("/oauth/login")) {
            document.addEventListener("input", (e) => {
                if (e.target.id == "captcha_math") {
                    var captcha = document.querySelectorAll("#captcha_math")[0];
                    var captchaValue = captcha.value;
                    captcha.value = captchaValue.toUpperCase();
                }
            });
        }
    },
    false
);
