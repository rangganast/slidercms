function clonePage(selector){
    var originalRadio = $(selector).find('input:checked');

    var newElement = $(selector).clone(true, true);
    var totalPage = $('#id_page-TOTAL_FORMS').val();
    var totalPage = Number(totalPage);
    
    newElement.attr('id', 'id_page-' + totalPage + '-fieldset');

    newElement.find('legend').html('Halaman ke-' + (totalPage + 1));

    newElement.find('input:checked').prop('checked', false);

    newElement.find('#id_page-' + (totalPage - 1) + '-name').attr('id', 'id_page-' + totalPage + '-name');
    newElement.find('#id_page-' + totalPage + '-name').attr('name', 'page-' + totalPage + '-name');
    newElement.find('#id_page-' + totalPage + '-name').val('');

    newElement.find('#id_location-' + (totalPage-1) + '-is_slider_0').val('');
    newElement.find('#id_location-' + (totalPage-1) + '-is_slider_0').prop('disabled', true);
    newElement.find('#id_location-' + (totalPage-1) + '-is_slider_1').val('');
    newElement.find('#id_location-' + (totalPage - 1) + '-is_slider_1').prop('disabled', true);
    newElement.find('#id_location-' + (totalPage-1) + '-name').val('');
    newElement.find('#id_location-' + (totalPage - 1) + '-name').prop('disabled', true);
    newElement.find('#id_location-' + (totalPage-1) + '-width').val('');
    newElement.find('#id_location-' + (totalPage - 1) + '-width').prop('disabled', true);
    newElement.find('#id_location-' + (totalPage-1) + '-height').val('');
    newElement.find('#id_location-' + (totalPage - 1) + '-height').prop('disabled', true);

    var forLabel = 'id_page-' + (totalPage - 1) + '-name'
    newElement.find('label[for="' + forLabel + '"]').attr('for', 'id_page-' + totalPage + '-name');
    
    newElement.find('#id_page-' + (totalPage - 1) + '-min').attr('id', 'id_page-' + totalPage + '-min');
    newElement.find('#id_page-' + totalPage + '-min').attr('name', 'page-' + totalPage + '-min');
    newElement.find('#id_page-' + totalPage + '-min').val('');

    newElement.find('#id_page-' + (totalPage - 1) + '-max').attr('id', 'id_page-' + totalPage + '-max');
    newElement.find('#id_page-' + totalPage + '-max').attr('name', 'page-' + totalPage + '-max');
    
    newElement.find('#id_warning-text-page-' + (totalPage - 1)).attr('id', 'id_warning-text-page-' + totalPage);
    newElement.find('#id_warning-text-page-' + totalPage).hide();
    
    newElement.find('#id_warning-text-location-' + (totalPage - 1)).attr('id', 'id_warning-text-location-' + totalPage);
    newElement.find('#id_warning-text-location-' + totalPage).hide();
    
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

    $('.location-name').find('small').each(function (index) {
        $(this).attr("id", "id_warning-text-location-" + index);
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

    if (originalRadio.length == 1) {
        originalRadio.prop('checked', true)
    }

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
    
    var totalPage = $('fieldset').length;
    $('#id_page-TOTAL_FORMS').val(totalPage);
}

function cloneLocation(input) {

    var id = $(input).attr("id");
    var id = id.slice(-1);

    var selector = '#id_page-' + id + '-fieldset .location-div:last';

    var originalRadio = $(selector).find('input:checked');

    newElement = $(selector).clone(true, true);

    newElement.find('input:checked').prop('checked', false);
    newElement.find('input').val('');

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

    $('.location-name').find('small').each(function (index) {
        $(this).attr("id", "id_warning-text-location-" + index);
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

    if (originalRadio.length == 1) {
        originalRadio.prop('checked', true)
    }

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

    $('.location-name').find('small').each(function (index) {
        $(this).attr("id", "id_warning-text-location-" + index);
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

// function checkSimilarLocation(input) {
//     var url = $('#pageForm').attr("data-check-similar-location-url");
//     var value = $(input).val();
//     var fieldset = $(input).parent().parent().parent().parent().parent();

//     var fieldId = fieldset.attr('id').slice(8, 10)

//     if(fieldId.includes('-')) {
//        var fieldId = fieldset.attr('id').slice(8, 9);
//     }

//     var page_value = $('#id_page-' + fieldId + '-name')
//     var app_value = $('#id_names').val();

//     var inputId = $(input).attr('id');
//     var id = inputId.slice(12, 14);

//     if (id.includes('-')) {
//         var id = inputId.slice(12, 13);
//     }

//     $.ajax({
//         url: url,
//         data: {
//             'value': value,
//             //'page_value' : page_value,
//             //'app_value' : app_value,
//         },
//         success: function (data) {
//             if (data == 'True') {
//                 if ($('.location-name-input:not(#' + inputId + ')').length > 0) {
//                     $('.location-name-input:not(#' + inputId + ')').each(function () {
//                         if ($(this).val() == value) {
//                             $('#id_warning-text-location-' + id).show();
//                             $('#submitAddPage').prop('disabled', true);
//                             return false;
//                         } else {
//                             $('#id_warning-text-location-' + id).hide();
//                             $('#submitAddPage').prop('disabled', false);
//                         }
//                     });
//                 } else {
//                     $('#id_warning-text-location-' + id).hide();
//                     $('#submitAddPage').prop('disabled', false);
//                 }
//             } else {
//                 $('#id_warning-text-location-' + id).show();
//                 $('#submitAddPage').prop('disabled', true);
//             }
//         }
//     });
// }

function checkSimilarPage(input) {

    var url = $('#pageForm').attr("data-check-similar-page-url");
    var value = $(input).val();
    var app_value = $('#id_names').val();

    var inputId = $(input).attr('id')
    var id = inputId.slice(8, 10);

    if (id.includes('-')) {
        var id = inputId.slice(8, 9);
    }

    if (value != '') {
        $('#id_page-' + id + '-fieldset').find('input:not(#' + inputId + ')').prop('disabled', false);
    } else {
        $('#id_page-' + id + '-fieldset').find('input:not(#' + inputId + ')').prop('disabled', true);
    }

    $.ajax({
        url: url,
        data: {
            'value': value,
            'app_value': app_value,
        },
        success: function (data) {
            if (data == 'True') {
                if ($('.page-name:not(#' + inputId + ')').length > 0) {
                    $('.page-name:not(#' + inputId + ')').each(function () {
                        if ($(this).val() == value) {
                            $('#id_warning-text-page-' + id).show();
                            $('#submitAddPage').prop('disabled', true);
                            return false;
                        } else {
                            $('#id_warning-text-page-' + id).hide();
                            $('#submitAddPage').prop('disabled', false);
                        }
                    });
                } else {
                    $('#id_warning-text-page-' + id).hide();
                    $('#submitAddPage').prop('disabled', false);
                }

            } else {
                $('#id_warning-text-page-' + id).show();
                $('#submitAddPage').prop('disabled', true);
            }
        }
    });

}