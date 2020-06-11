$(document).ready(function () {
    $('#sliderManagement').addClass('menu-open');
    $('a#installManagement').addClass('active');

    $('#id_campaign-0-daterangepicker').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        minDate: new Date(),
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        }
    });

    $('#app_select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih Aplikasi',
    });
    $('#page_select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih Halaman',
    });
    $('.location-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih Lokasi',
    });
    $('.banner-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih Banner',
    });
});

$('#app_select').change(function () {
    var url = $('#installationForm').attr("data-page-url");
    var app_id = $(this).val();

    if (app_id) {
        $.ajax({
            url: url,
            data: {
                'app_id': app_id,
            },
            success: function (data) {
                $("#page_select").html(data);
                $("#page_select").prop('disabled', false);
            }
        });
    } else {
        $("#page_select").prop('disabled', true);
    }

});

$('#page_select').change(function () {
    var url = $('#installationForm').attr("data-location-url");
    var page_id = $(this).val();

    if (page_id) {
        $.ajax({
            url: url,
            data: {
                'page_id': page_id
            },
            success: function (data) {
                $(".location-select").html(data);
                $(".location-select").prop('disabled', false);
            }
        });
    } else {
        $(".location-select").prop('disabled', true);
    }

});

function load_datepicker(input) {
    var inputId = $(input).attr('id');

    $('#' + inputId).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('#' + inputId).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}

function check_campaign_code_available(input) {
    var url = $('#installationForm').attr("data-check-campaign_code-url");
    var id = $(input).attr('id').slice(12, 14);
    var value = $(input).val();

    if (id.includes('-')) {
        var id = $(input).attr('id').slice(12, 13);
    }

    var loc_id = $('#id_location-select-' + id + ' option:selected').val();

    $.ajax({
        url: url,
        data: {
            'loc_id': loc_id,
            'value': value,
        },
        success: function (data) {
            if (data == 'True') {
                $('#id_campaign-code-warning-' + id).show();
                $('button[type="submit"]').prop('disabled', true);
            } else {
                if ($('.campaign-campaign_code:not(#' + $(input).attr('id') + ')').length > 0) {
                    $('.campaign-campaign_code:not(#' + $(input).attr('id') + ')').each(function () {
                        if ($(this).val() == value) {
                            $('#id_campaign-code-warning-' + id).show();
                            $('button[type="submit"]').prop('disabled', true);
                        } else {
                            $('#id_campaign-code-warning-' + id).hide();
                            if($('.code_warning:visible').length === 0 ){
                                $('button[type="submit"]').prop('disabled', false);
                            }else{
                                $('button[type="submit"]').prop('disabled', true);

                            }
                        }
                    });
                } else {
                    $('#id_campaign-code-warning-' + id).hide();
                    $('button[type="submit"]').prop('disabled', false);
                }
            }
        }
    });
}

function check_priority_available(input) {
    var url = $('#installationForm').attr("data-check-priority-url");
    var id = $(input).attr('id').slice(12, 14);
    var value = $(input).val();
    
    if (id.includes('-')) {
        var id = $(input).attr('id').slice(12, 13);
    }
    
    var loc_id = $('#id_location-select-' + id + ' option:selected').val();
    
    $.ajax({
        url: url,
        data: {
            'loc_id': loc_id,
            'value' : value,
        },
        success: function (data) {
            if(data == 'True'){
                $('#id_campaign-priority-warning-' + id).show();
                $('button[type="submit"]').prop('disabled', true);
            }else{
                if ($('.campaign-priority:not(#' + $(input).attr('id') + ')').length > 0) {
                    $('.campaign-priority:not(#' + $(input).attr('id') + ')').each(function () {
                        if ($(this).val() == value) {
                            $('#id_campaign-priority-warning-' + id).show();
                            $('button[type="submit"]').prop('disabled', true);
                        }else{
                            $('#id_campaign-priority-warning-' + id).hide();
                            if ($('.priority_warning:visible').length === 0) {
                                $('button[type="submit"]').prop('disabled', false);
                            } else {
                                $('button[type="submit"]').prop('disabled', true);

                            }
                        }
                    });
                }else{
                    $('#id_campaign-priority-warning-' + id).hide();
                    $('button[type="submit"]').prop('disabled', false);
                }
            }
        }
    });
}

function load_banner(input) {
    var url = $('#installationForm').attr("data-banner-url");
    var banner_id = $(input).val();
    var id = $(input).attr('id').slice(16, 18);

    if (id.includes('-')) {
        var id = $(input).attr('id').slice(16, 17);
    }

    var prev = $('#id_banner-previous-value-' + id).val();
    var fieldset_id = $('#id_banner-previous-value-' + id).attr("data-fieldset-id");

    $.ajax({
        url: url,
        data: {
            'banner_id': banner_id
        },
        success: function (data) {
            var arr = data.split(',')
            // var imageUrl = 'http://127.0.0.1:8000' + arr[1];
            var imageUrl = 'https://banner-slider-qa.holahalo.dev' + arr[1];
            $('#img-' + id).attr('src', imageUrl);
            $('#id_banner-size-' + id).html('*Ukuran gambar ini adalah ' + arr[0]);
        }
    });

    $('#id_banner-previous-value-' + id).val(banner_id);

    if (banner_id) {
        $('#id_install-' + fieldset_id + '-fieldset .banner-select:not(#' + $(input).attr('id') + ')').each(function () {
            $(this).find('option[value="' + banner_id + '"]').attr('disabled', true);

            if (prev !== '') {
                $(this).find('option[value="' + prev + '"]').attr('disabled', false);
            }
        });
    }

}

function load_size(input) {
    var url = $('#installationForm').attr("data-location-size-url");
    var location_id = $(input).val();
    var id = $(input).attr('id').slice(-2);

    if (id.includes('-')) {
        var id = $(input).attr('id').slice(-1);
    }

    if (location_id) {
        $('#id_install-' + id + '-fieldset').find('#id_campaign-' + id + '-campaign_code').prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('#id_campaign-' + id + '-priority').prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('#id_campaign-' + id + '-daterangepicker').prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('.banner-select').prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('.redirect-yes').prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('.redirect-no').prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('#id_banner-add-' + id).prop('disabled', false);
        $('#id_install-' + id + '-fieldset').find('.daterangepickerinput').css("background-color", "white");
    }

    $.ajax({
        url: url,
        data: {
            'location_id': location_id
        },
        success: function (data) {
            var arr = data.split(',')
            $('#id_location-size-' + id).html('*Ukuran gambar di Lokasi Pemasangan ini adalah ' + arr[0]);
            $('#id_location-is_slider-status-' + id).val(arr[1]);

            if (arr[1] == 'True') {
                if ($('#id_install-' + id + '-fieldset').find('.banner-div').length == 1) {
                    $('#id_banner-add-' + id).click();
                    $('#id_banner-delete-' + id).hide();
                } else if ($('#id_install-' + id + '-fieldset').find('.banner-div').length > 2) {
                    $('#id_install-' + id + '-fieldset').find('.banner-div:gt(1)').remove();
                    $('#id_banner-delete-' + id).hide();
                } else {
                    $('#id_banner-delete-' + id).hide();
                }
            } else {
                if ($('#id_install-' + id + '-fieldset').find('.banner-div').length > 1) {
                    $('#id_install-' + id + '-fieldset').find('.banner-div:gt(0)').remove();
                    $('#id_banner-delete-' + id).hide();
                }
            }
        }

    });
}

function cloneInstall(selector) {

    var originalRadio = $(selector).find('input:checked');
    var originalOption = $(selector).find('select > option:selected').val();

    $(selector).find('.location-select').select2('destroy');
    $(selector).find('.banner-select').select2('destroy');

    var newElement = $(selector).clone(true, true);
    var totalInstall = $('fieldset').length;
    
    newElement.attr('id', 'id_install-' + totalInstall + '-fieldset');

    newElement.find('legend').html('Lokasi Pemasangan ke-' + (totalInstall + 1));
    
    newElement.find('#id_location-select-' + (totalInstall - 1)).attr('id', 'id_location-select-' + totalInstall);
    newElement.find('#id_location-select-' + totalInstall).attr('name', 'location-select-' + totalInstall);

    newElement.find('#id_location-select-' + (totalInstall - 1)).attr('id', 'id_location-select-' + totalInstall);
    newElement.find('#id_location-select-' + totalInstall).attr('name', 'location-select-' + totalInstall);

    newElement.find('#id_campaign-priority-warning-' + (totalInstall - 1)).attr('id', 'id_campaign-priority-warning-' + totalInstall);
    newElement.find('#id_campaign-code-warning-' + (totalInstall - 1)).attr('id', 'id_campaign-code-warning-' + totalInstall);

    newElement.find('#id_campaign-' + (totalInstall - 1) + '-priority').attr('id', 'id_campaign-' + totalInstall + '-priority');
    newElement.find('#id_campaign-' + totalInstall + '-priority').attr('name', 'campaign-' + totalInstall + '-priority');
    newElement.find('#id_campaign-' + totalInstall + '-priority').val('');
    newElement.find('#id_campaign-' + totalInstall + '-priority').prop('disabled', true);

    newElement.find('#id_campaign-' + (totalInstall - 1) + '-campaign_code').attr('id', 'id_campaign-' + totalInstall + '-campaign_code');
    newElement.find('#id_campaign-' + totalInstall + '-campaign_code').attr('name', 'campaign-' + totalInstall + '-campaign_code');
    newElement.find('#id_campaign-' + totalInstall + '-campaign_code').val('');
    newElement.find('#id_campaign-' + totalInstall + '-campaign_code').prop('disabled', true);

    newElement.find('#id_campaign-' + (totalInstall - 1) + '-daterangepicker').val('');
    newElement.find('#id_campaign-' + (totalInstall - 1) + '-daterangepicker').attr('id', 'id_campaign-' + totalInstall + '-daterangepicker');
    newElement.find('#id_campaign-' + totalInstall + '-daterangepicker').attr('name', 'campaign-' + totalInstall + '-daterangepicker');
    newElement.find('#id_campaign-' + totalInstall + '-daterangepicker').css('background-color', '');
    newElement.find('#id_campaign-' + totalInstall + '-daterangepicker').prop('disabled', true);

    newElement.find('#id_campaign-' + totalInstall + '-daterangepicker').daterangepicker({
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
        }
    });
    $('#id_campaign-' + (totalInstall - 1) + '-daterangepicker').daterangepicker({
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
        }
    });

    newElement.find('#id_location-is_slider-status-' + (totalInstall - 1)).attr('id', 'id_location-is_slider-status-' + totalInstall);
    newElement.find('#id_location-is_slider-status-' + totalInstall).attr('name', 'location-is_slider-status-' + totalInstall);
    newElement.find('#id_location-is_slider-status-' + totalInstall).val('');
    
    newElement.find('#id_location-size-' + (totalInstall - 1)).attr('id', 'id_location-size-' + totalInstall);
    
    var forLabel = 'id_location-select-' + (totalInstall - 1);
    newElement.find('label[for="' + forLabel + '"]').attr('for', 'id_location-select-' + totalInstall);

    newElement.find('.banner-select > option').attr('disabled', false);

    newElement.find('.banner-previous-value').attr('data-fieldset-id', totalInstall);

    newElement.find('#id_banner-' + (totalInstall - 1) + '-min').attr('id', 'id_banner-' + totalInstall + '-min');
    newElement.find('#id_banner-' + totalInstall + '-min').attr('name', 'banner-' + totalInstall + '-min');

    newElement.find('#id_banner-' + (totalInstall - 1) + '-max').attr('id', 'id_banner-' + totalInstall + '-max');
    newElement.find('#id_banner-' + totalInstall + '-max').attr('name', 'banner-' + totalInstall + '-max');
    
    newElement.find('#id_banner-add-' + (totalInstall - 1)).attr('id', 'id_banner-add-' + totalInstall);
    newElement.find('#id_banner-add-' + totalInstall).prop('disabled', true);
    newElement.find('#id_banner-delete-' + (totalInstall - 1)).attr('id', 'id_banner-delete-' + totalInstall).hide();

    newElement.find('.banner-select').prop('disabled', true);
    newElement.find('#id_banner-' + (totalInstall - 1) + '-is_redirect_0').prop('checked', false);
    newElement.find('#id_banner-' + (totalInstall - 1) + '-is_redirect_0').prop('disabled', true);
    newElement.find('#id_banner-' + (totalInstall - 1) + '-is_redirect_1').prop('checked', true);
    newElement.find('#id_banner-' + (totalInstall - 1) + '-is_redirect_1').prop('disabled', true);
    newElement.find('.banner-url').hide();

    newElement.find('img').attr('src', '');

    newElement.find('small:not(.campaign_warning)').html('');
    newElement.find('.priority_warning').hide();
    newElement.find('.code_warning').hide();

    newElement.find('.banner-div').not(':first').remove();

    $(selector).after(newElement);

    $('.location-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih Lokasi',
    });

    $('.banner-name').find('select').each(function (index) {
        $(this).attr("id", "id_installation-" + index + "-banner_names");
        $(this).attr("name", "installation-" + index + "-banner_names");
    });

    $('.banner-name').find('label').each(function (index) {
        $(this).attr("for", "id_installation-" + index + "-banner_names");
    });

    $('.banner-size').find('small').each(function (index) {
        $(this).attr("id", "id_banner-size-" + index);
    });


    $('.banner-preview').find('img').each(function (index) {
        $(this).attr("id", "img-" + index);
    });

    $('.banner-preview').find('label').each(function (index) {
        $(this).attr("for", "img-" + index + "-banner_names");
    });



    $('.banner-url').find('input').each(function (index) {
        $(this).attr("id", "id_installation-" + index + "-redirect");
        $(this).attr("name", "installation-" + index + "-redirect");
    });

    $('.banner-url').find('label').each(function (index) {
        $(this).attr("for", "id_installation-" + index + "-redirect");
    });



    $('.banner-previous-value').each(function (index) {
        $(this).attr("id", "id_banner-previous-value-" + index);
        $(this).attr("name", "banner-previous-value-" + index);
    });



    $('.redirect-toggle').find('input:first').each(function (index) {
        $(this).attr("id", "id_banner-" + index + "-is_redirect_0");
        $(this).attr("name", "banner-" + index + "-is_redirect");
    });

    $('.redirect-toggle').find('label:first').each(function (index) {
        $(this).attr("for", "id_banner-" + index + "-is_redirect_0");
    });
    
    $('.redirect-toggle').find('label:nth-child(2)').each(function (index) {
        $(this).find('label').attr("for", "id_banner-" + index + "-is_redirect_0");
    });

    $('.redirect-toggle').find('input:last').each(function (index) {
        $(this).attr("id", "id_banner-" + index + "-is_redirect_1");
        $(this).attr("name", "banner-" + index + "-is_redirect");
    });

    $('.redirect-toggle').find('label:last').each(function (index) {
        $(this).attr("for", "id_banner-" + index + "-is_redirect_1");
    });



    $('fieldset').each(function (index) {
        var min_child = $(this).find('.banner-url:first input').attr("name").slice(13, 15);

        if (min_child.includes('-')) {
            var min_child = $(this).find('.banner-url:first input').attr("name").slice(13, 14);
        }

        $(this).find('#id_banner-' + index + '-min').val(min_child);

        var max_child = $(this).find('.banner-url:last input').attr("name").slice(13, 15);
        if (max_child.includes('-')) {
            var max_child = $(this).find('.banner-url:last input').attr("name").slice(13, 14);
        }

        $(this).find('#id_banner-' + index + '-max').val(max_child);
    });

    $('.banner-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih Banner',
    });

    if (originalRadio.length == 1) {
        originalRadio.prop('checked', true)
    }
    
    totalInstall = $('.banner-div').length;
    
    if (totalInstall > 1) {
        $('#id_install-delete-button').show();
    }

    $('#id_installation-TOTAL_FORMS').val(totalInstall);
    $('#id_campaign-TOTAL_FORMS').val(totalInstall);

    $('#id_installation-TOTAL_FIELDSETS').val($('fieldset').length);

}

function removeInstall(selector) {

    var originalOption = $(selector).find('select > option:selected').val();

    $('.location-select').each(function () {
        $(this).find('option[value="' + originalOption + '"]').attr('disabled', false);
    });

    $(selector).remove();

    if ($('fieldset').length == 1) {
        $('#id_install-delete-button').hide();
    }

    var totalInstall = $('.banner-div').length;
    $('#id_installation-TOTAL_FORMS').val(totalInstall);
    $('#id_campaign-TOTAL_FORMS').val(totalInstall);

    $('#id_installation-TOTAL_FIELDSETS').val($('fieldset').length);

}

function cloneBanner(input) {
    var id = $(input).attr("id");
    var id = id.slice(-1);

    var selector = '#id_install-' + id + '-fieldset .banner-div:last';

    $(selector).find('.banner-select').select2('destroy');

    var originalRadio = $(selector).find('input:checked');
    var originalOption = $(selector).find('select > option:selected').val();
    
    newElement = $(selector).clone(true, true);

    if (originalOption) {
        newElement.find('.banner-select > option[value="' + originalOption + '"]').attr('disabled', true);
    }

    newElement.find('img').attr('src', '')

    $(selector).after(newElement);

    $('.banner-name').find('select').each(function (index) {
        $(this).attr("id", "id_installation-" + index + "-banner_names");
        $(this).attr("name", "installation-" + index + "-banner_names");
    });

    $('.banner-name').find('label').each(function (index) {
        $(this).attr("for", "id_installation-" + index + "-banner_names");
    });


    $('.banner-size').find('small').each(function (index) {
        $(this).attr("id", "id_banner-size-" + index);
    });


    $('.banner-preview').find('img').each(function (index) {
        $(this).attr("id", "img-" + index);
    });

    $('.banner-preview').find('label').each(function (index) {
        $(this).attr("for", "img-" + index + "-banner_names");
    });



    $('.banner-url').find('input').each(function (index) {
        $(this).attr("id", "id_installation-" + index + "-redirect");
        $(this).attr("name", "installation-" + index + "-redirect");
    });

    $('.banner-url').find('label').each(function (index) {
        $(this).attr("for", "id_installation-" + index + "-redirect");
    });


    $('.banner-previous-value').each(function (index) {
        $(this).attr("id", "id_banner-previous-value-" + index);
    });



    $('.redirect-toggle').find('input:first').each(function (index) {
        $(this).attr("id", "id_banner-" + index + "-is_redirect_0");
        $(this).attr("name", "banner-" + index + "-is_redirect");
    });

    $('.redirect-toggle').find('label:first').each(function (index) {
        $(this).attr("for", "id_banner-" + index + "-is_redirect_0");
    });

    $('.redirect-toggle').find('label:nth-child(2)').each(function (index) {
        $(this).find('label').attr("for", "id_banner-" + index + "-is_redirect_0");
    });

    $('.redirect-toggle').find('input:last').each(function (index) {
        $(this).attr("id", "id_banner-" + index + "-is_redirect_1");
        $(this).attr("name", "banner-" + index + "-is_redirect");
    });

    $('.redirect-toggle').find('label:last').each(function (index) {
        $(this).attr("for", "id_banner-" + index + "-is_redirect_1");
    });

    $('fieldset').each(function (index) {

        $(this).find('.banner-div').each(function (index) {
            $(this).attr('id', 'banner-div-' + index);
        });

        var min_child = $(this).find('.banner-url:first input').attr("name").slice(13, 15);

        if (min_child.includes('-')) {
            var min_child = $(this).find('.banner-url:first input').attr("name").slice(13, 14);
        }

        $(this).find('#id_banner-' + index + '-min').val(min_child);

        var max_child = $(this).find('.banner-url:last input').attr("name").slice(13, 15);
        if (max_child.includes('-')) {
            var max_child = $(this).find('.banner-url:last input').attr("name").slice(13, 14);
        }

        $(this).find('#id_banner-' + index + '-max').val(max_child);
    });

    if (originalRadio.length == 1) {
        originalRadio.prop('checked', true)
    }

    $('.banner-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih banner',
    });

    var totalBannerFieldset = $('#id_install-' + id + '-fieldset .banner-div').length;

    if (totalBannerFieldset > 1) {
        $('#id_banner-delete-' + id).show();
    }

    totalInstall = $('.banner-div').length;

    $('#id_installation-TOTAL_FORMS').val(totalInstall);
}

function removeBanner(input) {
    
    var id = $(input).attr("id");
    var id = id.slice(-1);

    var selector = '#id_install-' + id + '-fieldset .banner-div:last';

    var originalOption = $(selector).find('select > option:selected').val();

    $(selector).remove();

    $('#id_install-' + id + '-fieldset .banner-select').each(function () {
        $(this).find('option[value="' + originalOption + '"]').attr('disabled', false);
    });
    
    $('.banner-name').find('select').each(function (index) {
        $(this).attr("id", "id_installation-" + index + "-banner_names");
        $(this).attr("name", "installation-" + index + "-banner_names");
    });

    $('.banner-name').find('label').each(function (index) {
        $(this).attr("for", "id_installation-" + index + "-banner_names");
    });



    $('.banner-preview').find('img').each(function (index) {
        $(this).attr("id", "img-" + index);
    });

    $('.banner-preview').find('label').each(function (index) {
        $(this).attr("for", "img-" + index + "-banner_names");
    });



    $('.banner-url').find('input').each(function (index) {
        $(this).attr("id", "id_installation-" + index + "-redirect");
        $(this).attr("name", "installation-" + index + "-redirect");
    });

    $('.banner-url').find('label').each(function (index) {
        $(this).attr("for", "id_installation-" + index + "-redirect");
    });
    


    $('.redirect-toggle').find('input:first').each(function (index) {
        $(this).attr("id", "id_banner-" + index + "-is_redirect_0");
        $(this).attr("name", "banner-" + index + "-is_redirect");
    });

    $('.redirect-toggle').find('label:first').each(function (index) {
        $(this).attr("for", "id_banner-" + index + "-is_redirect_0");
    });

    $('.redirect-toggle').find('label:nth-child(2)').each(function (index) {
        $(this).find('label').attr("for", "id_banner-" + index + "-is_redirect_0");
    });

    $('.redirect-toggle').find('input:last').each(function (index) {
        $(this).attr("id", "id_banner-" + index + "-is_redirect_1");
        $(this).attr("name", "banner-" + index + "-is_redirect");
    });

    $('.redirect-toggle').find('label:last').each(function (index) {
        $(this).attr("for", "id_banner-" + index + "-is_redirect_1");
    });
    
    $('fieldset').each(function (index) {
        

        var min_child = $(this).find('.banner-url:first input').attr("name").slice(13, 15);

        if (min_child.includes('-')) {
            var min_child = $(this).find('.banner-url:first input').attr("name").slice(13, 14);
        }

        $(this).find('#id_banner-' + index + '-min').val(min_child);

        var max_child = $(this).find('.banner-url:last input').attr("name").slice(13, 15);
        if (max_child.includes('-')) {
            var max_child = $(this).find('.banner-url:last input').attr("name").slice(13, 14);
        }

        $(this).find('#id_banner-' + index + '-max').val(max_child);
    });

    if ($('#id_location-is_slider-status-' + id).val() == 'True'){
        if ($('#id_install-' + id + '-fieldset').find('.banner-div').length == 2) {
            $('#id_banner-delete-' + id).hide();
        }
    }else{
        if ($('#id_install-' + id + '-fieldset').find('.banner-div').length == 1) {
            $('#id_banner-delete-' + id).hide();
        }

    }

    totalInstall = $('.banner-div').length;

    $('#id_installation-TOTAL_FORMS').val(totalInstall);

}

function showRedirect(input) {
    var fieldset = $(input).parent().parent().parent().parent().parent().parent().parent().attr('id');
    var bannerDiv = $(input).parent().parent().parent().parent().parent().attr('id');

    var bannerDivSliced = bannerDiv.slice(-2);
    if (bannerDivSliced.includes('-')) {
        var bannerDivSliced = bannerDiv.slice(-1)
    }

    $('#' + fieldset + ' #banner-div-' + bannerDivSliced + ' .banner-url').show();
    $('#' + fieldset + ' #banner-div-' + bannerDivSliced + ' .banner-url input').prop('required', true);

}

function hideRedirect(input) {
    var fieldset = $(input).parent().parent().parent().parent().parent().parent().parent().attr('id');
    var bannerDiv = $(input).parent().parent().parent().parent().parent().attr('id');

    var bannerDivSliced = bannerDiv.slice(-2);
    if (bannerDivSliced.includes('-')) {
        var bannerDivSliced = bannerDiv.slice(-1)
    }

    $('#' + fieldset + ' #banner-div-' + bannerDivSliced + ' .banner-url').hide();
    $('#' + fieldset + ' #banner-div-' + bannerDivSliced + ' .banner-url input').prop('required', false);
    $('#' + fieldset + ' #banner-div-' + bannerDivSliced + ' .banner-url input').val('');

}