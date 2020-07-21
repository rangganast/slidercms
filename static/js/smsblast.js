$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('a#smsBlast').addClass('active');

    $('#contactGroupFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Grup Kontak...',
    });

    $('#sentFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Status...',
    });
});

// DATATABLES
table = $('#smsTable').DataTable({
    bInfo: false,
    aaSorting: [],
    responsive: true,
    dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/smsblast/add_smsblast"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>SMS Blast</button></a></div>');