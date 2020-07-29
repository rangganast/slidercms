$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('#smsBlastManagement').addClass('menu-open');
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

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

$('#contactSourceFilter').change(function () {
    var source = $(this).find('option:selected').text().toLowerCase();
    var source_id = $(this).find('option:selected').val();
    var regex = '\\b' + source + '\\b';
    var url = $('#filterDiv').attr('data-contact-url')
    
    if (source) {
        $.ajax({
            url: url,
            data: {
                'source': source_id,
            },
            success: function (data) {
                $("#contactGroupFilter").html(data);
                $("#contactGroupFilter").prop('disabled', false);
            }
        });
    }

    table.column(2).search(regex, true, false).draw();
});

$('#contactGroupFilter').change(function () {
    var group = $(this).find('option:selected').text().toLowerCase();
    var source = $('#contactSourceFilter').find('option:selected').text().toLowerCase();

    var group_regex = '\\b' + group + '\\b';
    var source_regex = '\\b' + source + '\\b';

    table.column(1).search(group_regex, true, false).draw();
    table.column(2).search(source_regex, true, false).draw();
});

$('#resetFilter').click(function () {
    $('#myInputTextField').val('');
    $('#contactSourceFilter').val('').trigger('change');
    $('#contactGroupFilter').val('').trigger('change');
    $('#contactGroupFilter').prop('disabled', true);

    $.fn.dataTable.ext.search = [];
    table.destroy();

    table = $('#contactTable').DataTable({
        bInfo: false,
        aaSorting: [],
        responsive: true,
        dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
    });

    $("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');

    table.draw();
});

function deleteContact(input) {
    var id = $(input).attr('id').split('-')[1];

    Swal.fire({
        title: 'Hapus',
        icon: 'info',
        html: 'Anda yakin ingin menghapus Grup Kontak ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Hapus',
        confirmButtonClass: 'btn btn-danger',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_contact_delete-' + id).submit();
        };
    });
};