from rest_framework import viewsets
from app.models import Application, Page, Location, Banner, Installation
from api.serializers import InstallationSerializer
from rest_framework.permissions import DjangoModelPermissions

class InstallationViewSet(viewsets.ModelViewSet):
    queryset = Installation.objects.all().order_by('id')
    serializer_class = InstallationSerializer
    permission_classes = [DjangoModelPermissions]
    http_method_names = ['get', 'head']