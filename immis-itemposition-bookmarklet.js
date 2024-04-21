javascript: (() => {
    var pl = prompt("PL No");

    window.location.href = "https://ireps.gov.in/iMMS/depot/itempos/gethistsheet?rly=10&plno=" + pl;
})();