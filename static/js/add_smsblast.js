$(document).ready(function() {
    $('#sliderManagement').removeClass('menu-open');
    $('a#smsBlast').addClass('active');

    $('#id_to_numbers').select2({
        theme: 'bootstrap4',
    });
    
    $('#id_send_date').daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        cancelButtonClasses: 'btn btn-secondary',
        minDate: new Date(),
        drops: 'up',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        },
    });
    
    $('#id_send_time').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        timePicker: true,
        singleDatePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 1,
        timePickerSeconds: true,
        locale: {
            format: 'HH:mm:ss',
            cancelLabel: 'Clear'
        },
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".calendar-table").hide();
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('HH:mm:ss'));
    }).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
});

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
    } else if ($('#send_now_no').is(':checked')) {
        $('#send_now_div').show();
    }
});
