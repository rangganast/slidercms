function load_datepicker(input) {
    var inputId = $(input).attr('id');

    $('#' + inputId).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });

    $('#' + inputId).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}

$('#id_to_numbers').change(function() {
    var names = $(this).val();

    if(names.length == 0) {
        $('#viewTempContactsBtn').prop('disabled', true)
    } else {
        $('#viewTempContactsBtn').prop('disabled', false)
    }

    var urlParams = '?';

    if(names.length > 0) {
        $.each(names, function(index, value) {
            if(index == 0) {
                var name = 'name=' + value
            } else {
                var name = '&name=' + value
            }
    
            urlParams = urlParams + name
        });
    
        var url = '/smsblast/add_smsblast_temp_contacts';
        
        $('#viewTempContacts').attr('href', url + urlParams);
    }
});

$('input:radio[name="send_now"]').change(function () {
    if ($('#send_now_yes').is(':checked')) {
        $('#send_now_div').hide();
        $('#id_send_date').val('');
        $('#id_send_time').val('');
        $('#id_send_date').prop('required', false);
        $('#id_send_time').prop('required', false);
    } else if ($('#send_now_no').is(':checked')) {
        $('#send_now_div').show();
        $('#id_send_date').prop('required', true);
        $('#id_send_time').prop('required', true);
    }
});
