from django import forms
from PIL import Image
from .models import Application, Page, Location, Banner, Installation, Campaign, User
from django.forms import modelformset_factory
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import AuthenticationForm

class LoginForm(AuthenticationForm):
    error_messages = {
        'invalid_login': _(
            "Username atau password salah."
        )
    }

    username = forms.CharField(widget=forms.TextInput(attrs={'type': 'text', 'id': 'inputEmail', 'class': 'form-control', 'name': 'username', 'placeholder': 'Username', 'required': 'True', 'autofocus': 'True'}))
    password = forms.CharField(widget=forms.TextInput(attrs={'type': 'password', 'id': 'inputPassword', 'class': 'form-control', 'name': 'password', 'placeholder': 'Password', 'required': 'True',}))

class ApplicationForm(forms.ModelForm):
    names = forms.ModelChoiceField(queryset=Application.objects.all(), widget=forms.Select(attrs={'class' : 'form-control'}), label='Nama Aplikasi', empty_label='Pilih Aplikasi')

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
        fields = ['is_slider', 'name', 'height', 'width']
        labels = {
            'name' : 'Nama Lokasi Pemasangan',
            'width' : 'Ukuran Gambar',
            'height' : 'x',
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control location-name-input','required': 'True', 'disabled': 'true'}),
            'width' : forms.NumberInput(attrs={'class' : 'form-control col-sm-3', 'placeholder' : 'width', 'required': 'True', 'min' : '1', 'disabled': 'true'}),
            'height' : forms.NumberInput(attrs={'class' : 'form-control col-sm-3', 'placeholder' : 'height', 'required': 'True', 'min' : '1', 'disabled': 'true'}),
        }

LocationFormSet = modelformset_factory(Location, form=LocationForm, extra=1, can_delete=True)

class BannerForm(forms.ModelForm):
    class Meta:
        model = Banner
        fields = ['name', 'description', 'image', 'height', 'width']
        labels = {
            'name' : _('Nama Banner'),
            'description' : _('Deskripsi'),
            'image' : _('Gambar Banner'),
            'width' : _('Ukuran'),
            'height' : _('x'),
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control', 'required' : 'true'}),
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
    daterangepicker = forms.CharField(widget=forms.TextInput(attrs={'class' : 'form-control', 'required' : True, 'oninput': 'load_datepicker(this);'}), label='Tanggal Berlaku', required=False)

    class Meta:
        model = Campaign
        fields = ['campaign_code', 'priority']
        labels = {
            'campaign_code' : _('Kode Campaign'),
            'priority' : _('Prioritas Banner'),
        }
        widgets = {
            'campaign_code' : forms.TextInput(attrs={'class' : 'form-control', 'required' : 'true', 'oninput' : 'check_campaign_code_available_add(this);'}),
            'priority' : forms.NumberInput(attrs={'class' : 'form-control', 'required' : True, 'max' : '100', 'min' : '1', 'onchange': 'check_priority_available(this);', 'oninput': 'check_priority_available(this);'}),
        }

CampaignFormSet = modelformset_factory(Campaign, form=CampaignForm, extra=1, can_delete=True)

class InstallationForm(forms.ModelForm):
    banner_names = forms.ModelChoiceField(queryset=Banner.objects.filter(is_archived=False), widget=forms.Select(attrs={'class' : 'form-control banner-select', 'onchange' : 'load_banner(this);', 'required' : True}), label='Nama Banner', empty_label='Pilih Banner')

    class Meta:
        model = Installation
        fields = ['banner_names', 'redirect']
        labels = {
            'redirect' : _('Link Tujuan Banner'),
        }
        widgets = {
            'redirect' : forms.TextInput(attrs={'class' : 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super(InstallationForm, self).__init__(*args, **kwargs)
        self.fields['redirect'].required = False

InstallationFormSet = modelformset_factory(Installation, form=InstallationForm, extra=1, can_delete=True)

class UserForm(forms.ModelForm):
    DEVELOPER = 1
    MARKETING = 2
    ROLE_CHOICES = (
        (DEVELOPER, 'Developer'),
        (MARKETING, 'Marketing'),
    )

    roles = forms.ChoiceField(choices=ROLE_CHOICES, widget=forms.Select(attrs={'class' : 'form-control'}), label='Role', required=False)

    class Meta:
        model = User
        fields = ['roles', 'username', 'email', 'password']
        labels = {
            'username' : _('Username'),
            'email' : _('Email'),
            'password' : _('Password'),
        }
        widgets = {
            'username' : forms.TextInput(attrs={'class' : 'form-control', 'aria-describedby' : 'inputGroupPrependEmail'}),
            'email' : forms.EmailInput(attrs={'class' : 'form-control', 'aria-describedby' : 'inputGroupPrependUsername'}),
            'password' : forms.PasswordInput(attrs={'class' : 'form-control', 'aria-describedby' : 'inputGroupPrependPassword'}, render_value=True),
        }
    
    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.fields['username'].required = False 
        self.fields['email'].required = False 

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

class KeywordDateRangeForm(forms.Form):
    date1 = forms.DateField(label='Tanggal Cari:', widget=forms.DateInput(
        attrs={'id': 'datepicker1', 'name': 'date1', 'class': 'form-control ml-3', 'placeholder': 'DD/MM/YY', 'autocomplete': 'off', 'required': 'True'}))
    date2 = forms.DateField(label='s/d', widget=forms.DateInput(
        attrs={'id': 'datepicker2', 'name':'date2', 'class': 'form-control ml-3', 'placeholder': 'DD/MM/YY', 'autocomplete': 'off', 'required': 'True'}))