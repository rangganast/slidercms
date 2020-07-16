$(document).ready(function() {
    $('#sliderManagement').removeClass('menu-open');
    $('a#contactManagement').addClass('active');

    $('#id_source').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih cara mendapatkan sumber kontak',
    });
});

$('#id_source').change(function () {
    var source = $(this).find('option:selected').val()

    if(source === 'random') {
        $('fieldset:not(#random-generate)').hide();
        $('fieldset#random-generate').show();
        $('#csvBool').val('False');
        $('#saveBtnDiv').show();
    }else if(source === 'csv') {
        $('fieldset:not(#csv-generate)').hide();
        $('fieldset#csv-generate').show();
        $('#csvBool').val('True');
        $('#saveBtnDiv').show();
    }
});

$('#generateNumber').click(function (e) {
    $('#randomNumberSpinner').show();

    var doStop = false;

    // $('.first_code').each(function (index) {
    //     var value = $(this).val();
    //     if (value.slice(0, 2) != '08' && value.length !== 4) {
    //         $('#first_code-' + index + '-inaccurate').show();
    //         $('#randomNumberSpinner').hide();

    //         doStop = true;

    //     }
    // });

    // $('.digits').each(function(index) {
    //     if ($(this).val().length !== 2 && Number(($(this).val()) !== 11) && Number(($(this).val()) !== 12)) {
    //         $('#digits-' + index + '-inaccurate').show();
    //         $('#randomNumberSpinner').hide();

    //         doStop = true;
    //     }
    // });

    // $('.generate_numbers').each(function (index) {
    //     if(!$(this).val()) {
    //         $('#generate_numbers-' + index + '-empty').show();
    //         $('#randomNumberSpinner').hide();

    //         doStop = true;
    //     }
    // });

    if(!doStop) {
        $.post('/smsblast/generate_random_number', $('#randomNumberForm').serialize(), function (e) {});
        e.preventDefault();

        $('.first_code-inaccurate').hide();
        $('.digits-inaccurate').hide();
        $('.generate_numbers-inaccurate').hide();
    
        setTimeout(function (){
            $('#randomNumberSpinner').hide();
            $('#viewRandomNumbers').prop('disabled', false);
        }, 1000)
    }
    
});

$('#id_upload_csv').change(function () {
    $('#csvForm').submit()
    $('#csvNumberSpinner').show();
})

$('#csvForm').submit(function (event){
    event.preventDefault();
    $.ajax({
        url: $(this).attr("action"),
        type: $(this).attr("method"),
        dataType: "JSON",
        data: new FormData(this),
        processData: false,
        contentType: false,
    });
    
    setTimeout(function () {
        $('#csvNumberSpinner').hide();
        $('#viewCSVNumbers').prop('disabled', false);
    }, 1000)
});

function addContact(input) {
    var id = Number($(input).attr('id').split('-')[1]);
    var selector = 'div#generate-' + id + '-div';
    
    var newElement = $(selector).clone(true, true);

    newElement.attr('id', 'generate-' + (id + 1) + '-div');

    newElement.find('#id_form-' + id + '-first_code').val(null);
    newElement.find('#id_form-' + id + '-first_code').attr('name', 'form-' + (id + 1) + '-first_code')
    newElement.find('#id_form-' + id + '-first_code').attr('id', 'id_form-' + (id + 1) + '-first_code')

    newElement.find('#first_code-' + id + '-exceeded').hide()
    newElement.find('#first_code-' + id + '-exceeded').attr('id', 'first_code-' + (id + 1) + '-exceeded')

    newElement.find('#first_code-' + id + '-empty').hide()
    newElement.find('#first_code-' + id + '-empty').attr('id', 'first_code-' + (id + 1) + '-empty')
    
    newElement.find('#id_form-' + id + '-digits').val(null);
    newElement.find('#id_form-' + id + '-digits').attr('name', 'form-' + (id + 1) + '-digits')
    newElement.find('#id_form-' + id + '-digits').attr('id', 'id_form-' + (id + 1) + '-digits')

    newElement.find('#digits-' + id + '-exceeded').hide()
    newElement.find('#digits-' + id + '-exceeded').attr('id', 'digits-' + (id + 1) + '-exceeded')

    newElement.find('#digits-' + id + '-empty').hide()
    newElement.find('#digits-' + id + '-empty').attr('id', 'digits-' + (id + 1) + '-empty')

    newElement.find('#digits-' + id + '-inaccurate').hide()
    newElement.find('#digits-' + id + '-inaccurate').attr('id', 'digits-' + (id + 1) + '-inaccurate')
    
    newElement.find('#id_form-' + id + '-generate_numbers').val(null);
    newElement.find('#id_form-' + id + '-generate_numbers').attr('name', 'form-' + (id + 1) + '-generate_numbers')
    newElement.find('#id_form-' + id + '-generate_numbers').attr('id', 'id_form-' + (id + 1) + '-generate_numbers')

    newElement.find('#generate_numbers-' + id + '-empty').hide()
    newElement.find('#generate_numbers-' + id + '-empty').attr('id', 'generate_numbers-' + (id + 1) + '-empty')

    newElement.find('#add-' + id + '-contact').attr('id', 'add-' + (id + 1) + '-contact')
    newElement.find('#delete-' + id + '-contact').attr('id', 'delete-' + (id + 1) + '-contact')

    newElement.find('.deleteContactBtn').show();

    $('#id_form-TOTAL_FORMS').val(id + 2);

    $(selector).find('.addContactBtn').hide();
    $(selector).find('.deleteContactBtn').hide();
    
    $(selector).after(newElement);
}

function deleteContact(input) {
    var id = Number($(input).attr('id').split('-')[1]);
    var selector = 'div#generate-' + id + '-div';

    $(selector).remove();

    if((id - 1) != 0) {
        $('#delete-' + (id - 1) + '-contact').show();
        $('#add-' + (id - 1) + '-contact').show();
    } else {
        $('#add-' + (id - 1) + '-contact').show();
    }

    $('#id_form-TOTAL_FORMS').val(id);
}

function addNametoURLandInputs(input) {
    var name = $(input).val();

    if(name === '') {
        $('a#tempRandomContacts').attr('href', '/smsblast/temp_random_contacts');
        $('a#tempCSVContacts').attr('href', '/smsblast/temp_csv_contacts');
        $('#contactName').val(name);
    } else {
        $('a#tempRandomContacts').attr('href', '/smsblast/temp_random_contacts?name=' + encodeURIComponent(name));
        $('a#tempCSVContacts').attr('href', '/smsblast/temp_csv_contacts?name=' + encodeURIComponent(name));
        $('#contactName').val(name);
    }

    var url = $('#contactGroupForm').attr("data-check-name-url");

    $.ajax({
        url: url,
        data: {
            'name': name,
        },
        success: function (data) {
            if(data === 'True') {
                $('#contactNameErrorNotUnique').show();
                $('#contactNameErrorEmpty').hide();
                $('#submitForms').prop('disabled', true);
            } else {
                $('#contactNameErrorNotUnique').hide();
                $('#contactNameErrorEmpty').hide();
                $('#submitForms').prop('disabled', false);
            }
        }
    });
}

function submitForms() {    
    if ($('#random-generate').is(':hidden')) {
        $('#contactGroupFormBtn').click();
    } else if ($('#csv-generate').is(':hidden')) {

        if ($('#id_name').val() === ''){
            $('#id_name').focus();
            $('#contactNameErrorEmpty').show();
            return false;
        }

        $.post('/smsblast/add_contact_group', $('#contactGroupForm').serialize())
        .done(function(result) {
            $('#randomNumberForm').submit();
        })
    }
}