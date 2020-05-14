oTable = $('#keywordTable').DataTable({
    bInfo: false,
    order: [
        [1, "desc"],
    ],
});
$('#myInputTextField').keyup(function () {
    oTable.search($(this).val()).draw();
})
$('#resetFilter').click(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var urlParam = urlParams.get('date1');

    if (urlParam) {
        window.location.href = "/keywords/";
    } else {
        oTable.search('').draw();
        $('#myInputTextField').val('');
        $('#datepicker1').val('');
        $('#datepicker2').val('');
    }
})