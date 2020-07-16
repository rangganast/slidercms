$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('a#contactManagement').addClass('active');
    
    $('#contactSourceFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Sumber Kontak...',
    });

    $('#contactGroupFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Grup Kontak...',
    });
});

// DATATABLES
table = $('#contactTable').DataTable({
    bInfo: false,
    aaSorting: [],
    responsive: true,
    dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/smsblast/add_contact"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Kontak</button></a></div>');