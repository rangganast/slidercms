from rest_framework import serializers
from app.models import Location, Banner, Installation

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'application', 'page', 'is_slider', 'height', 'width', 'is_archived')

    application = serializers.SerializerMethodField('get_application')
    page = serializers.SerializerMethodField('get_page')

    def get_application(self, obj):
        return obj.page.application.id

    def get_page(self, obj):
        return obj.page.id

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'name', 'description' , 'image', 'is_archived')

class InstallationSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    banner = BannerSerializer()

    class Meta:
        model = Installation
        fields = ('id', 'location', 'banner', 'is_active', 'redirect')