$(document).ready(function () {
    $('#id_image').removeAttr('required');
})

function upload_img(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var image = new Image();
            image.src = e.target.result;

            image.onload = function () {
                $('#img-preview').attr('src', this.src);
                $('#id_height').val(this.height);
                $('#id_width').val(this.width);
            }
        }

        reader.readAsDataURL(input.files[0]);
    }
};