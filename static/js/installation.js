$(document).ready(function () {
    // $('a#sliderManagement').addClass('active');
    $('a#installManagement').addClass('active');

    $('#createDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        }
    });

    $('#updateDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        }
    })
    $('#validDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        }
    })

    $('#app_filter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Aplikasi',
    });

    $('#page_filter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Halaman',
    });

});

$(document).on("click", ".open-imgModal", function () {
    var imageURL = $(this).data('url');
    $('#imgModal').find('img').attr('src', imageURL);
    $('#imgModal').modal('handleUpdate')
});

// DATATABLES
table = $('#pageTable').DataTable({
    bInfo : false,
    sScrollX: true,
    ordering : [
        [ 0, "asc" ],
        [ 5, "asc" ],
    ],
    responsive : true,
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');
// DATATABLES


// DATE FILTERS
$('#createDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('#createDateFilter').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});

$('#updateDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('#updateDateFilter').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});

$('#validDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    table.column(9).search(picker.startDate.format('DD/MM/YYYY') + ' s/d ' + picker.endDate.format('DD/MM/YYYY')).draw();
});

$('#validDateFilter').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});
// DATE FILTERS


$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});


$('#app_filter').change(function () {
    var appname = $('#app_filter option:selected').text().toLowerCase();
    var regex = '\\b' + appname + '\\b';
    table.column(1).search(regex, true, false).draw();
});


$('#page_filter').change(function () {
    var appname = $('#app_filter option:selected').text().toLowerCase();
    var pagename = $(this).find('option:selected').text().toLowerCase();
    var app_regex = '\\b' + appname + '\\b';
    var page_regex = '\\b' + pagename + '\\b';

    table.column(1).search(app_regex, true, false).draw();
    table.column(2).search(page_regex, true, false).draw();
})

function active(input) {
    var pk = $(input).attr('id');
    var pk = pk.slice(-1);
    var value = $(input).attr('value');

    if (value == 'True') {
        Swal.fire({
            title: 'Nonaktivasi Pemasangan Banner',
            icon: 'info',
            html: 'Anda yakin ingin menonaktifkan pemasangan banner ini?',
            showCancelButton: true,
            showCloseButton: true,
            focusConfirm: false,
            cancelButtonText: 'Tidak',
            cancelButtonClass: 'btn btn-secondary',
            confirmButtonText: 'Ya',
            confirmButtonClass: 'btn btn-primary',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                $('#switch-form-' + pk).submit();
            }else{
                if ($('#switch-' + pk + ':checked').length > 0) {
                    $('#switch-' + pk).prop('checked', false)
                }else{
                    $('#switch-' + pk).prop('checked', true)
                }
            }
        });
        
    }else{
        Swal.fire({
            title: 'Aktivasi Pemasangan Banner',
            icon: 'info',
            html: 'Anda yakin ingin mengaktifkan pemasangan banner ini?',
            showCancelButton: true,
            showCloseButton: true,
            focusConfirm: false,
            cancelButtonText: 'Tidak',
            cancelButtonClass: 'btn btn-secondary',
            confirmButtonText: 'Ya',
            confirmButtonClass: 'btn btn-primary',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                $('#switch-form-' + pk).submit();
            }else{
                if ($('#switch-' + pk + ':checked').length > 0) {
                    $('#switch-' + pk).prop('checked', false)
                }else{
                    $('#switch-' + pk).prop('checked', true)
                }
            }
        });

    }

};

function deleteInstall(input) {
    var pk = $(input).attr('id');
    Swal.fire({
        title: 'Hapus',
        icon: 'info',
        html: 'Anda yakin ingin menghapus Pemasangan ini?',
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
            $('#form_install_delete_' + pk).submit();
        };
    });
};