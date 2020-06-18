import re
import datetime
from django.db.models import Q
from django.views import View
from django.urls import reverse
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from . import services
from .decorators import developer_required, marketing_required, superuser_required
from .forms import AppForm, ApplicationForm, PageFormSet, LocationFormSet, BannerForm, CampaignFormSet ,InstallationFormSet, UserForm, KeywordDateRangeForm
from .models import Application, Page, Location, Banner, Campaign, Installation, User

# Create your views here.
@method_decorator([login_required, developer_required], name='dispatch')
class AppView(View):
    template_name = 'app/app.html'

    def get(self, request):
        contents = []

        apps = Application.objects.all().order_by('pk')
        pages = Page.objects.filter(application_id__in=apps).order_by('pk')
        locations = Location.objects.filter(page_id__in=pages).order_by('pk')

        for app in apps:
            contents.append({'app_id' : app.pk, 'app_code' : app.app_code, 'app_name' : app.name, 'is_archived' : app.is_archived, 'is_active' : False})

            for page in pages:
                if page.application_id == app.id:
                    for location in locations:
                        if location.page_id == page.id:
                            if location.is_active == True:
                                contents[-1]['is_active'] = True

        context = {
            'contents' : contents,
        }

        return render(request, self.template_name, context)

@method_decorator([login_required, developer_required], name='dispatch')
class AddAppView(View):
    form_class = {
        'form_app' : AppForm,
    }

    inital = {'key' : 'value'}
    template_name = 'app/add_app_form.html'

    def get(self, request):
        form_app = self.form_class['form_app']()

        context = {
            'form_app' : form_app,
        }

        return render(request, self.template_name, context)

    def post(self, request):
        form_app = self.form_class['form_app'](request.POST or None)

        if form_app.is_valid():
            app_code = form_app.cleaned_data['app_code']
            name = form_app.cleaned_data['name']

            app_instance = Application(app_code=app_code, name=name)
            app_instance.save()

            messages.add_message(request, messages.INFO, "Aplikasi berhasil ditambahkan!", extra_tags="app_added")

            return redirect(reverse('app:app'))
        else:
            context = {
                'form_app' : form_app,
            }
            return render(request, self.template_name, context)

@method_decorator([login_required, developer_required], name='dispatch')
class UpdateAppView(View):
    form_class = {
        'form_app' : AppForm,
    }

    inital = {'key' : 'value'}
    template_name = 'app/update_app_form.html'

    def get(self, request, pk):
        app_instance = Application.objects.get(pk=pk)

        form_app = self.form_class['form_app'](initial={'id' : app_instance.id, 'app_code' : app_instance.app_code, 'name' : app_instance.name})

        context = {
            'app' : app_instance,
            'form_app' : form_app,
        }

        return render(request, self.template_name, context)

    def post(self, request, pk):
        app_instance = Application.objects.get(pk=pk)
        form_app = self.form_class['form_app'](request.POST or None)

        if form_app.is_valid():
            app_code = form_app.cleaned_data['app_code']
            name = form_app.cleaned_data['name']

            if not (app_code == app_instance.app_code and name == app_instance.name):
                app_instance.app_code = app_code
                app_instance.name = name
                
                app_instance.save()

                messages.add_message(request, messages.INFO, "Aplikasi berhasil diupdate!", extra_tags="app_updated")

                return redirect(reverse('app:app'))
            
            else:
                messages.add_message(request, messages.INFO, "Aplikasi berhasil diupdate!", extra_tags="app_updated")

                return redirect(reverse('app:app'))

        else:
            app_instance = Application.objects.get(pk=pk)
            context = {
                'app' : app_instance,
                'form_app' : form_app,
            }
            return render(request, self.template_name, context)

@method_decorator([login_required, developer_required], name='dispatch')
class ArchiveAppView(View):
    def post(self, request, pk):
        app_instance = Application.objects.get(pk=pk)

        if app_instance.is_archived == True:
            app_instance.is_archived = False
            app_instance.save()
            messages.add_message(request, messages.INFO, "Aplikasi berhasil di-unarchive!", extra_tags="app_unarchived")

            return redirect(reverse('app:app'))
        else:
            app_instance.is_archived = True
            app_instance.save()
            messages.add_message(request, messages.INFO, "Aplikasi berhasil di-archive!", extra_tags="app_archived")

            return redirect(reverse('app:app'))

@method_decorator([login_required, superuser_required], name='dispatch')
class DeleteAppView(View):
    def post(self, request, pk):
        app_instance = Application.objects.get(pk=pk)
        app_instance.delete()
        
        page_instances = Page.objects.filter(application_id=app_instance.id)
        location_instances = Location.objects.filter(page_id__in=page_instances)

        for page in page_instances:
            page.delete()

        for location in location_instances:
            location.delete()

        messages.add_message(request, messages.INFO, "Aplikasi berhasil dihapus!", extra_tags="app_deleted")

        return redirect(reverse('app:app'))

@method_decorator(login_required, name='dispatch')
class PageView(View):
    template_name = 'app/page.html'

    def get(self, request):
        apps = Application.objects.all().order_by('pk')
        pages = Page.objects.all().order_by('pk')
        locations = Location.objects.all().order_by('pk')

        contents = []

        for i in range(len(pages)):
            contents.append({'app' : None, 'page_id' : pages[i].id, 'page_name' : pages[i].name, 'is_archived' : pages[i].is_archived, 'location_counters' : [], 'location_ids' : [], 'location_names' : [], 'location_codes' : [], 'location_sizes' : [], 'location_is_active': [], 'is_active' : False})
            for app in apps:
                if pages[i].application_id == app.id:
                    contents[i]['app'] = app.name
            
            for j in range(len(locations)):
                if locations[j].page_id == pages[i].id:
                    contents[i]['location_counters'].append(j)
                    contents[i]['location_ids'].append(locations[j].id)
                    contents[i]['location_names'].append(locations[j].name)
                    contents[i]['location_codes'].append(locations[j].loc_code)
                    contents[i]['location_sizes'].append(str(locations[j].width) + " x " + str(locations[j].height))
                    contents[i]['location_is_active'].append(locations[j].is_active)

                    if locations[j].is_active == True:
                        contents[i]['is_active'] = True

        context = {
            'contents' : contents,
            'apps': apps,
            'pages' : pages,
        }
        return render(request, self.template_name, context)

@method_decorator([login_required, developer_required], name='dispatch')
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
            app_instance = Application.objects.get(pk=form_application.cleaned_data['names'].id)

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
                            loc_code = locform[i]['loc_code']
                            is_slider = locform[i]['is_slider']
                            width = locform[i]['width']
                            height = locform[i]['height']

                            loc_instance = Location(name=name, loc_code=loc_code, width=width, height=height, is_slider=is_slider, page=page_instance)
                            loc_instance.save()

                            campaign_instance = Campaign(date_created=datetime.date.today(), priority=0, location_id=loc_instance.id)
                            campaign_instance.save()

                            installation_instance = Installation(campaign_id=campaign_instance.id)
                            installation_instance.save()

            messages.add_message(request, messages.INFO, "Data berhasil ditambahkan!", extra_tags="page_added")

            return redirect(reverse('app:page'))

        else:
            print(form_application.errors)
            print(formset_page.errors)
            print(formset_location.errors)

            return redirect(reverse('app:add_page'))

@method_decorator([login_required, developer_required], name='dispatch')
class UpdatePageView(View):
    form_class = {
        'form_application' : ApplicationForm,
        'formset_page' : PageFormSet,
        'formset_location' : LocationFormSet,
    }
    
    initial = {'key', 'value'}
    template_name = 'app/update_page_form.html'

    def get(self, request, pk):
        page_instance = Page.objects.filter(pk=pk)
        location_instance = Location.objects.filter(page_id__in=page_instance).order_by('pk')
        location_actives = Location.objects.filter(page_id__in=page_instance).values_list('is_active').order_by('pk')
        actives = []
        for location in list(location_actives):
            actives.append(location[0])

        page = Page.objects.get(pk=pk)
        app_instance = Application.objects.get(pk=page.application_id)

        form_application = self.form_class['form_application'](initial={'names' : app_instance.id})
        formset_page = self.form_class['formset_page'](prefix='page', queryset=page_instance)
        formset_location = self.form_class['formset_location'](prefix='location', queryset=location_instance)

        context = {
            'page' : page,
            'actives' : actives,
            'form_application' : form_application,
            'formset_page' : formset_page,
            'formset_location' : formset_location,
        }

        return render(request, self.template_name, context)

    def post(self, request, pk):
        form_application = self.form_class['form_application'](request.POST or None)
        formset_page = self.form_class['formset_page'](request.POST or None, prefix='page')
        formset_location = self.form_class['formset_location'](request.POST or None, prefix='location')

        if form_application.is_valid() and formset_page.is_valid() and formset_location.is_valid():
            app_id = form_application.cleaned_data['names'].id
            app_instance = Application.objects.get(pk=app_id)

            for i in range(len(formset_page)):
                page_id = formset_page[i].cleaned_data['id']
                name = formset_page[i].cleaned_data['name']

                page_instance = page_id
                page_instance.name = name
                page_instance.application_id = app_instance

                page_instance.save()

                deleted_locations = formset_location.deleted_forms

                for location in formset_location:
                    if location['id'].value() not in [deleted['id'].value() for deleted in deleted_locations]:
                        loc_id = location.cleaned_data['id']
                        is_slider = location.cleaned_data['is_slider']
                        name = location.cleaned_data['name']
                        loc_code = location.cleaned_data['loc_code']
                        width = location.cleaned_data['width']
                        height = location.cleaned_data['height']

                        if loc_id != None:
                            loc_instance = loc_id
                            loc_instance.is_slider = is_slider
                            loc_instance.name = name
                            loc_instance.loc_code = loc_code
                            loc_instance.width = width
                            loc_instance.height = height

                            loc_instance.save()
                        else:
                            loc_instance = Location(is_slider=is_slider, name=name, loc_code=loc_code, width=width, height=height, page_id=page_instance.id)
                            loc_instance.save()

                            campaign_instance = Campaign(date_created=datetime.date.today(), priority=0, location_id=loc_instance.id)
                            campaign_instance.save()

                            installation_instance = Installation(campaign_id=campaign_instance.id)
                            installation_instance.save()
            
            for deleted in deleted_locations:
                location_instance = Location.objects.get(pk=deleted['id'].value())
                campaign_instances = Campaign.objects.filter(location_id=location_instance)
                installation_instances = Installation.objects.filter(campaign_id__in=campaign_instances)

                for installation in installation_instances:
                    installation.delete()
                for campaign in campaign_instances:
                    campaign.delete()
                location_instance.delete()

            messages.add_message(request, messages.INFO, "Halaman berhasil di-update!", extra_tags="page_updated")

            return redirect(reverse('app:page'))

        else:
            print('error dari app: ' + str(form_application.errors))
            print('error dari page: ' + str(formset_page.errors))
            print('error dari location: ' + str(formset_location.errors))
            return redirect(reverse('app:page'))

@method_decorator([login_required, developer_required], name='dispatch')
class ArchivePageView(View):
    def post(self, request, pk):
        page_instance = Page.objects.get(pk=pk)

        if page_instance.is_archived == True:
            page_instance.is_archived = False
            page_instance.save()
            messages.add_message(request, messages.INFO, "Halaman berhasil di-unarchive!", extra_tags="page_unarchived")

            return redirect(reverse('app:page'))
        else:
            page_instance.is_archived = True
            page_instance.save()
            messages.add_message(request, messages.INFO, "Halaman berhasil di-archive!", extra_tags="page_archived")

            return redirect(reverse('app:page'))

@method_decorator([login_required, developer_required], name='dispatch')
class DeletePageView(View):
    def post(self, request, pk):
        page_instance = Page.objects.get(pk=pk)
        location_instances = Location.objects.filter(page_id=pk)

        page_instance.delete()
        for location in location_instances:
            location.delete()

        messages.add_message(request, messages.INFO, "Halaman berhasil dihapus!", extra_tags="page_deleted")
        return redirect(reverse('app:page'))

@method_decorator(login_required, name='dispatch')
class ActiveLocationView(View):
    def post(self, request, pk):
        location_instance = Location.objects.get(pk=pk)

        if location_instance.is_active == True:
            location_instance.is_active = False
            location_instance.save()
            messages.add_message(request, messages.INFO, "Lokasi berhasil di-nonaktifkan!", extra_tags="location_inactivated")

            return redirect(reverse('app:page'))
        else:
            location_instance.is_active = True
            location_instance.save()
            messages.add_message(request, messages.INFO, "Lokasi berhasil diaktifkan!", extra_tags="location_activated")

            return redirect(reverse('app:page'))

@method_decorator([login_required, marketing_required], name='dispatch')
class BannerView(View):
    template_name = 'app/banner.html'

    def get(self, request):
        banners = Banner.objects.all().order_by('pk')
        installations = Installation.objects.values('banner_id', 'campaign_id').order_by('banner_id')

        contents = []

        for i in range(len(banners)):
            contents.append({'id': banners[i].id, 'name': banners[i].name, 'caption': banners[i].caption, 'description' : banners[i].description, 'width': banners[i].width, 'height': banners[i].height, 'image': banners[i].image, 'is_archived': banners[i].is_archived, 'is_active': False})
            for installation in installations:
                if installation['banner_id'] == banners[i].id:
                    if Campaign.objects.filter(Q(pk=installation['campaign_id'], valid_date_start__gte=datetime.date.today()) | Q(pk=installation['campaign_id'], valid_date_start__isnull=True)).exists():
                        contents[i]['is_active'] = True


        context = {
            'contents': contents,
        }

        return render(request, self.template_name, context)

@method_decorator([login_required, marketing_required], name='dispatch')
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
            caption = form_banner.cleaned_data['caption']
            description = form_banner.cleaned_data['description']
            image = form_banner.cleaned_data['image']
            width = form_banner.cleaned_data['width']
            height = form_banner.cleaned_data['height']

            banner_instance = Banner(name=name, description=description, caption=caption, image=image, width=width, height=height)
            banner_instance.save()

            messages.add_message(request, messages.INFO, "Gambar berhasil ditambahkan!", extra_tags="banner_added")

            return redirect(reverse('app:banner'))

        else:
            context = {
                'form_banner' : form_banner,
            }

            return render(request, self.template_name, context)

@method_decorator([login_required, marketing_required], name='dispatch')
class UpdateBannerView(View):
    form_class = {
        'form_banner' : BannerForm,
    }

    initial = {'key', 'value'}
    template_name = 'app/update_banner_form.html'

    def get(self, request, pk):
        banner_instance = Banner.objects.get(pk=pk)

        form_banner = self.form_class['form_banner'](initial={'id' : banner_instance.id, 'name' : banner_instance.name, 'caption' : banner_instance.caption, 'description' : banner_instance.description, 'image' : banner_instance.image, 'width' : banner_instance.width, 'height' : banner_instance.height })

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
            caption = form_banner.cleaned_data['caption']
            description = form_banner.cleaned_data['description']
            image = form_banner.cleaned_data['image']
            width = form_banner.cleaned_data['width']
            height = form_banner.cleaned_data['height']

            if image == None:
                banner_instance.name = name
                banner_instance.caption = caption
                banner_instance.description = description
                banner_instance.width = width
                banner_instance.height = height
            else:
                banner_instance.image.delete()

                banner_instance.name = name
                banner_instance.caption = caption
                banner_instance.description = description
                banner_instance.image = image
                banner_instance.width = width
                banner_instance.height = height

            banner_instance.save()
        
            messages.add_message(request, messages.INFO, "Gambar berhasil di-update!", extra_tags="banner_updated")

            return redirect(reverse('app:banner'))

        else:
            context = {
                'banner' : banner_instance,
                'form_banner' : form_banner,
            }

            return render(request, self.template_name, context)

@method_decorator([login_required, marketing_required], name='dispatch')
class ArchiveBannerView(View):
    def post(self, request, pk):
        banner_instance = Banner.objects.get(pk=pk)

        if banner_instance.is_archived == True:
            banner_instance.is_archived = False
            banner_instance.save()
            messages.add_message(request, messages.INFO, "Gambar berhasil di-unarchive!", extra_tags="banner_unarchived")

            return redirect(reverse('app:banner'))
        else:
            banner_instance.is_archived = True
            banner_instance.save()
            messages.add_message(request, messages.INFO, "Gambar berhasil di-archive!", extra_tags="banner_archived")

            return redirect(reverse('app:banner'))

@method_decorator([login_required, marketing_required], name='dispatch')
class DeleteBannerView(View):
    def post(self, request, pk):
        banner_instance = Banner.objects.get(pk=pk)
        banner_instance.delete()

        messages.add_message(request, messages.INFO, "Gambar berhasil dihapus!", extra_tags="banner_deleted")

        return redirect(reverse('app:banner'))

@method_decorator([login_required, marketing_required], name='dispatch')
class InstallationView(View):
    template_name = 'app/installation.html'

    def get(self, request):
        apps = Application.objects.all().order_by('pk')
        pages = Page.objects.all().order_by('pk')
        locations = Location.objects.all().order_by('pk')
        campaigns_0 = Campaign.objects.filter(priority=0).order_by('pk')
        campaigns = Campaign.objects.all().exclude(priority=0).order_by('pk')
        banners = Banner.objects.all().order_by('pk')

        contents_0 = []

        for i in range(len(campaigns_0)):
            if Installation.objects.filter(campaign_id=campaigns_0[i].id).exists():

                contents_0.append({'loc_id' : None, 'page_id' : None, 'app' : None, 'app_id' : None, 'page' : None, 'location' : None, 'banners' : [], 'campaign_id' : campaigns_0[i].id, 'campaign_code' : campaigns_0[i].campaign_code, 'priority' : campaigns_0[i].priority, 'valid_date' : None, 'status' : 'Active'})

                installs = Installation.objects.filter(campaign_id=contents_0[-1]['campaign_id']).order_by('pk')
                for install in installs:
                    if install.banner_id != None:
                        contents_0[-1]['banners'].append(Banner.objects.get(pk=install.banner_id))

                for location in locations:
                    if campaigns_0[i].location_id == location.id:
                        contents_0[i]['loc_id'] = location.loc_code
                        contents_0[i]['location'] = location.name
                        contents_0[i]['page_id'] = location.page_id

                for page in pages:
                    for j in range(len(contents_0)):
                        if contents_0[j]['page_id'] == page.id:
                            contents_0[j]['page'] = page.name
                            contents_0[j]['app_id'] = page.application_id

                for app in apps:
                    for j in range(len(contents_0)):
                        if contents_0[j]['app_id'] == app.id:
                            contents_0[j]['app'] = app.name

        contents = []

        for i in range(len(campaigns)):
            if Installation.objects.filter(campaign_id=campaigns[i].id).exists():

                # Validate Valid Date
                valid_date = None
                if campaigns[i].valid_date_start != None:
                    start = campaigns[i].valid_date_start.strftime('%d/%m/%Y')
                    valid_date = start + ' s/d '
                else:
                    valid_date = None

                if campaigns[i].valid_date_end != None:
                    end = campaigns[i].valid_date_end.strftime('%d/%m/%Y')
                    valid_date = valid_date + end
                else:
                    valid_date = None

                status = None
                if (campaigns[i].valid_date_start != None) and (campaigns[i].valid_date_start != None):
                    if (datetime.date.today() >= campaigns[i].valid_date_start) and (datetime.date.today() <= campaigns[i].valid_date_end):
                        status = 'Active'
                    elif datetime.date.today() > campaigns[i].valid_date_end:
                        status = 'Completed'
                    else:
                        status = 'Upcoming'
                else:
                    status = ''

                contents.append({'loc_id' : None, 'page_id' : None, 'app' : None, 'app_id' : None, 'page' : None, 'location' : None, 'banners' : [], 'campaign_id' : campaigns[i].id, 'campaign_code' : campaigns[i].campaign_code, 'priority' : campaigns[i].priority, 'valid_date' : valid_date, 'status' : status})

                installs = Installation.objects.filter(campaign_id=contents[-1]['campaign_id']).order_by('pk')
                for install in installs:
                    if install.banner_id != None:
                        contents[-1]['banners'].append(Banner.objects.get(pk=install.banner_id))

                for location in locations:
                    if campaigns[i].location_id == location.id:
                        contents[i]['loc_id'] = location.loc_code
                        contents[i]['location'] = location.name
                        contents[i]['page_id'] = location.page_id

                for page in pages:
                    for j in range(len(contents)):
                        if contents[j]['page_id'] == page.id:
                            contents[j]['page'] = page.name
                            contents[j]['app_id'] = page.application_id

                for app in apps:
                    for j in range(len(contents)):
                        if contents[j]['app_id'] == app.id:
                            contents[j]['app'] = app.name

        context = {
            'contents_0' : contents_0,
            'contents' : contents,
            'apps' : apps,
            'pages' : pages,
        }

        return render(request, self.template_name, context)

@method_decorator([login_required, marketing_required], name='dispatch')
class AddInstallationView(View):
    form_class = {
        'formset_campaign' : CampaignFormSet,
        'formset_installation' : InstallationFormSet,
    }

    inital = {'key' : 'value'}
    template_name = 'app/add_installation_form.html'

    def get(self, request):
        formset_campaign = self.form_class['formset_campaign'](prefix='campaign', queryset=Campaign.objects.none())
        formset_installation = self.form_class['formset_installation'](prefix='installation', queryset=Installation.objects.none())

        context = {
            'formset_campaign' : formset_campaign,
            'formset_installation' : formset_installation,
            'apps' : Application.objects.all(),
        }

        return render(request, self.template_name, context)

    def post(self, request):
        formset_campaign = self.form_class['formset_campaign'](request.POST or None, prefix='campaign', queryset=Campaign.objects.none())
        formset_installation = self.form_class['formset_installation'](request.POST or None, prefix='installation', queryset=Installation.objects.none())

        fieldsets = request.POST.get('installation-TOTAL_FIELDSETS', '')

        if formset_installation.is_valid() and formset_campaign.is_valid():
            for i in range(int(fieldsets)):
                location = request.POST.get('location-select-' + str(i), '')
                min_banner = request.POST.get('banner-' + str(i) + '-min', '')
                max_banner = request.POST.get('banner-' + str(i) + '-max', '')

                installation = formset_installation.cleaned_data
                campaign = formset_campaign.cleaned_data

                if campaign[i]:
                    campaign_code = campaign[i]['campaign_code']
                    priority = campaign[i]['priority']

                    daterange = request.POST.get('campaign-' + str(i) + '-daterangepicker', '').split(' - ')

                    startDate = datetime.datetime.strptime(daterange[0], '%d/%m/%Y').strftime('%Y-%m-%d')
                    endDate = datetime.datetime.strptime(daterange[1], '%d/%m/%Y').strftime('%Y-%m-%d')

                    campaign_instance = Campaign(location_id=location, campaign_code=campaign_code, priority=priority, date_created=datetime.date.today(), valid_date_start=startDate, valid_date_end=endDate)
                    campaign_instance.save()

                for j in range(int(min_banner), int(max_banner)+1):

                    if installation[j]:
                        banner = installation[j]['banner_names'].id
                        banner_instance = Banner.objects.get(pk=banner)
                        redirect = installation[j]['redirect']

                        installation_instance = Installation(banner=banner_instance, campaign=campaign_instance, redirect=redirect)
                        installation_instance.save()
                        
            messages.add_message(request, messages.INFO, "Pemasangan Banner berhasil ditambahkan!", extra_tags="install_added")

            return HttpResponseRedirect(reverse('app:install'))
        else:
            print(formset_installation.errors)
            print(formset_campaign.errors)
            
            return HttpResponseRedirect(reverse('app:install'))

@method_decorator([login_required, marketing_required], name='dispatch')
class UpdateInstallationView(View):
    form_class = {
        'formset_campaign' : CampaignFormSet,
        'formset_installation' : InstallationFormSet,
    }

    initial = {'key', 'value'}
    template_name = 'app/update_installation_form.html'

    def get(self, request, pk):
        campaign_instance = Campaign.objects.get(pk=pk)
        location_instance = Location.objects.get(pk=campaign_instance.location_id)
        page_instance = Page.objects.get(pk=location_instance.page_id)
        app_instance = Application.objects.get(pk=page_instance.application_id)
        installation_instance = Installation.objects.filter(campaign_id=campaign_instance.pk).order_by('pk')

        valid_date = None
        if campaign_instance.valid_date_start != None:
            start = campaign_instance.valid_date_start.strftime('%d/%m/%Y')
            valid_date = start + ' - '
        else:
            valid_date = None

        if campaign_instance.valid_date_end != None:
            end = campaign_instance.valid_date_end.strftime('%d/%m/%Y')
            valid_date = valid_date + end
        else:
            valid_date=None

        initial_list_installation = []
        banners = []

        for installation in installation_instance:
            initial_list_installation.append({'id' : installation.id, 'banner_names' : installation.banner_id, 'campaign_code' : campaign_instance.campaign_code, 'priority' : campaign_instance.priority, 'daterangepicker' :  valid_date,  'redirect' : installation.redirect})
            if installation.banner_id != None:
                banners.append(Banner.objects.get(pk=installation.banner_id))

        initial_list_campaign = [{'id' : campaign_instance.id, 'campaign_code' : campaign_instance.campaign_code, 'priority' : campaign_instance.priority, 'daterangepicker' : valid_date}]

        formset_campaign = self.form_class['formset_campaign'](queryset=Campaign.objects.none(), initial=initial_list_campaign, prefix='campaign')
        formset_campaign.extra = 1

        formset_installation = self.form_class['formset_installation'](queryset=Installation.objects.none(), initial=initial_list_installation, prefix='installation')
        formset_installation.extra = len(installation_instance)

        context = {
            'campaign' : campaign_instance,
            'location' : location_instance,
            'page' : page_instance,
            'app' : app_instance,
            'formset_campaign' : formset_campaign,
            'formset_installation' : formset_installation,
            'banners' : banners,
        }

        return render(request, self.template_name, context)

    def post(self, request, pk):
        formset_campaign = self.form_class['formset_campaign'](request.POST or None, prefix='campaign')
        formset_installation = self.form_class['formset_installation'](request.POST or None, prefix='installation')

        if formset_installation.is_valid() and formset_campaign.is_valid():
            priority = formset_campaign[0].cleaned_data['priority']
            campaign_code = formset_campaign[0].cleaned_data['campaign_code']

            if formset_campaign[0].cleaned_data['daterangepicker'] != '':
                daterange = formset_campaign[0].cleaned_data['daterangepicker'].split(' - ')

                startDate = datetime.datetime.strptime(daterange[0], '%d/%m/%Y').strftime('%Y-%m-%d')
                endDate = datetime.datetime.strptime(daterange[1], '%d/%m/%Y').strftime('%Y-%m-%d')
            else:
                daterange = None

            campaign_instance = Campaign.objects.get(pk=pk)
            campaign_instance.campaign_code = campaign_code

            if priority == None:
                campaign_instance.priority = 0
            else:
                campaign_instance.priority = priority

            if daterange != None:
                campaign_instance.valid_date_start = startDate
                campaign_instance.valid_date_end = endDate
            else:
                campaign_instance.valid_date_start = None
                campaign_instance.valid_date_end = None
            
            campaign_instance.date_updated = datetime.date.today()

            campaign_instance.save()

            deleted_installations = formset_installation.deleted_forms

            for i in range(len(formset_installation)):
                if formset_installation[i]['id'].value() not in [deleted['id'].value() for deleted in deleted_installations]:
                    install_id = formset_installation[i].cleaned_data['id']
                    banner = formset_installation[i].cleaned_data['banner_names'].id
                    redirect = formset_installation[i].cleaned_data['redirect']

                    if install_id != None:
                        installation_instance = install_id
                        installation_instance.banner_id = banner
                        installation_instance.redirect = redirect

                        installation_instance.save()

                    else:
                        installation_instance = Installation(banner_id=banner, campaign_id=pk, redirect=redirect)
                        installation_instance.save()

            for deleted in deleted_installations:
                installation_instance = Installation.objects.get(pk=deleted['id'].value())
                installation_instance.delete()

            messages.add_message(request, messages.INFO, "Pemasangan Banner berhasil di-update!", extra_tags="install_updated")

            return HttpResponseRedirect(reverse('app:install'))

        else:
            print(formset_campaign.errors)
            print(formset_installation.errors)
            
            return HttpResponseRedirect(reverse('app:install'))

@method_decorator([login_required, marketing_required], name='dispatch')
class DetailInstallationView(View):
    template_name = 'app/detail_installation.html'

    def get(self, request, pk):
        installation_instance = Installation.objects.filter(campaign_id=pk).order_by('pk')
        campaign_instance = Campaign.objects.get(pk=pk)
        location_instance = Location.objects.get(pk=campaign_instance.location_id)
        page_instance = Page.objects.get(pk=location_instance.page_id)
        app_instance = Application.objects.get(pk=page_instance.application_id)
        banner_instance = Banner.objects.all()

        status = None
        if (campaign_instance.valid_date_start != None) and (campaign_instance.valid_date_start != None):
            if (datetime.date.today() >= campaign_instance.valid_date_start) and (datetime.date.today() <= campaign_instance.valid_date_end):
                status = 'Active'
            elif datetime.date.today() > campaign_instance.valid_date_end:
                status = 'Completed'
            else:
                status = 'Upcoming'
        elif campaign_instance.priority == 0:
            status = 'Active'
        else:
            status = ''

        context = {
            'installations' : installation_instance,
            'campaign' : campaign_instance,
            'location' : location_instance,
            'page' : page_instance,
            'app' : app_instance,
            'banners' : banner_instance,
            'status' : status,
        }
        
        return render(request, self.template_name, context)

@method_decorator([login_required, marketing_required], name='dispatch')
class DeleteInstallationView(View):
    def post(self, request, pk):
        installation_instances = Installation.objects.filter(campaign_id=pk)
        for installation in installation_instances:
            installation.delete()

        campaign_instance = Campaign.objects.get(pk=pk)
        campaign_instance.delete()

        messages.add_message(request, messages.INFO, "Pemasangan berhasil dihapus!", extra_tags="install_deleted")

        return HttpResponseRedirect(reverse('app:install'))

@method_decorator([login_required, superuser_required], name='dispatch')
class UserView(View):
    template_name = 'app/user.html'

    def get(self, request):
        users = User.objects.all().order_by('pk')

        contents = []

        for i in range(len(users)):
            contents.append({'id' : None, 'role' : None, 'email' : None, 'username' : None})
            contents[i]['id'] = users[i].id
            contents[i]['email'] = users[i].email
            contents[i]['username'] = users[i].username

            if users[i].is_superuser == True:
                contents[i]['role'] = 'Super Admin'
            elif users[i].is_developer == True:
                contents[i]['role'] = 'Developer'
            elif users[i].is_marketing == True:
                contents[i]['role'] = 'Marketing'

        roles = [
            (1, 'Super Admin'),
            (2, 'Developer'),
            (3, 'Marketing'),
        ]

        context = {
            'contents': contents,
            'roles': roles,
        }

        return render(request, self.template_name, context)

@method_decorator([login_required, superuser_required], name='dispatch')
class AddUserView(View):
    form_class = {
        'form_user' : UserForm,
    }

    inital = {'key' : 'value'}
    template_name = 'app/add_user_form.html'

    def get(self, request):
        form_user = self.form_class['form_user']()

        context = {
            'form_user' : form_user,
        }

        return render(request, self.template_name, context)

    def post(self, request):
        form_user = self.form_class['form_user'](request.POST or None)

        if form_user.is_valid():
            role = request.POST.get('roles')
            email = form_user.cleaned_data['email']
            username = form_user.cleaned_data['username']
            password = form_user.cleaned_data['password']

            subject_role = None

            if role == '1':
                user_instance = User(email=email, username=username, is_superuser=True)
                subject_role = 'Superuser'
            if role == '2':
                user_instance = User(email=email, username=username, is_developer=True)
                subject_role = 'Developer'
            elif role == '3':
                user_instance = User(email=email, username=username, is_marketing=True)
                subject_role = 'Marketing'

            user_instance.set_password(password)
            user_instance.save()

            html_content = render_to_string('app/mail_template.html', {'username' : username, 'email' : email, 'password' : password, 'role' : subject_role})

            send_mail(
                subject='Super Admin telah menambahkan anda sebagai ' + subject_role,
                message='',
                from_email='From <noreply@banner-slider-qa.holahalo.dev>',
                recipient_list=[email],
                html_message=html_content,
                fail_silently=True
            )

            messages.add_message(request, messages.INFO, "User berhasil ditambahkan!", extra_tags="user_added")

            return redirect(reverse('app:user'))
        else:
            context = {
                'form_user' : form_user,
            }

            return render(request, self.template_name, context)
    
@method_decorator([login_required], name='dispatch')
class UpdateUserView(View):
    form_class = {
        'form_user' : UserForm,
    }

    inital = {'key' : 'value'}
    template_name = 'app/update_user_form.html'

    def get(self, request):
        form_user = self.form_class['form_user'](initial={'username' : request.user.username, 'email' : request.user.email, 'password' : '1234567890'})

        context = {
            'form_user' : form_user,
        }

        return render(request, self.template_name, context)

@method_decorator([login_required], name='dispatch')
class UpdateUsernameView(View):
    def post(self, request, pk):
        user = User.objects.get(id=pk)

        new_username = request.POST.get('newUsernameInput')
        confirm_password = request.POST.get('passwordConfirm')

        if user.check_password('{}'.format(confirm_password)):

            if not new_username.isalnum():
                messages.add_message(request, messages.INFO, "Username tidak valid", extra_tags="username_error")
                return redirect(reverse('app:update_user'))
            else:
                try:
                    user = User.objects.exclude(pk=pk).get(username=new_username)
                    messages.add_message(request, messages.INFO, "Username telah dipakai!", extra_tags="username_used")

                    return redirect(reverse('app:update_user'))
                except User.DoesNotExist:
                    user.username = new_username
                    user.save()
                    messages.add_message(request, messages.INFO, "Username berhasil diubah!", extra_tags="username_changed")

                    return redirect(reverse('app:update_user'))
        else:
            messages.add_message(request, messages.INFO, "Password Salah!", extra_tags="password_wrong")

            return redirect(reverse('app:update_user'))

@method_decorator([login_required], name='dispatch')
class UpdateEmailView(View):
    def post(self, request, pk):
        user = User.objects.get(id=pk)

        new_email = request.POST.get('newEmailInput')
        confirm_password = request.POST.get('passwordConfirm')
        pattern = re.compile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

        if user.check_password('{}'.format(confirm_password)):
            if not pattern.match(new_email):
                messages.add_message(request, messages.INFO, "Email tidak valid", extra_tags="email_error")
                return redirect(reverse('app:update_user'))
            else:
                try:
                    user = User.objects.exclude(pk=pk).get(email=new_email)
                    messages.add_message(request, messages.INFO, "Email telah dipakai!", extra_tags="email_used")

                    return redirect(reverse('app:update_user'))
                except User.DoesNotExist:
                    user.email = new_email
                    user.save()
                    messages.add_message(request, messages.INFO, "Email berhasil diubah!", extra_tags="email_changed")

                    return redirect(reverse('app:update_user'))
        else:
            messages.add_message(request, messages.INFO, "Password Salah!", extra_tags="password_wrong")

            return redirect(reverse('app:update_user'))

@method_decorator([login_required], name='dispatch')
class UpdatePasswordView(View):
    def post(self, request, pk):
        user = User.objects.get(pk=pk)

        new_password = request.POST.get('newPasswordConfirm')
        confirm_password = request.POST.get('oldPasswordInput')

        isascii = lambda s: len(s) == len(s.encode())

        if user.check_password('{}'.format(confirm_password)):
            if not isascii(new_password):
                messages.add_message(request, messages.INFO, "Password tidak valid", extra_tags="password_error")
                return redirect(reverse('app:update_user'))

            elif len(new_password) < 8:
                messages.add_message(request, messages.INFO, "Password kurang dari 8 karakter", extra_tags="password_less")
                return redirect(reverse('app:update_user'))

            else:
                user.set_password(new_password)
                user.save()

                messages.add_message(request, messages.INFO, "Password berhasil diubah!", extra_tags="password_changed")

                return redirect(reverse('app:update_user'))
        else:
            messages.add_message(request, messages.INFO, "Password Salah!", extra_tags="password_wrong")

            return redirect(reverse('app:update_user'))

@method_decorator([login_required, superuser_required], name='dispatch')
class DeleteUserView(View):
    def post(self, request, pk):
        user = User.objects.get(id=pk)
        user.delete()

        messages.add_message(request, messages.INFO, "User berhasil dihapus!", extra_tags="user_deleted")

        return redirect(reverse('app:user'))

@method_decorator([login_required, marketing_required], name='dispatch')
class KeywordListPage(View):
    form_class = {
        'date' : KeywordDateRangeForm
    }
    inital = {'key' : 'value'}
    template_name = 'app/keyword.html'

    def get(self, request, *args, **kwargs):
        form_date = self.form_class['date']()

        counts = services.get_count_keywords()

        context = {
            'counts': counts,
            'form_date': form_date,
            'apps' : Application.objects.all(),
        }

        if request.GET.get('filter') == '':
            date1 = request.GET.get("date1", "")
            date2 = request.GET.get("date2", "")

            counts = services.get_count_keywords_with_params(date1=date1, date2=date2)

            context['counts'] = counts
            context['date1'] = date1
            context['date2'] = date2
            
        return render(request, self.template_name, context)

@login_required
def check_location_code_available_add(request):
    value = request.GET.get('value')
    app_value = request.GET.get('app_value')
    check = True

    pages = Page.objects.filter(application_id=app_value)

    if Location.objects.filter(loc_code=value, page_id__in=pages).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_location_code_available_update(request):
    value = request.GET.get('value')
    app_value = request.GET.get('app_value')
    loc_id = request.GET.get('loc_id')
    check = True

    pages = Page.objects.filter(application_id=app_value)

    if Location.objects.filter(loc_code=value, page_id__in=pages).exclude(id=loc_id).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_campaign_code_available_add(request):
    loc_id = request.GET.get('loc_id')
    value = request.GET.get('value')
    check = False

    if Campaign.objects.filter(location_id=loc_id, campaign_code=value).exists():
        check = True
    else:
        check = False

    return HttpResponse(check)

@login_required
def check_campaign_code_available_update(request):
    loc_id = request.GET.get('loc_id')
    value = request.GET.get('value')
    default_value = request.GET.get('default_value')
    check = False

    if value == '':
        return HttpResponse(check)

    if Campaign.objects.filter(location_id=loc_id, campaign_code=value).exclude(campaign_code=default_value).exists():
        check = True
    else:
        check = False

    return HttpResponse(check)

@login_required
def check_priority_available_add(request):
    loc_id = request.GET.get('loc_id')
    value = request.GET.get('value')
    check = False

    if value == '':
        return HttpResponse(check)

    if Campaign.objects.filter(location_id=loc_id, priority=int(value)).exists():
        check = True
    else:
        check = False

    return HttpResponse(check)

@login_required
def check_priority_available_update(request):
    loc_id = request.GET.get('loc_id')
    value = request.GET.get('value')
    default_value = request.GET.get('default_value')
    check = False

    if value == '':
        return HttpResponse(check)

    if Campaign.objects.filter(location_id=loc_id, priority=int(value)).exclude(priority=int(default_value)).exists():
        check = True
    else:
        check = False

    return HttpResponse(check)

@login_required
def load_pages(request):
    app_id = request.GET.get('app_id')
    pages = Page.objects.filter(application_id=app_id, is_archived=False)
    return render(request, 'app/pages_dropdown_list_options.html', {'pages': pages})

@login_required
def load_locations(request):
    page_id = request.GET.get('page_id')
    locations = Location.objects.filter(page_id=page_id)

    return render(request, 'app/locations_dropdown_list_options.html', {'locations': locations})

@login_required
def load_location_size(request):
    location_id = request.GET.get('location_id')
    location = Location.objects.get(pk=location_id)
    location_size = str(location.width) + " x " + str(location.height)
    return HttpResponse(location_size + ',' + str(location.is_slider))

@login_required
def load_banner(request):
    banner_id = request.GET.get('banner_id')
    banner = Banner.objects.get(pk=banner_id)
    banner_size = str(banner.width) + " x " + str(banner.height)
    return HttpResponse(banner_size + ',' + banner.image.url)

@login_required
def check_similar_page_add(request):
    value = request.GET.get('value')
    app_value = request.GET.get('app_value')
    check = True
    if Page.objects.filter(name__iexact=value, application_id=app_value).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_page_update(request):
    page_id = request.GET.get('page_id')
    value = request.GET.get('value')
    app_value = request.GET.get('app_value')
    check = True
    if Page.objects.filter(name__iexact=value, application_id=app_value).exclude(id=page_id).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_location_add(request):
    value = request.GET.get('value')
    app_id = request.GET.get('app_id')
    page_value = request.GET.get('page_value')

    check = True

    pages = Page.objects.filter(name=page_value, application_id=app_id)

    if Location.objects.filter(name=value, page_id__in=pages).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_location_update(request):
    value = request.GET.get('value')
    app_id = request.GET.get('app_id')
    page_value = request.GET.get('page_value')
    loc_id = request.GET.get('loc_id')
    check = True

    pages = Page.objects.filter(name=page_value, application_id=app_id)

    if Location.objects.filter(name=value, page_id__in=pages).exclude(id=loc_id).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_app_name_add(request):
    value = request.GET.get('value')
    check = True

    if Application.objects.filter(name=value).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_app_name_update(request):
    value = request.GET.get('value')
    app_id = request.GET.get('app_id')
    check = True

    if Application.objects.filter(name=value).exclude(id=app_id).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_app_code_add(request):
    value = request.GET.get('value')
    check = True

    if Application.objects.filter(app_code=value).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_app_code_update(request):
    value = request.GET.get('value')
    app_id = request.GET.get('app_id')
    check = True

    if Application.objects.filter(app_code=value).exclude(id=app_id).exists():
        check = False

    return HttpResponse(check)

@login_required
def check_similar_date_add(request):
    value = request.GET.get('value')
    loc_id = request.GET.get('loc_id')
    check = False
    cmp_total = 0

    if value != '':
        valid_date_start = datetime.datetime.strptime(value.split(' - ')[0], '%d/%m/%Y').strftime('%Y-%m-%d')
        valid_date_end = datetime.datetime.strptime(value.split(' - ')[1], '%d/%m/%Y').strftime('%Y-%m-%d')

        if Campaign.objects.filter(
            Q(location_id=loc_id, valid_date_start__gte=valid_date_start, valid_date_end__lte=valid_date_end) |
            Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_end) |
            Q(Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_start) | Q(location_id=loc_id, valid_date_start__lte=valid_date_end, valid_date_end__gte=valid_date_end))
            ).exists():
            check = True
            cmp_total = Campaign.objects.filter(
            Q(location_id=loc_id, valid_date_start__gte=valid_date_start, valid_date_end__lte=valid_date_end) |
            Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_end) |
            Q(Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_start) | Q(location_id=loc_id, valid_date_start__lte=valid_date_end, valid_date_end__gte=valid_date_end))
            ).count()
        else:
            check = False

        return HttpResponse(str(check) + ',' + str(cmp_total))

    else:
        return HttpResponse(str(check) + ',' + str(cmp_total))

@login_required
def check_similar_date_update(request):
    value = request.GET.get('value')
    loc_id = request.GET.get('loc_id')
    check = False
    cmp_total = 0

    if value != '':
        valid_date_start = datetime.datetime.strptime(value.split(' - ')[0], '%d/%m/%Y').strftime('%Y-%m-%d')
        valid_date_end = datetime.datetime.strptime(value.split(' - ')[1], '%d/%m/%Y').strftime('%Y-%m-%d')

        if Campaign.objects.filter(
            Q(location_id=loc_id, valid_date_start__gte=valid_date_start, valid_date_end__lte=valid_date_end) |
            Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_end) |
            Q(Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_start) | Q(location_id=loc_id, valid_date_start__lte=valid_date_end, valid_date_end__gte=valid_date_end))
            ).exclude(location_id=loc_id).exists():
            check = True
            cmp_total = Campaign.objects.filter(
            Q(location_id=loc_id, valid_date_start__gte=valid_date_start, valid_date_end__lte=valid_date_end) |
            Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_end) |
            Q(Q(location_id=loc_id, valid_date_start__lte=valid_date_start, valid_date_end__gte=valid_date_start) | Q(location_id=loc_id, valid_date_start__lte=valid_date_end, valid_date_end__gte=valid_date_end))
            ).exclude(location_id=loc_id).count()
        else:
            check = False

        return HttpResponse(str(check) + ',' + str(cmp_total))

    else:
        return HttpResponse(str(check) + ',' + str(cmp_total))