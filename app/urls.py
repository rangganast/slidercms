from . import views
from django.urls import path, include
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView
from .forms import LoginForm

app_name = 'app'

urlpatterns = [
    path('', login_required(RedirectView.as_view(url='page/', permanent=False)), name='home'),

    path('keywords/', views.KeywordListPage.as_view(), name='keywords'),
    path('page/', views.PageView.as_view(), name='page'),
    path('page/add_page/', views.AddPageView.as_view(), name='add_page'),
    path('page/update_page/<str:pk>/', views.UpdatePageView.as_view(), name='update_page'),
    path('page/archive_page/<str:pk>/', views.ArchivePageView.as_view(), name='archive_page'),
    path('page/delete_page/<str:pk>/', views.DeletePageView.as_view(), name='delete_page'),

    path('banner/', views.BannerView.as_view(), name='banner'),
    path('banner/add_banner/', views.AddBannerView.as_view(), name='add_banner'),
    path('banner/update_banner/<str:pk>/', views.UpdateBannerView.as_view(), name='update_banner'),
    path('banner/archive_banner/<str:pk>/', views.ArchiveBannerView.as_view(), name='archive_banner'),
    path('banner/delete_banner/<str:pk>/', views.DeleteBannerView.as_view(), name='delete_banner'),

    path('installation/', views.InstallationView.as_view(), name='install'),
    path('installation/add_installation/', views.AddInstallationView.as_view(), name='add_install'),
    path('installation/active_installation/<str:pk>/', views.ActiveInstallationView.as_view(), name='active_install'),
    path('installation/detail_installation/<str:pk>/', views.DetailInstallationView.as_view(), name='detail_install'),
    path('installation/update_installation/<str:pk>/', views.UpdateInstallationView.as_view(), name='update_install'),
    path('installation/delete_installation/<str:pk>/', views.DeleteInstallationView.as_view(), name='delete_install'),

    path('user/', views.UserView.as_view(), name='user'),
    path('user/add_user/', views.AddUserView.as_view(), name='add_user'),
    path('user/update_user/', views.UpdateUserView.as_view(), name='update_user'),
    path('user/update_user/username/<int:pk>/', views.UpdateUsernameView.as_view(), name='update_username'),
    path('user/update_user/email/<int:pk>/', views.UpdateEmailView.as_view(), name='update_email'),
    path('user/update_user/password/<int:pk>/', views.UpdatePasswordView.as_view(), name='update_password'),
    path('user/delete_user/<int:pk>/', views.DeleteUserView.as_view(), name='delete_user'),

    path('ajax/load-pages/', views.load_pages, name='ajax_load_pages'),
    path('ajax/load-locations/', views.load_locations, name='ajax_load_locations'),
    path('ajax/load-banner/', views.load_banner, name='ajax_load_banner'),
    path('ajax/load-location-size/', views.load_location_size, name='ajax_load_location_size'),
    path('ajax/check-similar-page-add/', views.check_similar_page_add, name='ajax_check_similar_page_add'),
    path('ajax/check-similar-page-update/', views.check_similar_page_update, name='ajax_check_similar_page_update'),
    path('ajax/check-similar-location/', views.check_similar_location_add, name='ajax_check_similar_location_add'),

    path('login/', auth_views.LoginView.as_view(authentication_form=LoginForm, redirect_authenticated_user=True), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]