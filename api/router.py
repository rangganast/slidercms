from rest_framework import routers
from api import views

router = routers.SimpleRouter(trailing_slash=False)

router.register(prefix=r'banner/(?P<app_code>[^/.]+)', viewset=views.LocationViewSet, basename='banner')