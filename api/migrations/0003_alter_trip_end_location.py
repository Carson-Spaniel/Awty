# Generated by Django 5.1.2 on 2024-10-27 02:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_trip_end_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='end_location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]