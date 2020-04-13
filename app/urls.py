from . import views
from django.urls import path, include
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView

app_name = 'app'

urlpatterns = [
    path('', RedirectView.as_view(url='page/', permanent=False), name='home'),
    path('page/', views.PageView.as_view(), name='page'),
    path('page/add_page/', views.AddPageView.as_view(), name='add_page'),
    # path('udpate_page/', views.UpdatePageView.as_view(), name='update_page'),
    path('banner/', views.BannerView.as_view(), name='banner'),
    path('banner/add_banner/', views.AddBannerForm.as_view(), name='add_banner'),
    path('banner/update_banner/<str:pk>/', views.UpdateBannerForm.as_view(), name='update_banner'),
    path('banner/archive_banner/', views.ArchiveBannerForm.as_view(), name='archive_banner'),
]