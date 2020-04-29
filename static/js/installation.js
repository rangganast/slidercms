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

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
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
            confirmButtonClass: 'btn btn-danger',
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
            confirmButtonClass: 'btn btn-danger',
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
