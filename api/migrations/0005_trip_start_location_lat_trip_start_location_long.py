# Generated by Django 5.1.2 on 2024-10-29 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_trip_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='start_location_lat',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='trip',
            name='start_location_long',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
