from . import views
from django.urls import path, include
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView
from .forms import LoginForm

app_name = 'app'

urlpatterns = [
    path('', login_required(RedirectView.as_view(url='keywords/', permanent=False)), name='home'),

    path('keywords/', login_required(views.KeywordListPage.as_view()), name='keywords'),

    path('login/', auth_views.LoginView.as_view(authentication_form=LoginForm, redirect_authenticated_user=True), name='login'),
    path('logout/', login_required(auth_views.LogoutView.as_view()), name='logout'),
]