$(document).ready(function () {
    $('fieldset:last').remove();
    $('.location-div:last').remove();
})

function clonePage(selector){

    var newElement = $(selector).clone(true, true);
    var totalPage = $('#id_page-TOTAL_FORMS').val();
    var totalPage = Number(totalPage);
    
    newElement.attr('id', 'id_page-' + totalPage + '-fieldset');

    newElement.find('legend').html('Halaman ke-' + (totalPage + 1));

    newElement.find('#id_page-' + (totalPage - 1) + '-name').attr('id', 'id_page-' + totalPage + '-name');
    newElement.find('#id_page-' + totalPage + '-name').attr('name', 'page-' + totalPage + '-name');

    var forLabel = 'id_page-' + (totalPage - 1) + '-name'
    newElement.find('label[for="' + forLabel + '"]').attr('for', 'id_page-' + totalPage + '-name');
    
    newElement.find('#id_page-' + (totalPage - 1) + '-min').attr('id', 'id_page-' + totalPage + '-min');
    newElement.find('#id_page-' + totalPage + '-min').attr('name', 'page-' + totalPage + '-min');

    newElement.find('#id_page-' + (totalPage - 1) + '-max').attr('id', 'id_page-' + totalPage + '-max');
    newElement.find('#id_page-' + totalPage + '-max').attr('name', 'page-' + totalPage + '-max');
    
    newElement.find('#id_location-add-' + (totalPage - 1)).attr('id', 'id_location-add-' + totalPage);
    newElement.find('#id_location-delete-' + (totalPage - 1)).attr('id', 'id_location-delete-' + totalPage).hide();

    newElement.find('.location-div').not(':first').remove();

    $(selector).after(newElement);

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

     

    $('fieldset').each(function (index) {
        var min_child = $(this).find('.location-name:first input').attr("name").slice(9, 11);

        if (min_child.includes('-')) {
            var min_child = $(this).find('.location-name:first input').attr("name").slice(9, 10);
        }

        $(this).find('#id_page-' + index + '-min').val(min_child);

        var max_child = $(this).find('.location-name:last input').attr("name").slice(9, 11);
        if (max_child.includes('-')) {
            var max_child = $(this).find('.location-name:last input').attr("name").slice(9, 10);
        }

        $(this).find('#id_page-' + index + '-max').val(max_child);
    });

    var totalLocation = $('.location-div').length;
    $('#id_location-TOTAL_FORMS').val(totalLocation);

    totalPage = $('fieldset').length;
    
    if (totalPage > 1) {
        $('#id_page-delete-button').show();
    }

    $('#id_page-TOTAL_FORMS').val(totalPage);

}

function removePage(selector) {

    $(selector).remove();

    if ($('fieldset').length == 1) {
        $('#id_page-delete-button').hide();
    }

    var totalPage = $('fieldset').length;
    $('#id_page-TOTAL_FORMS').val(totalPage);

}

function cloneLocation(input) {

    var id = $(input).attr("id");
    var id = id.slice(-1);

    var selector = '#id_page-' + id + '-fieldset .location-div:last';

    newElement = $(selector).clone(true, true);
    $(selector).after(newElement);

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



    $('fieldset').each(function (index) {
        var min_child = $(this).find('.location-name:first input').attr("name").slice(9, 11);
        
        if (min_child.includes('-')) {
            var min_child = $(this).find('.location-name:first input').attr("name").slice(9, 10);
            console.log(min_child)
        }

        $(this).find('#id_page-' + index + '-min').val(min_child);

        var max_child = $(this).find('.location-name:last input').attr("name").slice(9, 11);
        if (max_child.includes('-')) {
            var max_child = $(this).find('.location-name:last input').attr("name").slice(9, 10);
        }

        $(this).find('#id_page-' + index + '-max').val(max_child);
    });

    var totalLocationFieldset = $('#id_page-' + id + '-fieldset .location-div').length;

    if (totalLocationFieldset > 1) {
        $('#id_location-delete-' + id).show();
    }

    var totalLocation = $('.location-div').length;

    $('#id_location-TOTAL_FORMS').val(totalLocation);

}

function removeLocation(input) {
    
    var id = $(input).attr("id");
    var id = id.slice(-1);

    var selector = '#id_page-' + id + '-fieldset .location-div:last';
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


    
    $('fieldset').each(function (index) {
        var min_child = $(this).find('.location-name:first input').attr("name").slice(9, 11);

        if (min_child.includes('-')) {
            var min_child = $(this).find('.location-name:first input').attr("name").slice(9, 10);
        }

        $(this).find('#id_page-' + index + '-min').val(min_child);

        var max_child = $(this).find('.location-name:last input').attr("name").slice(9, 11);
        if (max_child.includes('-')) {
            var max_child = $(this).find('.location-name:last input').attr("name").slice(9, 10);
        }

        $(this).find('#id_page-' + index + '-max').val(max_child);
    });

    if ($('#id_page-' + id + '-fieldset').find('.location-div').length == 1) {
        $('#id_location-delete-' + id).hide();
    }

    var totalLocation = $('.location-div').length;

    $('#id_location-TOTAL_FORMS').val(totalLocation);

}