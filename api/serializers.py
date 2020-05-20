from rest_framework import serializers
from app.models import Location, Banner, Installation, Campaign
from django.conf import settings
from django.db.models import Max
import datetime

class InstallationSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_id')
    name = serializers.SerializerMethodField('get_name')
    description = serializers.SerializerMethodField('get_description')
    image = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Installation
        fields = ('id', 'name', 'description', 'image', 'redirect')
    
    def get_id(self, obj):
        return obj.banner.id

    def get_name(self, obj):
        return obj.banner.name
    
    def get_description(self, obj):
        return obj.banner.description
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.banner.image.url)

class LocationSerializer(serializers.ModelSerializer):
    application = serializers.SerializerMethodField('get_application')
    application_name = serializers.SerializerMethodField('get_application_name')
    page = serializers.SerializerMethodField('get_page')
    page_name = serializers.SerializerMethodField('get_page_name')
    banners = serializers.SerializerMethodField('get_installation')

    class Meta:
        model = Location
        fields = ('id', 'name', 'application', 'application_name', 'page', 'page_name', 'is_slider', 'width', 'height', 'banners',)

    def get_application(self, obj):
        return obj.page.application.id

    def get_application_name(self, obj):
        return obj.page.application.name

    def get_page(self, obj):
        return obj.page.id

    def get_page_name(self, obj):
        return obj.page.name

    def get_installation(self, obj):
        today = datetime.date.today()
        campaigns = Campaign.objects.filter(location_id=obj.id, valid_date_start__lte=today, valid_date_end__gte=today)
        
        if not campaigns:
            campaign_obj = Campaign.objects.get(location_id=obj.id, priority=0)
            inst_obj = Installation.objects.get(campaign_id=campaign_obj.id)
        else:
            inst_obj = Installation.objects.filter(campaign_id=campaigns.order_by('-priority')[0].id)

        serializer = InstallationSerializer(inst_obj, many=True, context=self.context)
        return serializer.data