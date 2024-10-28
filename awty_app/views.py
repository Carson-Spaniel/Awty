from django.shortcuts import render

def home(request, path=''):
    return render(request, 'index.html')