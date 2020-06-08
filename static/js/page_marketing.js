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
})

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
})

$('#app_filter').change(function () {
    var appname = $('#app_filter option:selected').text().toLowerCase();
    var regex = '\\b' + appname + '\\b';
    table.column(1).search(regex, true, false).draw();
})

$('#page_filter').change(function () {
    var appname = $('#app_filter option:selected').text().toLowerCase();
    var pagename = $(this).find('option:selected').text().toLowerCase();
    var app_regex = '\\b' + appname + '\\b';
    var page_regex = '\\b' + pagename + '\\b';
    
    table.column(1).search(app_regex, true, false).draw();
    table.column(2).search(page_regex, true, false).draw();
})

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
    });

    table.draw();
})


function activeFilter() {
    var value = $('#active_filter').find('option:selected').val();
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (value == 'checked') {
                if (table.cell(dataIndex, 5).nodes().to$().find('input[type="checkbox"]').val() == 'True') {
                    return true;
                }else{
                    return false;
                }
            } else {
                if (table.cell(dataIndex, 5).nodes().to$().find('input[type="checkbox"]').val() == 'False') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    )

}

function active(input) {
    var inputId = $(input).attr('id');
    var pk = inputId.slice(-1);

    if(pk.includes('-')) {
        var pk = inputId.slice(-2);
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
                $('#switch-form-' + pk).submit();
            } else {
                if ($('#switch-' + pk + ':checked').length > 0) {
                    $('#switch-' + pk).prop('checked', false)
                } else {
                    $('#switch-' + pk).prop('checked', true)
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
                $('#switch-form-' + pk).submit();
            } else {
                if ($('#switch-' + pk + ':checked').length > 0) {
                    $('#switch-' + pk).prop('checked', false)
                } else {
                    $('#switch-' + pk).prop('checked', true)
                }
            }
        });

    }

};