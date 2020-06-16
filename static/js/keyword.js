$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('a#keywordCounter').addClass('active');

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

    var now_date = new Date();

    var now_day = now_date.getDate();
    var now_month = now_date.getMonth() + 1;
    var now_year = now_date.getFullYear();

    if (now_day.toString().length == 1) {
        var now_day = '0' + now_day.toString()
    }

    if (now_month.toString().length == 1) {
        var now_month = '0' + now_month.toString()
    }

    $('#datepicker2').val(now_day + "-" + now_month + "-" + now_year)

    var monthago_date = new Date();
    monthago_date.setDate(monthago_date.getDate() - 30);

    var monthago_day = monthago_date.getDate();
    var monthago_month = monthago_date.getMonth() + 1;
    var monthago_year = monthago_date.getFullYear();

    if (monthago_day.toString().length == 1) {
        var monthago_day = '0' + monthago_day.toString()
    }

    if (monthago_month.toString().length == 1) {
        var monthago_month = '0' + monthago_month.toString()
    }

    $('#datepicker1').val(monthago_day + "-" + monthago_month + "-" + monthago_year)
})

oTable = $('#keywordTable').DataTable({
    bInfo: false,
    aaSorting: [],
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