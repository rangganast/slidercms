$(document).on("click", ".open-imgModal", function () {
    var imageURL = $(this).data('url');
    $('#imgModal').find('img').attr('src', imageURL);
    $('#imgModal').modal('handleUpdate')
});


table = $('#pageTable').DataTable({
    bInfo : false,
    ordering : [[ 0, "asc" ]],
    responsive : true,
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/page/add_page"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Halaman</button></a></div>');

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
});

$('#active_filter').change(function () {
    activeFilter();
    table.draw();
});

$('#resetFilter').click(function(){
    $('#myInputTextField').val('');
    $('#app_filter').val('').trigger('change');
    $('#page_filter').val('').trigger('change');
    $('#page_filter').prop('disabled', true);
    $('#active_filter').val('').trigger('change');

    $.fn.dataTable.ext.search = [];
    table.destroy()

    table = $('#pageTable').DataTable({
        bInfo: false,
        ordering: [
            [0, "asc"]
        ],
        responsive: true,
        dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
    })

    $("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/page/add_page"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Halaman</button></a></div>');

    table.draw();
})

function active(input) {
    var inputId = $(input).attr('id');
    var pk = inputId.slice(-1);

    if(pk.includes('-')) {
        var pk = inputId.slice(-2);
    }

    var index = inputId.slice(7, 9);
    if(index.includes('-')) {
        var index = inputId.slice(7, 8);
    }

    var value = $(input).attr('value');

    if (value == 'True') {
        Swal.fire({
            title: 'Non-aktivasi Lokasi',
            icon: 'info',
            html: 'Anda yakin ingin menonaktifkan pemasangan banner ini?',
            showCancelButton: true,
            showCloseButton: true,
            focusConfirm: false,
            cancelButtonText: 'Tidak',
            cancelButtonClass: 'btn btn-secondary',
            confirmButtonText: 'Ya',
            confirmButtonClass: 'btn btn-danger',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                $('#switch-form-' + index + '-' + pk).submit();
            } else {
                if ($('#switch-' + index + '-' + pk + ':checked').length > 0) {
                    $('#switch-' + index + '-' + pk).prop('checked', false)
                } else {
                    $('#switch-' + index + '-' + pk).prop('checked', true)
                }
            }
        });

    } else {
        Swal.fire({
            title: 'Aktivasi Lokasi',
            icon: 'info',
            html: 'Anda yakin ingin mengaktifkan pemasangan banner ini?',
            showCancelButton: true,
            showCloseButton: true,
            focusConfirm: false,
            cancelButtonText: 'Tidak',
            cancelButtonClass: 'btn btn-secondary',
            confirmButtonText: 'Ya',
            confirmButtonClass: 'btn btn-danger',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                $('#switch-form-' + index + '-' + pk).submit();
            } else {
                if ($('#switch-' + index + '-' + pk + ':checked').length > 0) {
                    $('#switch-' + index + '-' + pk).prop('checked', false)
                } else {
                    $('#switch-' + index + '-' + pk).prop('checked', true)
                }
            }
        });

    }

};

function archive(input) {
    var pk = $(input).attr('id').split('-')[0];
    Swal.fire({
        title: 'Archive',
        icon: 'info',
        html: 'Anda yakin ingin meng-archive halaman ini?',
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
            $('#form_page_archive_' + pk).submit();
        };
    });
};

function unarchive(input) {
    var pk = $(input).attr('id').split('-')[0];
    Swal.fire({
        title: 'Unarchive',
        icon: 'info',
        html: 'Anda yakin ingin meng-unarchive halaman ini?',
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
            $('#form_page_archive_' + pk).submit();
        };
    });
};

function deletePage(input) {
    var pk = $(input).attr('id').split('-')[0];
    Swal.fire({
        title: 'Hapus',
        icon: 'info',
        html: 'Anda yakin ingin menghapus halaman ini?',
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
            $('#form_page_delete_' + pk).submit();
        };
    });
};

function activeFilter(){
    var value = $('#active_filter').find('option:selected').val();
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if(value == 'checked'){
                var status = false;
                var maxSwitch = table.cell(dataIndex, 5).nodes().to$().find('input[type="checkbox"]').length;
                for (var j = 0; j < maxSwitch; j++) {
                    if (table.cell(dataIndex, 5).nodes().to$().find('input[type="checkbox"]').eq(j).val() == 'True') {
                        var status = true;
                    }
                }
                return status;
            }else{
                var status = false;
                var maxSwitch = table.cell(dataIndex, 5).nodes().to$().find('input[type="checkbox"]').length;
                for (var j = 0; j < maxSwitch; j++) {
                    if (table.cell(dataIndex, 5).nodes().to$().find('input[type="checkbox"]').eq(j).val() == 'False') {
                        var status = true;
                    }
                }
                return status;
            }
        }
    )

}