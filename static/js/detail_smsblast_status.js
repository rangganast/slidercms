$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('#smsBlastManagement').addClass('menu-open');
    $('a#smsBlast').addClass('active');

    $('#statusFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Status...',
    });
});

// DATATABLES
table = $('#statusTable').DataTable({
    bInfo: false,
    aaSorting: [],
    responsive: true,
    dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

$('#statusFilter').change(function () {
    var status = $(this).find('option:selected').text().toLowerCase();
    var status_regex = '\\b' + status + '\\b';
    
    table.column(2).search(status_regex, true, false).draw();
});

$('#resetFilter').click(function () {
    $('#myInputTextField').val('');
    $('#statusFilter').val('').trigger('change');

    $.fn.dataTable.ext.search = [];
    table.destroy();

    table = $('#statusTable').DataTable({
        bInfo: false,
        aaSorting: [],
        responsive: true,
        dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
    });

    table.draw();
});
