$(document).ready(function () {
    $('#sliderManagement').addClass('menu-open');
    $('a#pageManagement').addClass('active');

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

    if($('#actives-length').val() == 'True' ){
        appSelector = $('#id_names').clone(true, true);
        appSelector.hide();
        $('#id_names').after(appSelector);

        $('#id_names:visible').attr('id', 'id_names-disabled');

        $('#id_names-disabled').select2({
            theme: 'bootstrap4',
            placeholder: 'Pilih aplikasi',
            disabled: true,
        });

        $('#id_page-0-name').prop('readonly', true);
    }else{
        $('#id_names').select2({
            theme: 'bootstrap4',
            placeholder: 'Pilih aplikasi',
        });
    }

    $('.location-active').each(function (index){
        if($(this).val() == 'True') {
            $('#id_location-' + index + '-fieldset').find('input').prop('readonly', true);
            $('#id_location-' + index + '-fieldset').find(':radio:not(:checked)').prop('disabled', true);
            $('#id_location-' + index + '-fieldset').find('button').prop('disabled', true);
        }
    })

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
    newElement.find('#id_location-' + (totalLocation - 1) + '-id').prop('readonly', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-id').attr('id', 'id_location-' + totalLocation + '-id');

    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').attr('name', 'location-' + totalLocation + '-is_slider');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').removeAttr('checked');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').removeAttr('readonly');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').prop('disabled', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_0').attr('id', 'id_location-' + totalLocation + '-is_slider_0');

    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').attr('name', 'location-' + totalLocation + '-is_slider');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').removeAttr('checked');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').removeAttr('readonly');
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').prop('disabled', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-is_slider_1').attr('id', 'id_location-' + totalLocation + '-is_slider_1');

    newElement.find('.location-slider label:first').attr('for', 'id_location-' + totalLocation + '-is_slider_0');
    newElement.find('.location-slider label:nth-child(2)').find('label').attr('for', 'id_location-' + totalLocation + '-is_slider_0');
    newElement.find('.location-slider label:nth-child(3)').find('label').attr('for', 'id_location-' + totalLocation + '-is_slider_1');
    
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').attr('name', 'location-' + totalLocation + '-name');
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').prop('readonly', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-name').attr('id', 'id_location-' + totalLocation + '-name');
    
    newElement.find('#id_location-' + (totalLocation - 1) + '-loc_code').attr('name', 'location-' + totalLocation + '-loc_code');
    newElement.find('#id_location-' + (totalLocation - 1) + '-loc_code').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-loc_code').prop('readonly', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-loc_code').attr('id', 'id_location-' + totalLocation + '-loc_code');

    newElement.find('#id_warning-text-location-' + (totalLocation - 1)).hide();
    newElement.find('#id_warning-text-location-' + (totalLocation - 1)).prop('disabled', false);
    newElement.find('#id_warning-text-location-' + (totalLocation - 1)).attr('id', 'id_warning-text-location-' + totalLocation);

    newElement.find('#id_warning-text-location-code-' + (totalLocation - 1)).hide();
    newElement.find('#id_warning-text-location-code-' + (totalLocation - 1)).prop('disabled', false);
    newElement.find('#id_warning-text-location-code-' + (totalLocation - 1)).attr('id', 'id_warning-text-location-code-' + totalLocation);
    
    newElement.find('.location-name label').attr('for', 'id_location-' + totalLocation + '-name');
    newElement.find('.location-code label').attr('for', 'id_location-' + totalLocation + '-loc_code');

    newElement.find('#id_location-' + (totalLocation - 1) + '-width').attr('name', 'location-' + totalLocation + '-width');
    newElement.find('#id_location-' + (totalLocation - 1) + '-width').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-width').prop('readonly', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-width').attr('id', 'id_location-' + totalLocation + '-width');

    newElement.find('.location-size label:first').attr('for', 'id_location-' + totalLocation + '-width');

    newElement.find('#id_location-' + (totalLocation - 1) + '-height').attr('name', 'location-' + totalLocation + '-height');
    newElement.find('#id_location-' + (totalLocation - 1) + '-height').val('');
    newElement.find('#id_location-' + (totalLocation - 1) + '-height').prop('readonly', false);
    newElement.find('#id_location-' + (totalLocation - 1) + '-height').attr('id', 'id_location-' + totalLocation + '-height');

    newElement.find('.location-size label:last').attr('for', 'id_location-' + totalLocation + '-height');

    newElement.find('#id_location-delete-' + (totalLocation - 1)).prop('disabled', false);
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

        $('.location-slider').find('input:first').each(function (index) {
            $(this).attr("id", "id_location-" + index + "-is_slider_0");
            $(this).attr("name", "location-" + index + "-is_slider");
        });

        $('.location-slider').find('label:first').each(function (index) {
            $(this).attr("for", "id_location-" + index + "-is_slider_0");
        });

        $('.location-slider').find('label:nth-child(2)').each(function (index) {
            $(this).find('label').attr("for", "id_location-" + index + "-is_slider_0");
        });

        $('.location-slider').find('input:last').each(function (index) {
            $(this).attr("id", "id_location-" + index + "-is_slider_1");
            $(this).attr("name", "location-" + index + "-is_slider");
        });

        $('.location-slider').find('label:last').each(function (index) {
            $(this).attr("for", "id_location-" + index + "-is_slider_1");
        });



        $('.location-name input').each(function (index) {
            $(this).attr("id", "id_location-" + index + "-name");
            $(this).attr("name", "location-" + index + "-name");
        });

        $('.location-name').find('label').each(function (index) {
            $(this).attr("for", "id_location-" + index + "-name");
        });

        $('.location-name').find('small').each(function (index) {
            $(this).attr("id", "id_warning-text-location-" + index);
        });

        $('.location-code input').each(function (index) {
            $(this).attr("id", "id_location-" + index + "-loc_code");
            $(this).attr("name", "location-" + index + "-loc_code");
        });

        $('.location-code').find('label').each(function (index) {
            $(this).attr("for", "id_location-" + index + "-loc_code");
        });

        $('.location-code').find('small').each(function (index) {
            $(this).attr("id", "id_warning-text-location-code-" + index);
        });

        $('.location-size').find('input:first').each(function (index) {
            $(this).attr("id", "id_location-" + index + "-width");
            $(this).attr("name", "location-" + index + "-width");
        });

        $('.location-size').find('label:first').each(function (index) {
            $(this).attr("for", "id_location-" + index + "-width");
        });

        $('.location-size').find('input:last').each(function (index) {
            $(this).attr("id", "id_location-" + index + "-height");
            $(this).attr("name", "location-" + index + "-height");
        });

        $('.location-size').find('label:last').each(function (index) {
            $(this).attr("for", "id_location-" + index + "-height");
        });

        $('.delete-btn').each(function (index) {
            $(this).attr("id", "id_location-delete-" + index);
        });


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
                if ($('.location-warning-text:visible').length == 0) {
                    $('#submitUpdatePage').prop('disabled', false);
                } else {
                    $('#submitUpdatePage').prop('disabled', true);
                }
            } else {
                $('#id_warning-text-page').show();
                $('#submitUpdatePage').prop('disabled', true);
            }
        }
    });
}

function checkSimilarLocation(input) {
    var url = $('#pageForm').attr("data-check-similar-location-url");
    var inputId = $(input).attr('id');
    var app_id = $('#id_names').find('option:selected').val()
    var id = inputId.slice(12, 14);
    
    if (id.includes('-')) {
        var id = inputId.slice(12, 13);
    }
    
    var value = $(input).val();
    var page_value = $('#id_page-0-name').val();
    var loc_id = $('#id_location-' + id + '-id').val();

    $.ajax({
        url: url,
        data: {
            'value': value,
            'app_id': app_id,
            'page_value': page_value,
            'loc_id': loc_id,
        },
        success: function (data) {
            if (data == 'True') {
                if ($('.location-name-input:not(#' + inputId + ')').length > 0) {
                    $('.location-name-input:not(#' + inputId + ')').each(function () {
                        if ($(this).val() == value) {
                            $('#id_warning-text-location-' + id).show();
                            $('#submitUpdatePage').prop('disabled', true);
                            return false;
                        } else {
                            $('#id_warning-text-location-' + id).hide();
                            if ($('#id_warning-text-page:visible').length == 0 && $('.location-warning-text:visible').length == 0 && $('.location-code-warning-text:visible').length == 0) {
                                $('#submitUpdatePage').prop('disabled', false);
                            } else {
                                $('#submitUpdatePage').prop('disabled', true);
                            }
                        }
                    });
                } else {
                    $('#id_warning-text-location-' + id).hide();
                    if ($('#id_warning-text-page:visible').length == 0 && $('.location-warning-text:visible').length == 0 && $('.location-code-warning-text:visible').length == 0) {
                        $('#submitUpdatePage').prop('disabled', false);
                    } else {
                        $('#submitUpdatePage').prop('disabled', true);
                    }
                }
            } else {
                $('#id_warning-text-location-' + id).show();
                $('#submitUpdatePage').prop('disabled', true);
            }
        }
    });
}

function checkLocationCode(input) {
    var url = $('#pageForm').attr("data-check-location-code-url");
    var inputId = $(input).attr('id');
    var id = inputId.slice(12, 14);
    
    if (id.includes('-')) {
        var id = inputId.slice(12, 13);
    }
    
    var value = $(input).val();
    var app_id = $('#id_names').val();
    var loc_id = $('#id_location-' + id + '-id').val();

    $.ajax({
        url: url,
        data: {
            'value': value,
            'app_id': app_id,
            'loc_id': loc_id,
        },
        success: function (data) {
            if (data == 'True') {
                if ($('.location-code-input:not(#' + inputId + ')').length > 0) {
                    $('.location-code-input:not(#' + inputId + ')').each(function () {
                        if ($(this).val() == value) {
                            $('#id_warning-text-location-code-' + id).show();
                            $('#submitUpdatePage').prop('disabled', true);
                            return false;
                        } else {
                            $('#id_warning-text-location-code-' + id).hide();
                            if ($('#id_warning-text-page:visible').length == 0 && $('.location-warning-text:visible').length == 0 && $('.location-code-warning-text:visible').length == 0) {
                                $('#submitUpdatePage').prop('disabled', false);
                            } else {
                                $('#submitUpdatePage').prop('disabled', true);
                            }
                        }
                    });
                } else {
                    $('#id_warning-text-location-code-' + id).hide();
                    if ($('#id_warning-text-page:visible').length == 0 && $('.location-warning-text:visible').length == 0 && $('.location-code-warning-text:visible').length == 0) {
                        $('#submitUpdatePage').prop('disabled', false);
                    } else {
                        $('#submitUpdatePage').prop('disabled', true);
                    }
                }
            } else {
                $('#id_warning-text-location-code-' + id).show();
                $('#submitUpdatePage').prop('disabled', true);
            }
        }
    });
}