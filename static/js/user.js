table = $('#userTable').DataTable({
    bInfo : false,
    ordering : [[ 0, "asc" ]],
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
})

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/user/add_user"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pengguna</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

function deleteUser(input) {
    var pk = $(input).attr('id');
    Swal.fire({
        title: 'Hapus Pengguna',
        icon: 'info',
        html: 'Anda yakin akan menghapus pengguna ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Ya',
        confirmButtonClass: 'btn btn-danger',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_user_delete_' + pk).submit();
        };
    });
};