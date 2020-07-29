$(document).ready(function () {
    $('#sliderManagement').removeClass('menu-open');
    $('#smsBlastManagement').addClass('menu-open');
    $('a#smsBlast').addClass('active');

    $('#contactGroupFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Grup Kontak...',
    });

    $('#sendDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Cancel'
        }
    });

    $('#sendDateFilter').attr("placeholder", "DD/MM/YYYY - DD/MM/YYYY");

    $('#sentFilter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Status...',
    });
});

// DATATABLES
table = $('#smsTable').DataTable({
    bInfo: false,
    aaSorting: [],
    responsive: true,
    dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$('#sendDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    sendDateRangeFilter();
    table.draw();
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/smsblast/add_smsblast"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>SMS Blast</button></a></div>');

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

$('#contactGroupFilter').change(function () {
    var group = $(this).find('option:selected').text().toLowerCase();
    var group_regex = '\\b' + group + '\\b';
    
    table.column(2).search(group_regex, true, false).draw();
});

$('#sentFilter').change(function () {
    var sent = $(this).find('option:selected').text().toLowerCase();
    var sent_regex = '\\b' + sent + '\\b';

    table.column(6).search(sent_regex, true, false).draw();
});

$('#resetFilter').click(function () {
    $('#myInputTextField').val('');
    $('#contactGroupFilter').val('').trigger('change');
    $('#sendDateFilter').val('');
    $('#sentFilter').val('').trigger('change');

    $.fn.dataTable.ext.search = [];
    table.destroy();

    table = $('#smsTable').DataTable({
        bInfo: false,
        aaSorting: [],
        responsive: true,
        dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
    });

    $("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');

    table.draw();
});

function sendDateRangeFilter() {
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var value = $('#sendDateFilter').val();
            if (value) {
                var value = value.split(' - ')
                var min = value[0];
                var max = value[1];

                var min = min.split('/');
                var max = max.split('/');

                var min = new Date(min[2] + '-' + min[1] + '-' + min[0]);
                var max = new Date(max[2] + '-' + max[1] + '-' + max[0]);

                if (data[4]) {
                    var sendDate = data[4].split('/');
                    var validDate = new Date(sendDate[2] + '-' + sendDate[1] + '-' + sendDate[0]);

                    if (min <= validDate && max >= validDate) {
                        return true;
                    }
                    return false;

                } else {
                    return false;
                }

            }
        }
    )
};

function deleteSMSBlast(input) {
    var id = $(input).attr('id').split('-')[1];

    Swal.fire({
        title: 'Hapus',
        icon: 'info',
        html: 'Anda yakin ingin menghapus SMS ini?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Hapus',
        confirmButtonClass: 'btn btn-danger',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $('#form_smsblast_delete-' + id).submit();
        };
    });
};