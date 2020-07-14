from django import forms
from PIL import Image
from .models import Application, Page, Location, Banner, Installation, Campaign, User, Contact, ContactSource, GenerateContact
from .models import choices
from django.forms import modelformset_factory
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm, SetPasswordForm

class LoginForm(AuthenticationForm):
    error_messages = {
        'invalid_login': _(
            "Username atau password salah."
        )
    }

    username = forms.CharField(widget=forms.TextInput(attrs={'type': 'text', 'id': 'id_username', 'class': 'form-control', 'name': 'username', 'placeholder': 'Username', 'required': 'True', 'autofocus': 'True'}))
    password = forms.CharField(widget=forms.TextInput(attrs={'type': 'password', 'id': 'id_password', 'class': 'form-control', 'name': 'password', 'placeholder': 'Password', 'required': 'True',}))

class PasswordResetForm(PasswordResetForm):
    email = forms.CharField(widget=forms.EmailInput(attrs={'type': 'email', 'id': 'id_email', 'class': 'form-control', 'name': 'email', 'placeholder': 'Email', 'required': 'True', 'autofocus': 'True'}))

class SetPasswordForm(SetPasswordForm):
    error_messages = {
        'password_too_short': _("Password terlalu pendek (min. 8 karakter)"),
        'password_mismatch': _("Password tidak sama"),
        'required': _("Field tidak boleh kosong"),
    }

    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'type': 'password', 'id': 'id_new_password1', 'class': 'form-control', 'name': 'new_password1', 'placeholder': 'Password Baru', 'required': 'True', 'autofocus': 'True'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'type': 'password', 'id': 'id_new_password2', 'class': 'form-control', 'name': 'new_password2', 'placeholder': 'Konfirmas Password Baru', 'required': 'True'}))

    def __init__(self, *args, **kwargs):
        super(SetPasswordForm, self).__init__(*args, **kwargs)
        self.fields['new_password2'].error_messages['required'] = _("Field tidak boleh kosong")

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                )

            if len(password2) < 8:
                raise ValidationError(
                    "Password tidak boleh kurang dari 8 karakter",
                    code='password_too_short',
            )

        return password2

class AppForm(forms.ModelForm):
    class Meta:
        model = Application
        fields = ['app_code', 'name']

        labels = {
            'app_code' : 'Kode Aplikasi',
            'name' : 'Nama Aplikasi',
        }
        widgets = {
            'app_code' : forms.TextInput(attrs={'class' : 'form-control', 'required': 'True', 'oninput' : 'checkAppCode(this);'}),
            'name' : forms.TextInput(attrs={'class' : 'form-control', 'required': 'True', 'oninput' : 'checkAppName(this);'})
        }

class ApplicationForm(forms.ModelForm):
    names = forms.ModelChoiceField(queryset=Application.objects.filter(is_archived=False), widget=forms.Select(attrs={'class' : 'form-control'}), label='Nama Aplikasi', empty_label='Pilih Aplikasi')

    class Meta:
        model = Application
        fields = ['names']

class PageForm(forms.ModelForm):
    class Meta:
        model = Page
        fields = ['name']
        labels = {
            'name' : 'Nama Halaman',
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control page-name', 'required': 'True', 'oninput' : 'checkSimilarPage(this);', 'disabled' : 'true'})
        }

PageFormSet = modelformset_factory(Page, form=PageForm, extra=1, can_delete=True)

class LocationForm(forms.ModelForm):
    choices = [
        (True, 'Ya'),
        (False, 'Tidak')
    ]

    is_slider = forms.CharField(label='Apakah lokasi pemasangan banner berupa "Slider"?', widget=forms.RadioSelect(choices=choices, attrs={'class' : 'ml-2', 'required' : True, 'disabled' : 'true'}))

    class Meta:
        model = Location
        fields = ['is_slider', 'loc_code', 'name', 'height', 'width']
        labels = {
            'name' : 'Nama Lokasi Pemasangan',
            'loc_code' : 'Kode Lokasi pemasangan',
            'width' : 'Ukuran Gambar',
            'height' : 'x',
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control location-name-input','required': 'True', 'disabled': 'true', 'oninput' : 'checkSimilarLocation(this);'}),
            'loc_code' : forms.TextInput(attrs={'class' : 'form-control location-code-input','required': 'True', 'disabled': 'true', 'oninput' : 'checkLocationCode(this);'}),
            'width' : forms.NumberInput(attrs={'class' : 'form-control col-sm-3', 'placeholder' : 'width', 'required': 'True', 'min' : '1', 'disabled': 'true'}),
            'height' : forms.NumberInput(attrs={'class' : 'form-control col-sm-3', 'placeholder' : 'height', 'required': 'True', 'min' : '1', 'disabled': 'true'}),
        }

LocationFormSet = modelformset_factory(Location, form=LocationForm, extra=1, can_delete=True)

class BannerForm(forms.ModelForm):
    class Meta:
        model = Banner
        fields = ['name', 'caption', 'description', 'image', 'height', 'width']
        labels = {
            'name' : _('Nama Banner'),
            'caption' : _('Caption'),
            'description' : _('Deskripsi'),
            'image' : _('Gambar Banner'),
            'width' : _('Ukuran'),
            'height' : _('x'),
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control', 'required' : 'true'}),
            'caption' : forms.Textarea({'class': 'form-control', 'required': 'True'}),
            'description' : forms.Textarea({'class': 'form-control', 'required': 'True'}),
            'image' : forms.FileInput(attrs={'class': 'form-control', 'onchange': 'upload_img(this);', 'required' : 'True'}),
            'height' : forms.NumberInput(attrs={'class': 'form-control col-sm-3', 'readonly' : 'true'}),
            'width' : forms.NumberInput(attrs={'class': 'form-control col-sm-3', 'readonly' : 'true'}),
        }

        def __init__(self, *args, **kwargs):
            super(BannerForm, self).__init__(*args, **kwargs)
            self.fields['image'].required = False

    def clean_image(self):
        image = self.cleaned_data.get('image', False)

        if image != None:
            img = Image.open(image)
            # w, h = img.size

            # width = 1500
            # height = 444
            # if w != width or h != height:
            #     raise forms.ValidationError(_('Gambar harus berukuran %s x %s pixels.' % (width, height)))

            main, sub = image.content_type.split('/')
            if not (main == 'image' and sub.lower() in ['jpeg', 'pjpeg', 'png', 'jpg']):
                raise forms.ValidationError(_('Format file harus JPG, JPEG atau PNG.'))

            if len(image) > (1 * 1024 * 1024):
                raise forms.ValidationError(_('File berukuran maksimal 1 MB.'))

        else:
            pass

        return image

class CampaignForm(forms.ModelForm):
    daterangepicker = forms.CharField(widget=forms.TextInput(attrs={'class' : 'form-control daterangepickerinput', 'required' : True, 'onclick': 'load_datepicker(this);', 'disabled' : True, 'readonly' : True, 'autocomplete' : 'off'}), label='Tanggal Berlaku', required=False)

    class Meta:
        model = Campaign
        fields = ['campaign_code', 'priority']
        labels = {
            'campaign_code' : _('Kode Campaign'),
            'priority' : _('Prioritas Banner'),
        }
        widgets = {
            'campaign_code' : forms.TextInput(attrs={'class' : 'form-control campaign-campaign_code', 'required' : 'true', 'oninput' : 'check_campaign_code_available(this);', 'disabled' : True}),
            'priority' : forms.NumberInput(attrs={'class' : 'form-control campaign-priority', 'required' : True, 'max' : '100', 'min' : '1', 'onchange': 'check_priority_available(this);', 'oninput': 'check_priority_available(this);', 'disabled' : True}),
        }

CampaignFormSet = modelformset_factory(Campaign, form=CampaignForm, extra=1, can_delete=True)

class InstallationForm(forms.ModelForm):
    banner_names = forms.ModelChoiceField(queryset=Banner.objects.filter(is_archived=False), widget=forms.Select(attrs={'class' : 'form-control banner-select', 'onchange' : 'load_banner(this);', 'required' : True, 'disabled' : True}), label='Nama Banner', empty_label='Pilih Banner')

    class Meta:
        model = Installation
        fields = ['banner_names', 'redirect']
        labels = {
            'redirect' : _('Link Tujuan Banner'),
        }
        widgets = {
            'redirect' : forms.URLInput(attrs={'class' : 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super(InstallationForm, self).__init__(*args, **kwargs)
        self.fields['redirect'].required = False

InstallationFormSet = modelformset_factory(Installation, form=InstallationForm, extra=1, can_delete=True)

class UserForm(forms.ModelForm):
    SUPERUSER = 1
    DEVELOPER = 2
    MARKETING = 3
    ROLE_CHOICES = (
        (None, 'Pilih Role'),
        (SUPERUSER, 'Super Admin'),
        (DEVELOPER, 'Developer'),
        (MARKETING, 'Marketing'),
    )

    roles = forms.ChoiceField(choices=ROLE_CHOICES, widget=forms.Select(attrs={'class' : 'form-control'}), label='Role')

    class Meta:
        model = User
        fields = ['roles', 'username', 'email', 'password']
        labels = {
            'username' : _('Username'),
            'email' : _('Email'),
            'password' : _('Password'),
        }
        widgets = {
            'username' : forms.TextInput(attrs={'class' : 'form-control', 'aria-describedby' : 'inputGroupPrependEmail', 'placeholder' : 'Username'}),
            'email' : forms.EmailInput(attrs={'class' : 'form-control', 'aria-describedby' : 'inputGroupPrependUsername', 'placeholder' : 'Email'}),
            'password' : forms.PasswordInput(attrs={'class' : 'form-control', 'aria-describedby' : 'inputGroupPrependPassword', 'min' : 8, 'placeholder' : 'Password'}, render_value=True),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email', False)
        
        if not User.objects.all().exclude(email=email).filter(email=email):
            return email
        else:
            raise forms.ValidationError("Email telah terdaftar. Silahkan masukkan email lain.")

    def clean_username(self):

        username = self.cleaned_data.get('username', False)

        if not User.objects.all().exclude(username=username).filter(username=username):
            return username
        else:
            raise forms.ValidationError("Username telah dipakai. Silahkan masukkan username lain.")

    def clean_password(self):

        password = self.cleaned_data.get('password', False)

        if len(password) >= 8:
            return password
        else:
            raise forms.ValidationError("Password kurang dari 8 karakter.")

class KeywordDateRangeForm(forms.Form):
    date1 = forms.DateField(label='Tanggal Cari:', widget=forms.DateInput(
        attrs={'id': 'datepicker1', 'name': 'date1', 'class': 'form-control ml-3', 'placeholder': 'DD/MM/YY', 'autocomplete': 'off', 'required': 'True'}))
    date2 = forms.DateField(label='s/d', widget=forms.DateInput(
        attrs={'id': 'datepicker2', 'name':'date2', 'class': 'form-control ml-3', 'placeholder': 'DD/MM/YY', 'autocomplete': 'off', 'required': 'True'}))

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name']
        labels = {
            'name' : 'Nama Kontak'
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control', 'autocompete' : 'off', 'required' : True, 'oninput' : 'addNametoURLandInputs(this);'}),
        }

class ContactSourceForm(forms.ModelForm):
    class Meta:
        model = ContactSource
        fields = ['source']
        labels = {
            'source' : 'Sumber Kontak'
        }
        widgets = {
            'source' : forms.Select(attrs={'class' : 'form-control', 'required' : True}, choices=choices),
        }

class GenerateRandomNumberForm(forms.ModelForm):
    class Meta:
        model = GenerateContact
        fields = ['first_code', 'digits', 'generate_numbers']
        labels = {
            'first_code' : 'Kode Awal',
            'digits' : 'Jumlah Digit Nomor ***',
            'generate_numbers' : 'Jumlah Nomor yang Akan Di-generate',
        }
        widgets = {
            'first_code' : forms.NumberInput({'class' : 'form-control', 'autocomplete' : 'off', 'required' : True}),
            'digits' : forms.NumberInput({'class' : 'form-control', 'autocomplete' : 'off', 'required' : True}),
            'generate_numbers' : forms.NumberInput({'class' : 'form-control', 'autocomplete' : 'off', 'required' : True}),
        }

GenerateRandomNumberFormSet = modelformset_factory(model=GenerateContact, form=GenerateRandomNumberForm, extra=1, can_delete=True)

class UploadCSVForm(forms.Form):
    upload_csv = forms.FileField(label='Pilih File Nomor', widget=forms.ClearableFileInput({'class' : 'form-control', 'accept' : '.csv'}))