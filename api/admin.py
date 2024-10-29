from django.contrib import admin
from .models import Trip, Stop, Route

admin.site.register(Trip)
admin.site.register(Stop)
admin.site.register(Route)