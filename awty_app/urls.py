from django.urls import path
from .views import home

urlpatterns = [
    path('', home, name='home'),  # Route for the homepage
    path('<path:path>/', home, name='catch_all'),
]