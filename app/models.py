from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Max

class User(AbstractUser):
    is_developer = models.BooleanField('developer status', default=False)
    is_marketing = models.BooleanField('marketing status', default=False)
    email = models.EmailField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.username

class Application(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        if not self.id:
            max = Application.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "APP" + "{0:03d}".format(max)
        super().save(*kwargs)

class Page(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=5)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='applications')
    name = models.CharField(max_length=100)
    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        if not self.id:
            max = Page.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "PG" + "{0:03d}".format(max)
        super().save(*kwargs)

class Location(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='pages')
    is_slider = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    name = models.CharField(max_length=100)
    width = models.IntegerField()
    height = models.IntegerField()

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        if not self.id:
            max = Location.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "LOC" + "{0:03d}".format(max)
        super().save(*kwargs)

class Banner(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=5)
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', verbose_name='Banner', blank=True)
    height = models.IntegerField()
    width = models.IntegerField()
    is_archived = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        self.image.delete(save=False)

        super(Banner, self).delete(*args, **kwargs)

    def save(self, **kwargs):
        if not self.id:
            max = Banner.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "BN" + "{0:03d}".format(max)
        super().save(*kwargs)

class Campaign(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='campaign_location')
    campaign_code = models.CharField(max_length=30, unique=True, null=True, blank=True)
    priority = models.IntegerField(null=True, blank=True)
    valid_date_start = models.DateField(null=True, blank=True)
    valid_date_end = models.DateField(null=True, blank=True)

    def save(self, **kwargs):
        if not self.id:
            max = Installation.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "CMP" + "{0:03d}".format(max)
        super().save(*kwargs)

class Installation(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    banner = models.ForeignKey(Banner, on_delete=models.CASCADE, related_name='banners')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='campaigns')
    date_created = models.DateField(null=True, blank=True)
    date_updated = models.DateField(null=True, blank=True)
    redirect = models.URLField(null=True, blank=True)

    def save(self, **kwargs):
        if not self.id:
            max = Installation.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "INS" + "{0:03d}".format(max)
        super().save(*kwargs)