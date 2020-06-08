from rest_framework import routers
from api import views

router = routers.DefaultRouter()

router.register(prefix=r'banner/(?P<app_code>[^/.]+)', viewset=views.LocationViewSet, basename='banner')