# Generated by Django 3.0.3 on 2020-04-09 02:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.CharField(editable=False, max_length=6, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.CharField(editable=False, max_length=5, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to='images/', verbose_name='Banner')),
                ('is_archived', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.CharField(editable=False, max_length=5, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='devices', to='app.Application')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.CharField(editable=False, max_length=5, primary_key=True, serialize=False)),
                ('is_slider', models.BooleanField()),
                ('name', models.CharField(max_length=100)),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('is_archived', models.BooleanField(default=False)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pages', to='app.Page')),
            ],
        ),
        migrations.CreateModel(
            name='Installation',
            fields=[
                ('id', models.CharField(editable=False, max_length=6, primary_key=True, serialize=False)),
                ('is_active', models.BooleanField()),
                ('redirect', models.URLField(null=True)),
                ('banner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='banners', to='app.Banner')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='locations', to='app.Location')),
            ],
        ),
    ]
