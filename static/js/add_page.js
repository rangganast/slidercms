function clonePage(selector){

    var newElement = $(selector).clone(true, true);
    var totalPage = $('#id_page-TOTAL_FORMS').val();
    var totalPage = Number(totalPage);

    newElement.find('legend').html('Halaman ke-' + (totalPage+1));

    newElement.find('#id_page-' + (totalPage - 1) + '-name').attr('id', 'id_page-' + totalPage + '-name')
    newElement.find('#id_page-' + totalPage + '-name').attr('name', 'page-' + totalPage + '-name')

    $(selector).after(newElement);
    $('#id_page-TOTAL_FORMS').val(totalPage + 1);

}