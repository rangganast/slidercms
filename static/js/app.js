table = $('#appTable').DataTable({
    bInfo : false,
    ordering : [[ 0, "asc" ]],
    responsive : true,
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/app/add_app"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Aplikasi</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

$('#status_filter').change(function () {
    statusFilter();
    table.draw();
});

$('#resetFilter').click(function(){
    $('#myInputTextField').val('');
    $('#status_filter').val('').trigger('change');

    $.fn.dataTable.ext.search = [];
    table.destroy()

    table = $('#appTable').DataTable({
        bInfo: false,
        ordering: [
            [0, "asc"]
        ],
        responsive: true,
        dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
    })

    $("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/app/add_app"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Aplikasi</button></a></div>');

    table.draw();
})

function archive(input) {
    var pk = $(input).attr('id').split('-')[0];
    Swal.fire({
        title: 'Archive',
        icon: 'info',
        html: 'Anda yakin ingin meng-archive aplikasi ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Archive',
        confirmButtonClass: 'btn btn-success',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_app_archive_' + pk).submit();
        };
    });
};

function unarchive(input) {
    var pk = $(input).attr('id').split('-')[0];
    Swal.fire({
        title: 'Unarchive',
        icon: 'info',
        html: 'Anda yakin ingin meng-unarchive aplikasi ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Unarchive',
        confirmButtonClass: 'btn btn-success',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_app_archive_' + pk).submit();
        };
    });
};

function deleteApp(input) {
    var pk = $(input).attr('id').split('-')[0];
    Swal.fire({
        title: 'Hapus',
        icon: 'info',
        html: 'Anda yakin ingin menghapus aplikasi ini?',
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
            $('#form_app_delete_' + pk).submit();
        };
    });
};

function statusFilter(){
    var value = $('#status_filter').find('option:selected').val();
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (value == 'active') {
                if (table.cell(dataIndex, 3).nodes().to$().find('button.btn-archive').is(':disabled') == true) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (table.cell(dataIndex, 3).nodes().to$().find('button.btn-archive').is(':disabled') == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    )

}