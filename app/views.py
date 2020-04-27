from django.views import View
from django.urls import reverse
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponse, HttpResponseRedirect
from . import services
from .forms import ApplicationForm, PageFormSet, LocationFormSet, BannerForm, InstallationFormSet, KeywordDateRangeForm
from .models import Application, Page, Location, Banner, Installation

# Create your views here.
class PageView(View):
    template_name = 'app/page.html'

    def get(self, request):
        apps = Application.objects.all().order_by('name')
        pages = Page.objects.all().order_by('pk')
        locations = Location.objects.all().order_by('pk')

        contents = []

        for i in range(len(pages)):
            contents.append({'app' : None, 'page_id' : pages[i].id, 'page_name' : pages[i].name, 'is_archived' : pages[i].is_archived, 'location_names' : [], 'location_sizes' : []})
            for app in apps:
                if pages[i].application_id == app.id:
                    contents[i]['app'] = app.name
            
            for location in locations:
                if location.page_id == pages[i].id:
                    contents[i]['location_names'].append(location.name)
                    contents[i]['location_sizes'].append(str(location.width) + " x " + str(location.height))

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

    def get(self, request, pk_page):
        page_instance = Page.objects.filter(pk=pk_page)
        location_instance = Location.objects.filter(page_id__in=page_instance)

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
        page_instance = Page.objects.get(pk=pk)

        if page_instance.is_archived == True:
            page_instance.is_archived = False
            page_instance.save()
            messages.add_message(request, messages.INFO, "Halaman berhasil di-unarchive!", extra_tags="location_unarchived")

            return redirect(reverse('app:page'))
        else:
            page_instance.is_archived = True
            page_instance.save()
            messages.add_message(request, messages.INFO, "Halaman berhasil di-archive!", extra_tags="location_archived")

            return redirect(reverse('app:page'))

class BannerView(View):
    template_name = 'app/banner.html'

    def get(self, request):
        banners = Banner.objects.all().order_by('pk')
        installations = Installation.objects.values('banner_id', 'is_active').order_by('banner_id')

        contents = []

        for i in range(len(banners)):
            contents.append({'id': banners[i].id, 'name': banners[i].name, 'description': banners[i].description, 'width': banners[i].width, 'height': banners[i].height, 'image': banners[i].image, 'is_archived': banners[i].is_archived, 'is_active': None})
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
        
        messages.add_message(request, messages.INFO, "Data berhasil ditambahkan!", extra_tags="banner_added")

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

class InstallationView(View):
    template_name = 'app/installation.html'

    def get(self, request):
        apps = Application.objects.all().order_by('pk')
        pages = Page.objects.all().order_by('pk')
        locations = Location.objects.all().order_by('pk')
        banners = Banner.objects.all().order_by('pk')
        installations = Installation.objects.all().order_by('pk')

        contents = []

        for i in range(len(locations)):
            if Installation.objects.filter(location_id=locations[i].id).exists():
                contents.append({'loc_id' : locations[i].id, 'page_id' : locations[i].page_id, 'app' : None, 'app_id' : None, 'page' : None, 'location' : locations[i].name, 'banners' : [], 'is_active' : locations[i].is_active})

                for page in pages:
                    for i in range(len(contents)):
                        if contents[i]['page_id'] == page.id:
                            contents[i]['page'] = page.name
                            contents[i]['app_id'] = page.application_id

                for app in apps:
                    for i in range(len(contents)):
                        if contents[i]['app_id'] == app.id:
                            contents[i]['app'] = app.name

        context = {
            'contents' : contents,
        }

        return render(request, self.template_name, context)

class AddInstallationView(View):
    form_class = {
        'formset_installation' : InstallationFormSet,
    }

    inital = {'key' : 'value'}
    template_name = 'app/add_installation_form.html'

    def get(self, request):
        formset_installation = self.form_class['formset_installation'](prefix='installation', queryset=Installation.objects.none())

        context = {
            'formset_installation' : formset_installation,
            'apps' : Application.objects.all(),
        }

        return render(request, self.template_name, context)

    def post(self, request):
        formset_installation = self.form_class['formset_installation'](request.POST or None, prefix='installation', queryset=Installation.objects.none())

        fieldsets = request.POST.get('installation-TOTAL_FIELDSETS', '')

        if formset_installation.is_valid():
            for i in range(int(fieldsets)):
                location = request.POST.get('location-select-' + str(i), '')
                min_banner = request.POST.get('banner-' + str(i) + '-min', '')
                max_banner = request.POST.get('banner-' + str(i) + '-max', '')

                location_instance = Location(pk=location)

                installation = formset_installation.cleaned_data

                for j in range(int(min_banner), int(max_banner)+1):
                    if installation[j]:
                        banner = installation[j]['banner_names']
                        banner_instance = Banner.objects.get(pk=banner)
                        redirect = installation[j]['redirect']

                        installation_instance = Installation(location=location_instance, banner=banner_instance, redirect=redirect)
                        installation_instance.save()

            return HttpResponseRedirect(reverse('app:install'))
        else:
            print(formset_installation.errors)
            
            return HttpResponseRedirect(reverse('app:install'))

class KeywordListPage(View):
    form_class = {
        'date' : KeywordDateRangeForm
    }
    inital = {'key' : 'value'}
    template_name = 'app/keyword.html'

    def get(self, request, *args, **kwargs):
        form_date = self.form_class['date']()

        keywords_list = services.get_keywords()
        lists = services.get_list()
        counts = services.get_count_keywords()

        context = {
            'keywords_list': keywords_list,
            'lists': lists,
            'counts': counts,
            'form_date': form_date
        }

        if request.GET.get('filter') == '':
            date1 = request.GET.get("date1", "")
            date2 = request.GET.get("date2", "")

            counts = services.get_count_keywords_with_params(date1=date1, date2=date2)

            context['counts'] = counts
            
        return render(request, self.template_name, context)

def load_pages(request):
    app_id = request.GET.get('app_id')
    pages = Page.objects.filter(application_id=app_id)
    return render(request, 'app/pages_dropdown_list_options.html', {'pages': pages})

def load_locations(request):
    page_id = request.GET.get('page_id')
    locations = Location.objects.filter(page_id=page_id)
    return render(request, 'app/locations_dropdown_list_options.html', {'locations': locations})

def load_location_size(request):
    location_id = request.GET.get('location_id')
    location = Location.objects.get(pk=location_id)
    location_size = str(location.width) + " x " + str(location.height)
    return HttpResponse(location_size)

def load_banner(request):
    banner_id = request.GET.get('banner_id')
    banner = Banner.objects.get(pk=banner_id)
    return HttpResponse(banner.image.url)