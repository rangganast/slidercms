# Generated by Django 3.0.3 on 2020-06-08 03:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20200608_1022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='app_code',
            field=models.CharField(blank=True, max_length=30, null=True, unique=True),
        ),
    ]
