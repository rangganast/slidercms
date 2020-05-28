$(document).ready(function () {
    // $('a#sliderManagement').addClass('active');
    $('a#installManagement').addClass('active');

    $('#createDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Cancel'
        }
    });

    $('#createDateFilter').attr("placeholder", "DD/MM/YYYY - DD/MM/YYYY");

    $('#updateDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Cancel'
        }
    });

    $('#updateDateFilter').attr("placeholder", "DD/MM/YYYY - DD/MM/YYYY");

    $('#validDateFilter').daterangepicker({
        autoUpdateInput: false,
        cancelButtonClasses: 'btn btn-secondary',
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Cancel'
        }
    });

    $('#validDateFilter').attr("placeholder", "DD/MM/YYYY - DD/MM/YYYY");

    $('#app_filter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Aplikasi',
    });

    $('#page_filter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Halaman',
    });

    $('#location_filter').select2({
        theme: 'bootstrap4',
        placeholder: 'Cari Lokasi',
    });

});

// DATATABLES
table = $('#installTable').DataTable({
    bInfo : false,
    sScrollX: true,
    aaSorting: [],
    dom : "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
});

$("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');
// DATATABLES

// DATE FILTERS
$('#createDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    createDateRangeFilter();
    table.draw();
});

$('#updateDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    updateDateRangeFilter();
    table.draw();
});

$('#validDateFilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    validDateRangeFilter();
    table.draw();
});
// DATE FILTERS

$('#myInputTextField').keyup(function () {
    table.search($(this).val()).draw();
});

$('#app_filter').change(function () {
    var url = $('#filterDiv').attr("data-page-url");
    var app_id = $(this).val();

    if (app_id) {
        $.ajax({
            url: url,
            data: {
                'app_id': app_id
            },
            success: function (data) {
                $("#page_filter").html(data);
                $("#page_filter").prop('disabled', false);
            }
        });
    }

    var appname = $(this).find('option:selected').text().toLowerCase();
    var regex = '\\b' + appname + '\\b';
    table.column(1).search(regex, true, false).draw();
});

$('#page_filter').change(function () {
    var url = $('#filterDiv').attr("data-location-url");
    var page_id = $(this).val();

    if (page_id) {
        $.ajax({
            url: url,
            data: {
                'page_id': page_id,
            },
            success: function (data) {
                $("#location_filter").html(data);
                $("#location_filter").prop('disabled', false);
            }
        });
    }

    var appname = $('#app_filter option:selected').text().toLowerCase();
    var pagename = $(this).find('option:selected').text().toLowerCase();
    var app_regex = '\\b' + appname + '\\b';
    var page_regex = '\\b' + pagename + '\\b';

    table.column(1).search(app_regex, true, false).draw();
    table.column(2).search(page_regex, true, false).draw();
});

$('#location_filter').change(function () {
    var appname = $('#app_filter option:selected').text().toLowerCase();
    var pagename = $('#page_filter option:selected').text().toLowerCase();
    var locationname = $(this).find('option:selected').text().toLowerCase();
    var app_regex = '\\b' + appname + '\\b';
    var page_regex = '\\b' + pagename + '\\b';
    var location_regex = '\\b' + locationname + '\\b';

    table.column(1).search(app_regex, true, false).draw();
    table.column(2).search(page_regex, true, false).draw();
    table.column(3).search(location_regex, true, false).draw();
});

$('#resetFilter').click(function () {
    $('#myInputTextField').val('');
    $('#validDateFilter').val('');
    $('#updateDateFilter').val('');
    $('#createDateFilter').val('');
    $('#app_filter').val('').trigger('change');
    $('#page_filter').val('').trigger('change');
    $('#page_filter').prop('disabled', true);
    $('#location_filter').val('').trigger('change');
    $('#location_filter').prop('disabled', true);
    
    $.fn.dataTable.ext.search = [];
    table.destroy();
    
    table = $('#installTable').DataTable({
        bInfo: false,
        sScrollX: true,
        aaSorting: [],
        dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
    });
    
    $("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');

    table.draw();
});

function createDateRangeFilter() {
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var value = $('#createDateFilter').val()
            if(value){
                var value = value.split(' - ');
                var min = value[0];
                var max = value[1];
    
                var min = min.split('/');
                var max = max.split('/');
    
                var min = new Date(min[2] + '-' + min[1] + '-' + min[0]);
                var max = new Date(max[2] + '-' + max[1] + '-' + max[0]);
    
                var createDate = data[7].split('/');
                var createDate = new Date(createDate[2] + '-' + createDate[1] + '-' + createDate[0]);
    
                if (min == null && max == null) {
                    return true;
                }
                if (min == null && createDate <= max) {
                    return true;
                }
                if (max == null && createDate >= min) {
                    return true;
                }
                if (createDate <= max && createDate >= min) {
                    return true;
                }
                return false;
            }else{
                $.fn.dataTable.ext.search = [];
                table.destroy();

                table = $('#installTable').DataTable({
                    bInfo: false,
                    sScrollX: true,
                    aaSorting: [],
                    responsive: true,
                    dom: "<'tableWidget top row'<'col-sm-12 col-md-6'l>>rt<'bottom'p>",
                });

                $("div.tableWidget.top").append('<div class="col-sm-12 col-md-6"><a href="/installation/add_installation"><button class="btn btn-primary float-right"><i class="fas fa-plus mr-1"></i>Tambah Pemasangan</button></a></div>');

                table.draw();
            }
        }
    )
};

function validDateRangeFilter() {
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var value = $('#validDateFilter').val();
            if(value){
                var value = value.split(' - ')
                var min = value[0];
                var max = value[1];
        
                var min = min.split('/');
                var max = max.split('/');
        
                var min = new Date(min[2] + '-' + min[1] + '-' + min[0]);
                var max = new Date(max[2] + '-' + max[1] + '-' + max[0]);

                if (data[9]) {
                    var validDate = data[9].split(' s/d ');
                    var startDate = validDate[0].split('/');
                    var startDate = new Date(startDate[2] + '-' + startDate[1] + '-' + startDate[0]);
                    var endDate = validDate[1].split('/');
                    var endDate = new Date(endDate[2] + '-' + endDate[1] + '-' + endDate[0]);
    
                    if (min <= startDate && max >= endDate) {
                        return true;
                    }
                    return false;

                }else{
                    return false;
                }
        
            }
        }
    )
};

function updateDateRangeFilter() {
    $.fn.dataTable.ext.search = [];
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var value = $('#updateDateFilter').val();
            if(value){
                var value = value.split(' - ')
                var min = value[0];
                var max = value[1];
        
                var min = min.split('/');
                var max = max.split('/');
        
                var min = new Date(min[2] + '-' + min[1] + '-' + min[0]);
                var max = new Date(max[2] + '-' + max[1] + '-' + max[0]);
        
                var updateDate = data[8].split('/');
                var updateDate = new Date(updateDate[2] + '-' + updateDate[1] + '-' + updateDate[0]);
        
                if (min == null && max == null) {
                    return true;
                }
                if (min == null && updateDate <= max) {
                    return true;
                }
                if (max == null && updateDate >= min) {
                    return true;
                }
                if (updateDate <= max && updateDate >= min) {
                    return true;
                }
                return false;
            }
        }
    )
};

function deleteInstall(input) {
    var pk = $(input).attr('id').split('-');
    var counter = pk[0];
    var id = pk[1];

    Swal.fire({
        title: 'Hapus',
        icon: 'info',
        html: 'Anda yakin ingin menghapus Pemasangan ini?',
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
            $('#form_install_delete_' + counter + '-' + id).submit();
        };
    });
};