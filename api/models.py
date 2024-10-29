from django.db import models
from django.conf import settings

class Trip(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_location_lat = models.FloatField(max_length=255, blank=True,)
    start_location_long = models.FloatField(max_length=255, blank=True,)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Stop(models.Model):
    trip = models.ForeignKey(Trip, related_name='stops', on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']  # Ensures stops are ordered by the order field

    def __str__(self):
        return f"{self.location} - {self.trip.name}"

class Route(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE)
    route_data = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)