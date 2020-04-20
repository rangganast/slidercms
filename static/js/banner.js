$(document).on("click", ".open-imgModal", function () {
    var imageURL = $(this).data('url');
    $('#imgModal').find('img').attr('src', imageURL);
    $('#imgModal').modal('handleUpdate');
});

table = $('#bannerTable').DataTable({
    bInfo : false,
    ordering : [[ 0, "asc" ]],
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
})

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/banner/add_banner"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Banner</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

function archive(input) {
    var pk = $(input).attr('id');
    Swal.fire({
        title: 'Archive',
        icon: 'info',
        html: 'Anda yakin ingin meng-archive banner ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Archive',
        confirmButtonClass: 'btn btn-danger',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_banner_archive_' + pk).submit();
        };
    });
};

function unarchive(input) {
    var pk = $(input).attr('id');
    Swal.fire({
        title: 'Unarchive',
        icon: 'info',
        html: 'Anda yakin ingin meng-unarchive banner ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Unarchive',
        confirmButtonClass: 'btn btn-danger',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_banner_archive_' + pk).submit();
        };
    });
};