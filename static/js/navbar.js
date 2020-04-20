function logout() {
    Swal.fire({
        title: 'Logout',
        icon: 'info',
        html: 'Anda yakin ingin Logout?',
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Batal',
        confirmButtonText: 'Logout',
        confirmButtonColor: '#dc3545',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            window.location = "/logout";
        }
    });
}