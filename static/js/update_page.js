$(document).ready(function () {
    $('#sliderManagement').addClass('menu-open');
    $('a#pageManagement').addClass('active');

    $('#id_names').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih aplikasi',
    });

    $('input').prop('disabled', false);

    $('fieldset:last').remove();
    $('.page-div:last').remove();

    if ($('fieldset').length == 1) {
        $('#id_location-delete-0').hide();
    }

    $('#id_page-TOTAL_FORMS').val(1);
    var totalLocation = $('#id_location-TOTAL_FORMS').val();
    var totalLocation = Number(totalLocation);
    var totalLocation = totalLocation - 1;

    $('#id_location-TOTAL_FORMS').val(totalLocation);
});

function cloneLocation() {

    var totalLocation = $('#id_location-TOTAL_FORMS').val();
    var totalLocation = Number(totalLocation);
    var selector = 'fieldset:last';

    newElement = $(selector).clone(true, true);
    newElement.show();
    newElement.attr('id', 'id_location-' + totalLocation + '-fieldset');

    totalFieldset = $('fieldset:visible').length;

    newElement.find('legend').html('Lokasi ke-' + (totalFieldset+1));

    newElement.find('input[type="checkbox"]').remove();

    newElement.find('#id_location-' + (totalLocation - 1) + '-id').attr('name', 'location-' + totalLocation + '-id');
    newElement.find('#id_location-' + (totalLocation - 1) + '-id').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-id').attr('id', 'id_location-' + totalLocation + '-id');

    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').attr('name', 'location-' + totalLocation + '-is_slider');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').prop('checked', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').attr('id', 'id_location-' + totalLocation + '-is_slider_0');

    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').attr('name', 'location-' + totalLocation + '-is_slider');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').prop('checked', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').attr('id', 'id_location-' + totalLocation + '-is_slider_1');

    newElement.find('.location-slider label:first').attr('for', 'id_location-' + totalLocation + '-is_slider_0');
    newElement.find('.location-slider label:nth-child(2)').find('label').attr('for', 'id_location-' + totalLocation + '-is_slider_0');
    newElement.find('.location-slider label:nth-child(3)').find('label').attr('for', 'id_location-' + totalLocation + '-is_slider_1');
    
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').attr('name', 'location-' + totalLocation + '-name');
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').attr('id', 'id_location-' + totalLocation + '-name');
    
    newElement.find('.location-name label').attr('for', 'id_location-' + totalLocation + '-name');

    newElement.find('#id_location-' + (totalLocation - 1) + '-width').attr('name', 'location-' + totalLocation + '-width');
    newElement.find('#id_location-' + (totalLocation - 1) + '-width').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-width').attr('id', 'id_location-' + totalLocation + '-width');

    newElement.find('.location-size label:first').attr('for', 'id_location-' + totalLocation + '-width');

    newElement.find('#id_location-' + (totalLocation - 1) + '-height').attr('name', 'location-' + totalLocation + '-height');
    newElement.find('#id_location-' + (totalLocation - 1) + '-height').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-height').attr('id', 'id_location-' + totalLocation + '-height');

    newElement.find('.location-size label:last').attr('for', 'id_location-' + totalLocation + '-height');

    newElement.find('#id_location-delete-' + (totalLocation - 1)).attr('id', 'id_location-delete-' + totalLocation);

    $(selector).after(newElement);

    var totalLocationFieldset = $('fieldset:visible').length;

    if (totalLocationFieldset > 1) {
        $('.delete-btn').show();
    }

    var totalLocation = $('fieldset').length;

    $('#id_location-TOTAL_FORMS').val(totalLocation);

}

function removeLocation(input) {
    var inputId = $(input).attr("id");
    var id = inputId.slice(-2);

    if (inputId.includes('-')) {
        var id = inputId.slice(-1);
    }

    var selector = '#id_location-' + id + '-fieldset';
    if ($('#id_location-' + id + '-DELETE').length > 0) {
        $('#id_location-' + id + '-DELETE').prop('checked', true);
        $(selector).hide();

        var total_forms = $('fieldset:visible').length;

        if (total_forms == 1) {
            $('.delete-btn:first').hide();
        }
    } else {
        $(selector).remove();
        var total_forms = $('fieldset:visible').length;

        if (total_forms == 1) {
            $('.delete-btn:first').hide();
        }

        $('#id_location-TOTAL_FORMS').val(total_forms);

    }

    if ($('fieldset:visible').length == 1) {
        $('.delete-btn').hide();
    }

    var totalLocation = $('fieldset').length;

    $('#id_location-TOTAL_FORMS').val(totalLocation);

}

function checkSimilarPage(input) {

    var url = $('#pageForm').attr("data-check-similar-page-url");
    var page_id = $('#id_page-0-id').val();
    var value = $(input).val();
    var app_value = $('#id_names').val();

    $.ajax({
        url: url,
        data: {
            'page_id': page_id,
            'value': value,
            'app_value': app_value,
        },
        success: function (data) {
            if (data == 'True') {
                $('#id_warning-text-page').hide();
                $('#submitUpdatePage').prop('disabled', false);
            } else {
                $('#id_warning-text-page').show();
                $('#submitUpdatePage').prop('disabled', true);
            }
        }
    });

}