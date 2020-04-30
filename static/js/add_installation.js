function cloneInstall(selector){
    var originalRadio = $(selector).find('input:checked');

    var newElement = $(selector).clone(true, true);
    var totalInstall = $('fieldset').length;
    
    newElement.attr('id', 'id_install-' + totalInstall + '-fieldset');

    newElement.find('legend').html('Lokasi Pemasangan ke-' + (totalInstall + 1));
    
    newElement.find('#id_location-select-' + (totalInstall - 1)).attr('id', 'id_location-select-' + totalInstall)
    newElement.find('#id_location-select-' + totalInstall).attr('name', 'location-select-' + totalInstall)

    newElement.find('#id_location-size-' + (totalInstall - 1)).attr('id', 'id_location-size-' + totalInstall)
    
    var forLabel = 'id_location-select-' + (totalInstall - 1)
    newElement.find('label[for="' + forLabel + '"]').attr('for', 'id_location-select-' + totalInstall);

    newElement.find('#id_banner-' + (totalInstall - 1) + '-min').attr('id', 'id_banner-' + totalInstall + '-min');
    newElement.find('#id_banner-' + totalInstall + '-min').attr('name', 'banner-' + totalInstall + '-min');

    newElement.find('#id_banner-' + (totalInstall - 1) + '-max').attr('id', 'id_banner-' + totalInstall + '-max');
    newElement.find('#id_banner-' + totalInstall + '-max').attr('name', 'banner-' + totalInstall + '-max');
    
    newElement.find('#id_banner-add-' + (totalInstall - 1)).attr('id', 'id_banner-add-' + totalInstall);
    newElement.find('#id_banner-delete-' + (totalInstall - 1)).attr('id', 'id_banner-delete-' + totalInstall).hide();

    newElement.find('img').attr('src', '');

    newElement.find('small').html('');

    newElement.find('.banner-div').not(':first').remove();

    $(selector).after(newElement);

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

    if (originalRadio.length == 1) {
        originalRadio.prop('checked', true)
    }
    
    totalInstall = $('.banner-div').length;
    
    if (totalInstall > 1) {
        $('#id_install-delete-button').show();
    }

    $('#id_installation-TOTAL_FORMS').val(totalInstall);

    $('#id_installation-TOTAL_FIELDSETS').val($('fieldset').length);

}

function removeInstall(selector) {

    $(selector).remove();

    if ($('fieldset').length == 1) {
        $('#id_install-delete-button').hide();
    }

    var totalInstall = $('.banner-div').length;
    $('#id_installation-TOTAL_FORMS').val(totalInstall);

    $('#id_installation-TOTAL_FIELDSETS').val($('fieldset').length);

}

function cloneBanner(input) {

    var id = $(input).attr("id");
    var id = id.slice(-1);

    var selector = '#id_install-' + id + '-fieldset .banner-div:last';

    var originalRadio = $(selector).find('input:checked');
    
    newElement = $(selector).clone(true, true);

    newElement.find('img').attr('src', '')

    $(selector).after(newElement);

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
    $(selector).remove();

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

    if ($('#id_install-' + id + '-fieldset').find('.banner-div').length == 1) {
        $('#id_banner-delete-' + id).hide();
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