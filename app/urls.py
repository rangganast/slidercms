from . import views
from django.urls import path, include
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView
from .forms import LoginForm

app_name = 'app'

urlpatterns = [
    path('', login_required(RedirectView.as_view(url='page/', permanent=False)), name='home'),

    path('keywords/', login_required(views.KeywordListPage.as_view()), name='keywords'),
    path('page/', login_required(views.PageView.as_view()), name='page'),
    path('page/add_page/', login_required(views.AddPageView.as_view()), name='add_page'),
    path('page/update_page/<str:pk>/', login_required(views.UpdatePageView.as_view()), name='update_page'),
    path('page/archive_page/<str:pk>/', login_required(views.ArchivePageView.as_view()), name='archive_page'),

    path('banner/', login_required(views.BannerView.as_view()), name='banner'),
    path('banner/add_banner/', login_required(views.AddBannerView.as_view()), name='add_banner'),
    path('banner/update_banner/<str:pk>/', login_required(views.UpdateBannerView.as_view()), name='update_banner'),
    path('banner/archive_banner/<str:pk>/', login_required(views.ArchiveBannerView.as_view()), name='archive_banner'),

    path('installation/', login_required(views.InstallationView.as_view()), name='install'),
    path('installation/add_installation/', login_required(views.AddInstallationView.as_view()), name='add_install'),
    path('installation/active_installation/<str:pk>/', login_required(views.ActiveInstallationView.as_view()), name='active_install'),
    path('installation/detail_installation/<str:pk>/', login_required(views.DetailInstallationView.as_view()), name='detail_install'),
    path('installation/update_installation/<str:pk>/', login_required(views.UpdateInstallationView.as_view()), name='update_install'),

    path('ajax/load-pages/', login_required(views.load_pages), name='ajax_load_pages'),
    path('ajax/load-locations/', login_required(views.load_locations), name='ajax_load_locations'),
    path('ajax/load-banner/', login_required(views.load_banner), name='ajax_load_banner'),
    path('ajax/load-location-size/', login_required(views.load_location_size), name='ajax_load_location_size'),
    path('ajax/check-similar-page-add/', login_required(views.check_similar_page_add), name='ajax_check_similar_page_add'),
    path('ajax/check-similar-page-update/', login_required(views.check_similar_page_update), name='ajax_check_similar_page_update'),
    path('ajax/check-similar-location/', login_required(views.check_similar_location_add), name='ajax_check_similar_location_add'),

    path('login/', auth_views.LoginView.as_view(authentication_form=LoginForm, redirect_authenticated_user=True), name='login'),
    path('logout/', login_required(auth_views.LogoutView.as_view()), name='logout'),
]