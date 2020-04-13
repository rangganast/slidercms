$(document).on("click", ".open-imgModal", function () {
    var imageURL = $(this).data('url');
    $('#imgModal').find('img').attr('src', imageURL);
    $('#imgModal').modal('handleUpdate')
});

table = $('#pageTable').DataTable({
    bInfo : false,
    ordering : [[ 0, "asc" ]],
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
})

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/page/add_page"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Halaman</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
})