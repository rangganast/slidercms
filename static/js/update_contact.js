$('#id_source').change(function () {
    var source = $(this).find('option:selected').val()

    if (source === 'random') {
        $('fieldset:not(#random-generate)').hide();
        $('fieldset#random-generate').show();
        $('#csvBool').val('False');
        $('#saveBtnDiv').show();
        $('#id_form-0-first_code').prop('required', true);
        $('#id_form-0-digits').prop('required', true);
        $('#id_form-0-generate_numbers').prop('required', true);
    } else if (source === 'csv') {
        $('fieldset:not(#csv-generate)').hide();
        $('fieldset#csv-generate').show();
        $('#csvBool').val('True');
        $('#saveBtnDiv').show();
    }
});

$('#generateNumber').click(function (e) {
    $('#randomNumberSpinner').show();

    var doStop = false;

    $('.first_code').each(function (index) {
        if ($(this).val().slice(0, 2) != '08' || $(this).val().length > 4) {
            $('#first_code-' + index + '-inaccurate').show();
            $('#randomNumberSpinner').hide();

            doStop = true;
        } else {
            $('#first_code-' + index + '-inaccurate').hide();
        }
    });

    $('.digits').each(function(index) {
        if ($(this).val() < 9 || $(this).val() > 14) {
            $('#digits-' + index + '-inaccurate').show();
            $('#randomNumberSpinner').hide();
            
            doStop = true;
        } else{            
            $('#digits-' + index + '-inaccurate').hide();
        }
    });

    $('.generate_numbers').each(function (index) {
        if(!$(this).val()) {
            $('#generate_numbers-' + index + '-empty').show();
            $('#randomNumberSpinner').hide();

            doStop = true;
        } else {
            $('#generate_numbers-' + index + '-empty').hide();
        }
    });

    if(!doStop) {
        $.post('/smsblast/generate_random_number_update', $('#randomNumberForm').serialize(), function (e) {});
        e.preventDefault();

        $('.first_code-inaccurate').hide();
        $('.digits-inaccurate').hide();
        $('.generate_numbers-inaccurate').hide();
    
        setTimeout(function (){
            $('#randomNumberSpinner').hide();
            $('#viewRandomNumbers').prop('disabled', false);
            $('#submitForms').prop('disabled', false);
        }, 1000)
    }
    
});

$('.first_code').on('input', function () {
    $('#submitForms').prop('disabled', true)
    $('#viewRandomNumbers').prop('disabled', true)
});

$('.digits').on('input', function () {
    $('#submitForms').prop('disabled', true)
    $('#viewRandomNumbers').prop('disabled', true)
});

$('.generate_numbers').on('input', function () {
    $('#submitForms').prop('disabled', true)
    $('#viewRandomNumbers').prop('disabled', true)
});

$('#id_upload_csv').on('change', function () {
    if($(this).val()) {
        var value = $(this).val().replace(/C:\\fakepath\\/i, '').toString();
        var filename = value.split('.')
        
        if (filename[filename.length - 1] != 'csv') {
            $('#csv-inaccurate').show();
            return false;
        } else {
            $('#csv-inaccurate').hide();
            $('#csvNumberSpinner').show();
            $('#csvForm').submit();
        }
    } else {
        $('#csv-inaccurate').show();
        return false;
    }
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
        error: function (data) {
            if (data['responseText'] == 'prefix_invalid') {
                $('#csv-invalid-prefix').show();
                doStop = false;
            } else if (data['responseText'] == 'length_invalid') {
                $('#csv-invalid-length').show();
                doStop = false;
            } else if (data['responseText'] == 'wrong_csv_format') {
                $('#csv-invalid-format').show();
                doStop = false;
            }
        }
    });
    
    setTimeout(function () {
        $('#csvNumberSpinner').hide();
        $('#viewCSVNumbers').prop('disabled', false);
        $('#csv-inaccurate').hide();
    }, 1000)
});

function addContact(input) {
    var id = $('#id_form-TOTAL_FORMS').val() - 1;
    var selector = 'div#generate-' + id + '-div';
    
    var newElement = $(selector).clone(true, true);

    newElement.show();
    newElement.attr('id', 'generate-' + (id + 1) + '-div');
    
    newElement.find('input[type="checkbox"]').remove();
    newElement.find('input[type="hidden"]').remove();

    newElement.find('#id_form-' + id + '-first_code').val(null);
    newElement.find('#id_form-' + id + '-first_code').attr('name', 'form-' + (id + 1) + '-first_code')
    newElement.find('#id_form-' + id + '-first_code').attr('id', 'id_form-' + (id + 1) + '-first_code')

    newElement.find('#first_code-' + id + '-inaccurate').hide()
    newElement.find('#first_code-' + id + '-inaccurate').attr('id', 'first_code-' + (id + 1) + '-inaccurate')
    newElement.find('.first_code-backend-error').hide();
    
    newElement.find('#id_form-' + id + '-digits').val(null);
    newElement.find('#id_form-' + id + '-digits').attr('name', 'form-' + (id + 1) + '-digits')
    newElement.find('#id_form-' + id + '-digits').attr('id', 'id_form-' + (id + 1) + '-digits')
    newElement.find('.digits-backend-error').hide();

    newElement.find('#digits-' + id + '-inaccurate').hide()
    newElement.find('#digits-' + id + '-inaccurate').attr('id', 'digits-' + (id + 1) + '-inaccurate')
    
    newElement.find('#id_form-' + id + '-generate_numbers').val(null);
    newElement.find('#id_form-' + id + '-generate_numbers').attr('name', 'form-' + (id + 1) + '-generate_numbers')
    newElement.find('#id_form-' + id + '-generate_numbers').attr('id', 'id_form-' + (id + 1) + '-generate_numbers')
    newElement.find('.generate_numbers-backend-error').hide();

    newElement.find('#generate_numbers-' + id + '-inaccurate').hide()
    newElement.find('#generate_numbers-' + id + '-inaccurate').attr('id', 'generate_numbers-' + (id + 1) + '-inaccurate')

    newElement.find('#add-' + id + '-contact').attr('id', 'add-' + (id + 1) + '-contact')
    newElement.find('#delete-' + id + '-contact').attr('id', 'delete-' + (id + 1) + '-contact')

    newElement.find('.deleteContactBtn').show();

    $('#id_form-TOTAL_FORMS').val(id + 2);

    $('#submitForms').prop('disabled', true);

    $(selector).find('.addContactBtn').hide();
    $(selector).find('.deleteContactBtn').hide();
    
    $(selector).after(newElement);

    new AutoNumeric('#id_form-' + (id + 1) + '-generate_numbers', {
        digitGroupSeparator: '.',
        decimalPlaces: '0',
        decimalCharacter: ',',
    });
}

function deleteContact(input) {
    var id = Number($(input).attr('id').split('-')[1]);
    var selector = 'div#generate-' + id + '-div';

    if ($('#id_form-' + id + '-DELETE').length > 0) {
        $('#id_form-' + id + '-DELETE').prop('checked', true);
        $(selector).hide();
    } else {
        $(selector).remove();
        $('#id_form-TOTAL_FORMS').val(id);
    }

    $('#submitForms').prop('disabled', true);

    if((id - 1) != 0) {
        $('#delete-' + (id - 1) + '-contact').show();
        $('#add-' + (id - 1) + '-contact').show();
    } else {
        $('#add-' + (id - 1) + '-contact').show();
    }

}