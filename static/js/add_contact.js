$(document).ready(function() {
    $('#id_source').select2({
        theme: 'bootstrap4',
        placeholder: 'Pilih cara mendapatkan sumber kontak',
    });
});

$('#id_source').change(function () {
    var source = $(this).find('option:selected').val()

    if(source === 'random') {
        $('fieldset:not(#random-generate)').hide();
        $('fieldset#random-generate').show();
        $('#saveBtnDiv').show();
    }else if(source === 'csv') {
        $('fieldset:not(#csv-generate)').hide();
        $('fieldset#csv-generate').show();
        $('#saveBtnDiv').show();
    }
})