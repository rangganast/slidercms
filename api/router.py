from rest_framework import routers
from api.views import InstallationViewSet

router = routers.DefaultRouter()

router.register('banner', InstallationViewSet)