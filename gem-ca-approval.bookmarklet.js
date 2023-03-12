javascript: (() => {

    var ca_name = document.querySelectorAll('input#ca_name')[0];
    var ca_designation = document.querySelectorAll('input#ca_designation')[0];
    var ca_office = document.querySelectorAll('input#ca_office')[0];
    var ca_approval_number = document.querySelectorAll('input#ca_approval_number')[0];
    var ca_approval_date = document.querySelectorAll('input#ca_approval_date')[0];
    var ca_approval_description = document.querySelectorAll('textarea#ca_approval_description')[0];
    var ca_file = document.querySelectorAll('input#caUpdBtn')[0];
    var ca_file_label = document.querySelectorAll('label[for="caUpdBtn"]')[0];

    ca_name.value = "Kishor Malakar";
    ca_designation.value = "Assistant Materials Manager";
    ca_office.value = "East Central Railway";
    ca_approval_number.value = "01";
    ca_approval_description.value = "Competent authority has given approval for opening of financial bid.";

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var date = dd + '-' + mm + '-' + yyyy;
    ca_approval_date.value = date;

    ca_file_label.click();

})();