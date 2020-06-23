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
        window.location.href = "/keywords/";
    } else {
        table.search('').draw();
        $('#myInputTextField').val('');
        $('#datepicker1').val('');
        $('#datepicker2').val('');
    }
});

// function appFilter() {
//     $.fn.dataTable.ext.search = [];
//     $.fn.dataTable.ext.search.push(
//         function (settings, data, dataIndex) {
//             var value = $('#app_filter').find('option:selected').text();
//             if (value) {
//                 if (data[1]) {
//                     console.log(data[1])
//                 }
//             }
//         }
//     )
// }