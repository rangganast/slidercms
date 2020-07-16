from . import views
from django.urls import reverse_lazy
from django.urls import path, include, re_path
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView
from .forms import LoginForm, PasswordResetForm, SetPasswordForm

app_name = 'app'

urlpatterns = [
    path('', login_required(RedirectView.as_view(url='page', permanent=False)), name='home'),

    path('keywords', views.KeywordListPage.as_view(), name='keywords'),
    path('keywords/ip/<int:pk>/<int:count>', views.KeywordIpDetailPage.as_view(), name='keyword_ip_detail'),
    path('keywords/scrape/<int:pk>', views.KeywordScrapeView.as_view(), name='keywords_scrape'),
    re_path(r'keywords/export$', views.export_excel, name='keywords_export'),

    path('smsblast/contact', views.ContactView.as_view(), name='smsblast_contact'),
    path('smsblast/add_contact', views.AddContactMethodsView.as_view(), name='smsblast_add_contact'),
    path('smsblast/detail_contact/<str:pk>', views.DetailContactView.as_view(), name='smsblast_detail_contact'),
    path('smsblast/archive_contact/<str:pk>', views.ArchiveContactView.as_view(), name='smsblast_archive_contact'),
    path('smsblast/delete_contact/<str:pk>', views.DeleteContactView.as_view(), name='smsblast_delete_contact'),
    path('smsblast/add_contact_group', views.AddContactGroupView.as_view(), name='smsblast_add_contact_group'),
    path('smsblast/add_random_generated_numbers', views.AddRandomGeneratedNumbersView.as_view(), name='smsblast_add_random_generated_numbers'),
    path('smsblast/generate_random_number', views.GenerateRandomContactView.as_view(), name='generate_random_contact'),
    path('smsblast/generate_csv', views.GenerateCSVContactView.as_view(), name='generate_csv'),
    path('smsblast/temp_random_contacts', views.TempRandomContactView.as_view(), name='temp_random_contacts'),
    path('smsblast/temp_csv_contacts', views.TempCSVContactView.as_view(), name='temp_csv_contacts'),

    path('app', views.AppView.as_view(), name='app'),
    path('app/add_app', views.AddAppView.as_view(), name='add_app'),
    path('app/update_app/<str:pk>', views.UpdateAppView.as_view(), name='update_app'),
    path('app/archive_app/<str:pk>', views.ArchiveAppView.as_view(), name='archive_app'),
    path('app/delete_app/<str:pk>', views.DeleteAppView.as_view(), name='delete_app'),

    path('page', views.PageView.as_view(), name='page'),
    path('page/add_page', views.AddPageView.as_view(), name='add_page'),
    path('page/update_page/<str:pk>', views.UpdatePageView.as_view(), name='update_page'),
    path('page/archive_page/<str:pk>', views.ArchivePageView.as_view(), name='archive_page'),
    path('page/delete_page/<str:pk>', views.DeletePageView.as_view(), name='delete_page'),
    path('location/active_location/<str:pk>', views.ActiveLocationView.as_view(), name='active_location'),

    path('banner', views.BannerView.as_view(), name='banner'),
    path('banner/add_banner', views.AddBannerView.as_view(), name='add_banner'),
    path('banner/update_banner/<str:pk>', views.UpdateBannerView.as_view(), name='update_banner'),
    path('banner/archive_banner/<str:pk>', views.ArchiveBannerView.as_view(), name='archive_banner'),
    path('banner/delete_banner/<str:pk>', views.DeleteBannerView.as_view(), name='delete_banner'),

    path('installation', views.InstallationView.as_view(), name='install'),
    path('installation/add_installation', views.AddInstallationView.as_view(), name='add_install'),
    path('installation/detail_installation/<str:pk>', views.DetailInstallationView.as_view(), name='detail_install'),
    path('installation/update_installation/<str:pk>', views.UpdateInstallationView.as_view(), name='update_install'),
    path('installation/delete_installation/<str:pk>', views.DeleteInstallationView.as_view(), name='delete_install'),

    path('user', views.UserView.as_view(), name='user'),
    path('user/add_user', views.AddUserView.as_view(), name='add_user'),
    path('user/update_user', views.UpdateUserView.as_view(), name='update_user'),
    path('user/update_user/username/<int:pk>', views.UpdateUsernameView.as_view(), name='update_username'),
    path('user/update_user/email/<int:pk>', views.UpdateEmailView.as_view(), name='update_email'),
    path('user/update_user/password/<int:pk>', views.UpdatePasswordView.as_view(), name='update_password'),
    path('user/delete_user/<int:pk>', views.DeleteUserView.as_view(), name='delete_user'),

    path('ajax/check-priority-available-add', views.check_priority_available_add, name='ajax_check_priority_available_add'),
    path('ajax/check-priority-available-update', views.check_priority_available_update, name='ajax_check_priority_available_update'),
    path('ajax/check-campaign-code-available-add', views.check_campaign_code_available_add, name='ajax_check_campaign_code_available_add'),
    path('ajax/check-campaign-code-available-update', views.check_campaign_code_available_update, name='ajax_check_campaign_code_available_update'),
    path('ajax/load-pages', views.load_pages, name='ajax_load_pages'),
    path('ajax/load-locations', views.load_locations, name='ajax_load_locations'),
    path('ajax/load-banner', views.load_banner, name='ajax_load_banner'),
    path('ajax/load-location-size', views.load_location_size, name='ajax_load_location_size'),
    path('ajax/load-regions', views.load_regions, name='ajax_load_regions'),
    path('ajax/load-cities', views.load_cities, name='ajax_load_cities'),
    path('ajax/check-similar-page-add', views.check_similar_page_add, name='ajax_check_similar_page_add'),
    path('ajax/check-similar-page-update', views.check_similar_page_update, name='ajax_check_similar_page_update'),
    path('ajax/check-similar-location-add', views.check_similar_location_add, name='ajax_check_similar_location_add'),
    path('ajax/check-similar-location-update', views.check_similar_location_update, name='ajax_check_similar_location_update'),
    path('ajax/check-location-code-add', views.check_location_code_available_add, name='ajax_check_location_code_add'),
    path('ajax/check-location-code-update', views.check_location_code_available_update, name='ajax_check_location_code_update'),
    path('ajax/check-app-name-add', views.check_similar_app_name_add, name='ajax_check_app_name_add'),
    path('ajax/check-app-name-update', views.check_similar_app_name_update, name='ajax_check_app_name_update'),
    path('ajax/check-app-code-add', views.check_similar_app_code_add, name='ajax_check_app_code_add'),
    path('ajax/check-app-code-update', views.check_similar_app_code_update, name='ajax_check_app_code_update'),
    path('ajax/check-similar-date-add', views.check_similar_date_add, name='ajax_check_similar_date_add'),
    path('ajax/check-similar-date-update', views.check_similar_date_update, name='ajax_check_similar_date_update'),
    path('ajax/check-contact-name-add', views.check_contact_name_add, name='ajax_check_contact_name_add'),

    re_path(r'login$', auth_views.LoginView.as_view(authentication_form=LoginForm, redirect_authenticated_user=True), name='login'),
    path('password_reset', auth_views.PasswordResetView.as_view(form_class=PasswordResetForm, success_url=reverse_lazy('app:password_reset_done'), html_email_template_name='registration/password_reset_email.html', from_email='noreply@banner-slider-qa.holahalo.dev'), name='password_reset'),
    path('password_reset_done', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    re_path(r'password_reset_confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})', auth_views.PasswordResetConfirmView.as_view(form_class=SetPasswordForm, success_url='/login?resetPassword=yes'), name='password_reset_confirm'),
    path('logout', auth_views.LogoutView.as_view(), name='logout'),
]