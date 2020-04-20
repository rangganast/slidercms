from django.views import View
from django.urls import reverse
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib import messages
from .forms import ApplicationForm, PageFormSet, LocationFormSet, BannerForm, InstallationForm
from .models import Application, Page, Location, Banner, Installation

# Create your views here.
class PageView(View):
    template_name = 'app/page.html'

    def get(self, request):
        apps = Application.objects.all().order_by('pk')
        pages = Page.objects.all().order_by('pk')
        locations = Location.objects.all().order_by('pk')
        installations = Installation.objects.values('location_id', 'is_active').order_by('location_id')

        contents = []

        for i in range(len(locations)):
            contents.append({'location_id' : locations[i].id, 'location' : locations[i].name, 'is_archived' : locations[i].is_archived, 'is_active': None, 'page_id' : None, 'page': None, 'app' : None})
            for installation in installations:
                if locations[i].id==installation['location_id']:
                    contents[i]['is_active'] = installation['is_active']

            for page in pages:
                if locations[i].page_id == page.id:
                    contents[i]['page_id'] = page.id
                    contents[i]['page'] = page.name
                    for app in apps:
                        if page.application_id == app.id:
                            contents[i]['app'] = app.name

        context = {
            'contents' : contents,
        }
        return render(request, self.template_name, context)

class AddPageView(View):
    form_class = {
        'form_application' : ApplicationForm,
        'formset_page' : PageFormSet,
        'formset_location' : LocationFormSet,
    }
    
    initial = {'key', 'value'}
    template_name = 'app/add_page_form.html'

    def get(self, request):
        form_application = self.form_class['form_application']()
        formset_page = self.form_class['formset_page'](prefix='page', queryset=Page.objects.none())
        formset_location = self.form_class['formset_location'](prefix='location', queryset=Location.objects.none())

        context = {
            'form_application' : form_application,
            'formset_page' : formset_page,
            'formset_location' : formset_location,
        }

        return render(request, self.template_name, context)
    
    def post(self, request):
        form_application = self.form_class['form_application'](request.POST or None)
        formset_page = self.form_class['formset_page'](request.POST or None, prefix='page', queryset=Page.objects.none())
        formset_location = self.form_class['formset_location'](request.POST or None, prefix='location', queryset=Location.objects.none())

        if form_application.is_valid() and formset_page.is_valid() and formset_location.is_valid():
            app_instance = Application.objects.get(pk=form_application.cleaned_data['names'])

            pageform = formset_page.cleaned_data

            for i in range(len(pageform)):
                if pageform[i]:
                    name = pageform[i]['name']

                    page_instance = Page(name=name, application=app_instance)
                    page_instance.save()

                    min_loc = request.POST.get('page-' + str(i) + '-min')
                    max_loc = request.POST.get('page-' + str(i) + '-max')

                    locform = formset_location.cleaned_data

                    for i in range(int(min_loc), int(max_loc) + 1):
                        if locform[i]:
                            name = locform[i]['name']
                            is_slider = locform[i]['is_slider']
                            width = locform[i]['width']
                            height = locform[i]['height']

                            loc_instance = Location(name=name, width=width, height=height, is_slider=is_slider ,page=page_instance)
                            loc_instance.save()

            messages.add_message(request, messages.INFO, "Data berhasil ditambahkan!", extra_tags="page_added")

            return redirect(reverse('app:page'))

        else:
            print(form_application.errors)
            print(formset_page.errors)
            print(formset_location.errors)

            return redirect(reverse('app:add_page'))

class UpdatePageView(View):
    form_class = {
        'form_application' : ApplicationForm,
        'formset_page' : PageFormSet,
        'formset_location' : LocationFormSet,
    }
    
    initial = {'key', 'value'}
    template_name = 'app/update_page_form.html'

    def get(self, request, pk_page, pk_location):
        page_instance = Page.objects.filter(pk=pk_page)
        location_instance = Location.objects.filter(pk=pk_location)

        form_application = self.form_class['form_application']()
        formset_page = self.form_class['formset_page'](prefix='page', queryset=page_instance)
        formset_location = self.form_class['formset_location'](prefix='location', queryset=location_instance)

        context = {
            'form_application' : form_application,
            'formset_page' : formset_page,
            'formset_location' : formset_location,
        }

        return render(request, self.template_name, context)

    def post(self, request, pk):
        pass
    
class ArchivePageView(View):
    def post(self, request, pk):
        location_instance = Location.objects.get(pk=pk)

        if location_instance.is_archived == True:
            location_instance.is_archived = False
            location_instance.save()
            messages.add_message(request, messages.INFO, "Data berhasil di-unarchive!", extra_tags="location_unarchived")

            return redirect(reverse('app:page'))
        else:
            location_instance.is_archived = True
            location_instance.save()
            messages.add_message(request, messages.INFO, "Data berhasil di-archive!", extra_tags="location_archived")

            return redirect(reverse('app:page'))

class BannerView(View):
    template_name = 'app/banner.html'

    def get(self, request):
        banners = Banner.objects.all().order_by('pk')
        installations = Installation.objects.values('banner_id', 'is_active').order_by('banner_id')

        contents = []

        for i in range(len(banners)):
            contents.append({'id': banners[i].id, 'name': banners[i].name, 'description': banners[i].description, 'width': banners[i].width, 'height': banners[i].height, 'image': banners[i].height, 'is_archived': banners[i].is_archived, 'is_active': None})
            for installation in installations:
                if installation['banner_id'] == banners[i].id:
                    contents[i]['is_active'] = installation['is_active']

        context = {
            'contents': contents,
        }

        return render(request, self.template_name, context)

class AddBannerView(View):
    form_class = {
        'form_banner' : BannerForm,
    }
    
    initial = {'key', 'value'}
    template_name = 'app/add_banner_form.html'

    def get(self, request):
        form_banner = self.form_class['form_banner']()

        context = {
            'form_banner' : form_banner,
        }

        return render(request, self.template_name, context)
    
    def post(self, request):
        form_banner = self.form_class['form_banner'](request.POST or None, request.FILES or None)

        if form_banner.is_valid():
            name = form_banner.cleaned_data['name']
            description = form_banner.cleaned_data['description']
            image = form_banner.cleaned_data['image']
            width = form_banner.cleaned_data['width']
            height = form_banner.cleaned_data['height']

            banner_instance = Banner(name=name, description=description, image=image, width=width, height=height)
            banner_instance.save()
        else:
            context = {
                'form_banner' : form_banner,
            }

            return render(request, self.template_name, context)
        
        messages.add_message(request, messages.INFO, "Data berhasil ditambahkan!", extra_tags="location_added")

        return redirect(reverse('app:banner'))

class UpdateBannerView(View):
    form_class = {
        'form_banner' : BannerForm,
    }

    initial = {'key', 'value'}
    template_name = 'app/update_banner_form.html'

    def get(self, request, pk):
        banner_instance = Banner.objects.get(pk=pk)

        form_banner = self.form_class['form_banner'](initial={'id' : banner_instance.id, 'name' : banner_instance.name, 'description' : banner_instance.description, 'image' : banner_instance.image, 'width' : banner_instance.width, 'height' : banner_instance.height })

        context = {
            'banner' : banner_instance,
            'form_banner' : form_banner,
        }

        return render(request, self.template_name, context)

    def post(self, request, pk):
        banner_instance = Banner.objects.get(pk=pk)
        form_banner = self.form_class['form_banner'](request.POST or None, request.FILES or None)

        if form_banner.is_valid():
            name = form_banner.cleaned_data['name']
            description = form_banner.cleaned_data['description']
            image = form_banner.cleaned_data['image']
            width = form_banner.cleaned_data['width']
            height = form_banner.cleaned_data['height']

            if image == None:
                banner_instance.name = name
                banner_instance.description = description
                banner_instance.width = width
                banner_instance.height = height
            else:
                banner_instance.image.delete()

                banner_instance.name = name
                banner_instance.description = description
                banner_instance.image = image
                banner_instance.width = width
                banner_instance.height = height

            banner_instance.save()
        
            messages.add_message(request, messages.INFO, "Data berhasil di-update!", extra_tags="banner_updated")

            return redirect(reverse('app:banner'))

        else:

            context = {
                'form_banner' : form_banner,
            }

            return render(request, self.template_name, context)

class ArchiveBannerView(View):
    def post(self, request, pk):
        banner_instance = Banner.objects.get(pk=pk)

        if banner_instance.is_archived == True:
            banner_instance.is_archived = False
            banner_instance.save()
            messages.add_message(request, messages.INFO, "Data berhasil di-unarchive!", extra_tags="banner_unarchived")

            return redirect(reverse('app:banner'))
        else:
            banner_instance.is_archived = True
            banner_instance.save()
            messages.add_message(request, messages.INFO, "Data berhasil di-archive!", extra_tags="banner_archived")

            return redirect(reverse('app:banner'))