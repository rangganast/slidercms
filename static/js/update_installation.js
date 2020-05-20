$(document).ready(function () {
    $('#id_campaign-0-daterangepicker').daterangepicker({
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY'
        }
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

    if($('#id_priority-value').val() == '0'){
        $('#id_campaign-0-priority').prop('disabled', true)
        $('#id_campaign-0-daterangepicker').prop('disabled', true)
    }
});

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
            'value': value,
        },
        success: function (data) {
            if (data == 'True') {
                $('#id_campaign-priority-warning-' + id).show()
            } else {
                $('#id_campaign-priority-warning-' + id).hide()
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

    $.ajax({
        url: url,
        data: {
            'banner_id': banner_id
        },
        success: function (data) {
            // var imageUrl = 'http://127.0.0.1:8000' + data;
            var imageUrl = 'https://banner-slider-qa.holahalo.dev' + data;
            $('#img-' + id).attr('src', imageUrl);
        }
    });
}

function cloneBanner() {
    var total = $('#id_installation-TOTAL_FORMS').val();
    var total = Number(total);

    var selector = '.banner-div:last';

    var originalRadio = $(selector).find('input:checked');
    $(selector).find('.banner-select').select2('destroy');

    newElement = $(selector).clone(true, true);
    
    newElement.show();

    newElement.attr('id', 'banner-div-' + total);

    newElement.find('#id_installation-' + (total - 1) + '-id').attr('name', 'installation-' + total + '-id');
    newElement.find('#id_installation-' + (total - 1) + '-id').attr('id', 'id_installation-' + total + '-id');

    newElement.find('#id_installation-' + (total - 1) + '-banner_names').attr('name', 'installation-' + total + '-banner_names');
    newElement.find('#id_installation-' + (total - 1) + '-banner_names').attr('id', 'id_installation-' + total + '-banner_names');

    newElement.find('#id_installation-' + (total - 1) + '-redirect').attr('name', 'installation-' + total + '-redirect');
    newElement.find('#id_installation-' + (total - 1) + '-redirect').attr('id', 'id_installation-' + total + '-redirect');

    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_0').attr('name', 'banner-' + total + '-is_redirect');
    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_0').attr('id', 'id_banner-' + total + '-is_redirect_0');

    newElement.find('#id_banner-' + (total - 1) + '-is_redirect_1').attr('name', 'banner-' + total + '-is_redirect');
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
        $('.delete-btn:first').show();
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
    if ($('#id_installation-' + id + '-DELETE').length > 0) {
        $('#id_installation-' + id + '-DELETE').prop('checked', true);
        $(selector).hide();

        var total_forms = $('.banner-div:visible').length;

        if (total_forms == 1) {
            $('.delete-btn:first').hide();
        }
    }else{
        $(selector).remove();
        var total_forms = $('.banner-div:visible').length;

        if(total_forms == 1){
            $('.delete-btn:first').hide();
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