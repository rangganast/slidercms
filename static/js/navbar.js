function logout() {
    Swal.fire({
        title: 'Logout',
        icon: 'info',
        html: 'Anda yakin ingin Logout?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Logout',
        confirmButtonClass: 'btn btn-danger',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            window.location = "/logout";
        }
    });
}