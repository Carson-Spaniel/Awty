from django.urls import path
from .views import home, trips, login

urlpatterns = [
    path('', home, name='home'),  # Route for the homepage
    path('trips', trips, name='trips'),
    path('login', login, name='login'),
    path('signup', login, name='signup'),
]