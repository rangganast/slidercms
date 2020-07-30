from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Max
from django.core.validators import RegexValidator
from django.utils import timezone

class User(AbstractUser):
    is_developer = models.BooleanField('developer status', default=False)
    is_marketing = models.BooleanField('marketing status', default=False)
    email = models.EmailField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.username

class Application(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    app_code = models.CharField(max_length=30, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    is_archived = models.BooleanField(default=False)

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
    loc_code = models.CharField(max_length=30, null=True, blank=True, unique=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='pages')
    is_slider = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
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
    caption = models.TextField()
    description = models.TextField(blank=True, null=True)
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
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='locations')
    campaign_code = models.CharField(max_length=30, null=True, blank=True)
    priority = models.IntegerField(null=True, blank=True)
    date_created = models.DateField(null=True, blank=True)
    date_updated = models.DateField(null=True, blank=True)
    valid_date_start = models.DateField(null=True, blank=True)
    valid_date_end = models.DateField(null=True, blank=True)

    def save(self, **kwargs):
        if not self.id:
            max = Campaign.objects.aggregate(id_max=Max('id'))['id_max']
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
    banner = models.ForeignKey(Banner, on_delete=models.CASCADE, related_name='banners', blank=True, null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='campaigns')
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

source_choices = (
    ('random', 'Generate nomor secara acak'),
    ('csv', 'Upload file .csv'),
)

class ContactSource(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=9)
    source = models.CharField(max_length=30, choices=source_choices)

    def __str__(self):
        return self.source

    def save(self, **kwargs):
        if not self.id:
            max = ContactSource.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "CONSRC" + "{0:03d}".format(max)
        super().save(*kwargs)

class Contact(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    source = models.ForeignKey(ContactSource, on_delete=models.CASCADE, related_name='contactsources')
    name = models.CharField(max_length=100)
    numbers = models.FileField(upload_to='pickles/contact/')
    is_deleted = models.BooleanField(default=False)
    deleted_datetime = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        if not self.id:
            max = Contact.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "CON" + "{0:03d}".format(max)
        super().save(*kwargs)

class GenerateContact(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=9)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='contact')
    first_code = models.CharField(max_length=4, validators=[RegexValidator(r'^\d{0,10}$')])
    digits = models.CharField(max_length=30, validators=[RegexValidator(r'^\d{0,10}$')])
    generate_numbers = models.CharField(max_length=30, validators=[RegexValidator(r'^\d{0,10}$')])

    def save(self, **kwargs):
        if not self.id:
            max = GenerateContact.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "GENCON" + "{0:03d}".format(max)
        super().save(*kwargs)

status_choices = (
    ('complete', 'Sudah Dikirim'),
    ('uncomplete', 'Belum Dikirim'),
)

class SMSBlast(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=6)
    message_title = models.CharField(max_length=100)
    message_text = models.CharField(max_length=160)
    send_date = models.DateField(null=True, blank=True)
    send_time = models.TimeField(null=True, blank=True)
    is_now = models.BooleanField(default=False)

    def __str__(self):
        return self.message_title

    def save(self, **kwargs):
        if not self.id:
            max = SMSBlast.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "SMS" + "{0:03d}".format(max)
        super().save(*kwargs)

class ContactAndSMS(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=12)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='smsncon_contact')
    smsblast = models.ForeignKey(SMSBlast, on_delete=models.CASCADE, related_name='smsncon_smsblast')

    def save(self, **kwargs):
        if not self.id:
            max = ContactAndSMS.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "CONANDSMS" + "{0:03d}".format(max)
        super().save(*kwargs)

class SMSBlastJob(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=9)
    job_id = models.CharField(max_length=100, blank=True, null=True)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='contact_job')
    smsblast = models.ForeignKey(SMSBlast, on_delete=models.CASCADE, related_name='smsblast_job')

    def __str__(self):
        return self.job_id

    def save(self, **kwargs):
        if not self.id:
            max = SMSBlastJob.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "SMSJOB" + "{0:03d}".format(max)
        super().save(*kwargs)

class SMSStatus(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=10)
    job = models.ForeignKey(SMSBlastJob, on_delete=models.CASCADE, related_name='job_status')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='contact_status')
    status = models.FileField(upload_to='pickles/status/')

    def __str__(self):
        return self.job_id

    def save(self, **kwargs):
        if not self.id:
            max = SMSStatus.objects.aggregate(id_max=Max('id'))['id_max']
            if max is not None:
                max = max[-3:]
                max = int(max)
                max += 1
            else:
                max = 1
            self.id = "SMSSTAT" + "{0:03d}".format(max)
        super().save(*kwargs)