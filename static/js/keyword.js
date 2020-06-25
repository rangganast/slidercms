$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('a#keywordCounter').addClass('active');

    $('#app_filter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Aplikasi',
    });

    $('#datepicker1').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd-mm-yyyy',
    });
    $('#datepicker2').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd-mm-yyyy',
        disableDates: function (date) {
            var date1 = $('#datepicker1').val();
            var date1 = date1.slice(6, 10) + '-' + date1.slice(3, 5) + '-' +
                date1.slice(0, 2)
            const currentDate = new Date(date1).setHours(0, 0, 0, 0);
            return date.setHours(0, 0, 0, 0) >= currentDate ? true : false;
        }
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
})

table = $('#keywordTable').DataTable({
    bInfo: false,
    aaSorting: [],
    dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href=""><button class="btn btn-success float-right"><i class="fas fa-file-excel mr-2"></i>Export Excel</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

$('#resetFilter').click(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var urlParam = urlParams.get('date1');

    if (urlParam) {
        window.location.href = "/keywords";
    } else {
        table.search('').draw();
        $('#myInputTextField').val('');
        $('#datepicker1').val('');
        $('#datepicker2').val('');
    }
});