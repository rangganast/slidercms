$(document).ready(function () {
    $('#sliderManagement').addClass('menu-open');
    $('a#installManagement').addClass('active');

    $('#id_campaign-0-daterangepicker').daterangepicker({
        minDate: new Date(),
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

    $('.banner-select').each(function (){
        var thisId = $(this).attr('id');
        $('.banner-select:not(#' + thisId + ')').each(function () {
            var value = $(this).find('option:selected').val();
            $('#' + thisId).find('option[value="' + value + '"]').prop('disabled', true);
        });
    });
    
    $('#app_select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih aplikasi',
    });
    $('#page_select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih halaman',
    });
    $('.location-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih lokasi',
    });
    $('.banner-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih banner',
    });

    $('#id_campaign-0-campaign_code').prop('disabled', false);
    $('#id_campaign-0-priority').prop('disabled', false);
    $('#id_campaign-0-daterangepicker').prop('disabled', false);
    $('.banner-select').prop('disabled', false);

    if($('.banner-div').length > 1){
        if($('#location-is_slider').val() == 'True') {
            $('.delete-btn').hide();
        }
    }else{
        $('.delete-btn').hide();
    }

    if($('#id_priority-value').val() == '0') {
        if($('#location-is_slider').val() == 'True') {
            $('#id_banner-add-0').click();
            $('.delete-btn').hide();
        }

        $('#id_campaign-0-priority').prop('disabled', true)
        $('#id_campaign-0-daterangepicker').prop('disabled', true)
    }
});

function check_campaign_code_available(input) {
    var url = $('#installationForm').attr("data-check-campaign_code-url");
    var id = $(input).attr('id').slice(12, 14);
    var value = $(input).val();
    var default_value = $('#id_campaign_code-value').val()

    if (id.includes('-')) {
        var id = $(input).attr('id').slice(12, 13);
    }

    var loc_id = $('#id_location-select-' + id + ' option:selected').val();

    $.ajax({
        url: url,
        data: {
            'loc_id': loc_id,
            'value': value,
            'default_value': default_value,
        },
        success: function (data) {
            if (data == 'True') {
                $('#id_campaign-code-warning-' + id).show();
                $('button[type="submit"]').prop('disabled', true);
            } else {
                $('#id_campaign-code-warning-' + id).hide();
                $('button[type="submit"]').prop('disabled', false);
            }
        }
    });
}

function check_priority_available(input) {
    var url = $('#installationForm').attr("data-check-priority-url");
    var id = $(input).attr('id').slice(12, 14);
    var value = $(input).val();
    var default_value = $('#id_priority-value').val()

    if (id.includes('-')) {
        var id = $(input).attr('id').slice(12, 13);
    }

    var loc_id = $('#id_location-select-' + id + ' option:selected').val();

    $.ajax({
        url: url,
        data: {
            'loc_id': loc_id,
            'value': value,
            'default_value': default_value,
        },
        success: function (data) {
            if (data == 'True') {
                $('#id_campaign-priority-warning-' + id).show();
                $('button[type="submit"]').prop('disabled', true);
            } else {
                $('#id_campaign-priority-warning-' + id).hide();
                $('button[type="submit"]').prop('disabled', false);
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
        $('.banner-select:not(#' + $(input).attr('id') + ')').each(function () {
            $(this).find('option[value="' + banner_id + '"]').attr('disabled', true);

            if (prev !== '') {
                $(this).find('option[value="' + prev + '"]').attr('disabled', false);
            }
        });
    }
}

function cloneBanner() {
    var total = $('#id_installation-TOTAL_FORMS').val();
    var total = Number(total);

    var selector = '.banner-div:last';

    var originalRadio = $(selector).find('input:checked');
    var originalOption = $(selector).find('option:selected').val();

    $(selector).find('.banner-select').select2('destroy');

    newElement = $(selector).clone(true, true);
    
    newElement.show();

    newElement.attr('id', 'banner-div-' + total);

    newElement.find('#id_installation-' + (total - 1) + '-id').attr('name', 'installation-' + total + '-id');
    newElement.find('#id_installation-' + (total - 1) + '-id').attr('id', 'id_installation-' + total + '-id');

    newElement.find('#id_installation-' + (total - 1) + '-banner_names').attr('name', 'installation-' + total + '-banner_names');
    newElement.find('#id_installation-' + (total - 1) + '-banner_names').find('option[value="' + originalOption + '"]').prop('disabled', true);
    newElement.find('#id_installation-' + (total - 1) + '-banner_names').val('');
    newElement.find('#id_installation-' + (total - 1) + '-banner_names').attr('id', 'id_installation-' + total + '-banner_names');

    newElement.find('#id_installation-' + (total - 1) + '-redirect').attr('name', 'installation-' + total + '-redirect');
    newElement.find('#id_installation-' + (total - 1) + '-redirect').val('');
    newElement.find('#id_installation-' + (total - 1) + '-redirect').attr('id', 'id_installation-' + total + '-redirect');

    newElement.find('#id_banner-size-' + (total - 1)).html('');
    newElement.find('#id_banner-size-' + (total - 1)).attr('id', 'id_banner-size-' + total);
    newElement.find('#id_banner-previous-value-' + (total - 1)).attr('id', 'id_banner-previous-value-' + total);

    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_0').attr('name', 'banner-' + total + '-is_redirect');
    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_0').prop('checked', false);
    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_0').attr('id', 'id_banner-' + total + '-is_redirect_0');

    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_1').attr('name', 'banner-' + total + '-is_redirect');
    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_1').prop('checked', true);
    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_1').attr('id', 'id_banner-' + total + '-is_redirect_1');

    newElement.find('.redirect-toggle label:first').attr('for', 'id_banner-' + total + '-is_redirect_0')
    newElement.find('.redirect-toggle label:nth-child(2)').find('label').attr('for', 'id_banner-' + total + '-is_redirect_0')
    newElement.find('.redirect-toggle label:nth-child(3)').find('label').attr('for', 'id_banner-' + total + '-is_redirect_1')
    
    newElement.find('#id_banner-delete-' + (total - 1)).attr('id', 'id_banner-delete-' + total);

    newElement.find('#img-' + (total - 1)).attr('id', 'img-' + total);

    newElement.find('img').attr('src', '')

    newElement.find('input[type="checkbox"]').remove();

    newElement.find('input[type="hidden"]').val('');

    $(selector).after(newElement);

    $('.banner-select').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih banner',
    });

    if (originalRadio.length == 1) {
        originalRadio.prop('checked', true)
    }

    total_forms = $('.banner-div').length;

    if (total_forms > 1) {
        $('.delete-btn').show();
    }

    $('#id_installation-TOTAL_FORMS').val(total_forms);
}

function removeBanner(input) {
    var inputId = $(input).attr("id");
    var id = inputId.slice(-2);
    
    if(inputId.includes('-')) {
        var id = inputId.slice(-1);
    }
    
    var selector = '#banner-div-' + id;

    var originalOption = $(selector).find('select > option:selected').val();

    $('.banner-div:not(' + selector + ')').each(function(){
        $(this).find('select > option[value="' + originalOption + '"]').prop('disabled', false);
    });

    if ($('#id_installation-' + id + '-DELETE').length > 0) {
        $('#id_installation-' + id + '-DELETE').prop('checked', true);
        $(selector).hide();

        var total_forms = $('.banner-div:visible').length;

        if ($('#location-is_slider').val() == 'True') {
            if (total_forms == 2) {
                $('.delete-btn').hide();
            }
        } else {
            if (total_forms == 1) {
                $('.delete-btn').hide();
            }
        }
    }else{
        $(selector).remove();
        var total_forms = $('.banner-div:visible').length;

        if($('#location-is_slider').val() == 'True'){
            if(total_forms == 2){
                $('.delete-btn').hide();
            }            
        }else{
            if (total_forms == 1) {
                $('.delete-btn').hide();
            }
        }


        $('#id_installation-TOTAL_FORMS').val(total_forms);

    }

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