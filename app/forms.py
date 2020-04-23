from django import forms
from PIL import Image
from .models import Application, Page, Location, Banner, Installation
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
    choices = tuple(Application.objects.defer("name").values_list())

    names = forms.ChoiceField(choices=choices, widget=forms.Select(attrs={'class' : 'custom-select'}), label='Nama Aplikasi')

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
            'name' : forms.TextInput(attrs={'class' : 'form-control', 'required': 'True'})
        }

PageFormSet = modelformset_factory(Page, form=PageForm, extra=1, can_delete=True)

class LocationForm(forms.ModelForm):
    choices = [
        (True, 'Ya'),
        (False, 'Tidak')
    ]

    is_slider = forms.CharField(label='Apakah lokasi pemasangan banner berupa "Slider"?', widget=forms.RadioSelect(choices=choices, attrs={'class' : 'ml-2', 'required' : True}))

    class Meta:
        model = Location
        fields = ['is_slider', 'name', 'height', 'width']
        labels = {
            'name' : 'Nama Lokasi Pemasangan',
            'width' : 'Ukuran Gambar',
            'height' : 'x',
        }
        widgets = {
            'name' : forms.TextInput(attrs={'class' : 'form-control','required': 'True'}),
            'width' : forms.NumberInput(attrs={'class' : 'form-control col-sm-3', 'placeholder' : 'width', 'required': 'True'}),
            'height' : forms.NumberInput(attrs={'class' : 'form-control col-sm-3', 'placeholder' : 'height', 'required': 'True'}),
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

class InstallationForm(forms.ModelForm):
    banner_choices = tuple(Banner.objects.values_list("id", "name").order_by("id"))

    banner_names = forms.ChoiceField(choices=banner_choices, widget=forms.Select(attrs={'class' : 'custom-select'}), label='Nama Banner')

    class Meta:
        model = Installation
        fields = ['banner_names', 'redirect']
        labels = {
            'redirect' : _('Link Tujuan Banner'),
        }
        widgets = {
            'redirect' : forms.URLInput(attrs={'class' : 'form-control', 'required' : 'true'}),
        }

    def __init__(self, *args, **kwargs):
        super(InstallationForm, self).__init__(*args, **kwargs)
        self.fields['banner_names'].empty_label = 'Pilih gambar'

InstallationFormSet = modelformset_factory(Installation, form=InstallationForm, extra=1, can_delete=True)

class KeywordDateRangeForm(forms.Form):
    date1 = forms.CharField(label='Tanggal Cari:', widget=forms.DateInput(
        attrs={'id': 'datepicker1', 'name': 'date1', 'class': 'form-control ml-3', 'placeholder': 'DD/MM/YY', 'autocomplete': 'off', 'required': 'True'}))
    date2 = forms.CharField(label='s/d', widget=forms.DateInput(
        attrs={'id': 'datepicker2', 'name':'date2', 'class': 'form-control ml-3', 'placeholder': 'DD/MM/YY', 'autocomplete': 'off', 'required': 'True'}))