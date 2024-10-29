from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    return render(request, 'index.html')

@login_required
def trips(request, trip_id=''):
    return render(request, 'index.html')

def login(request):
    return render(request, 'index.html')