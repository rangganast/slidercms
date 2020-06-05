from rest_framework import viewsets, status
from app.models import Application, Page, Location, Banner, Installation
from api.serializers import LocationSerializer
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [DjangoModelPermissions]
    http_method_names = ['get', 'head']
    lookup_field = 'loc_code'

    def get_serializer_context(self):
        context = super(LocationViewSet, self).get_serializer_context()
        context.update({'request' : self.request})
        return context

    def get_queryset(self):
        app_id = self.kwargs['app_id']
        pages = Page.objects.filter(application_id=app_id)

        try:
            loc = Location.objects.get(loc_code=self.kwargs['loc_code'])
        except Location.DoesNotExist:
            return Location.objects.none()
        else:
            page = get_object_or_404(Page, pk=loc.page_id)


        if page in pages:
            return Location.objects.filter(loc_code=self.kwargs['loc_code'])
        else:
            return Location.objects.none()