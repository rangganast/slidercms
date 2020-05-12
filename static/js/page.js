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

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/page/add_page"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Halaman</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
})

$('#app_filter').change(function () {
    var appname = $('#app_filter option:selected').text();
    table.column(1).search(appname).draw();
})

$('#page_filter').change(function () {
    var appname = $('#app_filter option:selected').text();
    var pagename = $(this).find('option:selected').text();
    table.column(1).search(appname).draw();
    table.column(2).search(pagename).draw();
})

function archive(input) {
    var pk = $(input).attr('id');
    console.log(pk);
    Swal.fire({
        title: 'Archive',
        icon: 'info',
        html: 'Anda yakin ingin meng-archive location ini?',
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
            $('#form_page_archive_' + pk).submit();
        };
    });
};

function unarchive(input) {
    var pk = $(input).attr('id');
    Swal.fire({
        title: 'Unarchive',
        icon: 'info',
        html: 'Anda yakin ingin meng-unarchive location ini?',
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
            $('#form_page_archive_' + pk).submit();
        };
    });
};