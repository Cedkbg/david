from django.shortcuts import render, redirect
# from .models import Fichier  # ou ton modèle approprié
from .forms import UploadForm  # si tu as un formulaire

def home(request):
    return render(request, 'home.html')

def dashboard(request):
    return render(request, 'dashboard.html')

def explorer(request):
    return render(request, 'explorer.html')

def upload(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('dashboard')  # ou une autre page
    else:
        form = UploadForm()
    return render(request, 'upload.html', {'form': form})

def prediction(request):
    return render(request, 'prediction.html')