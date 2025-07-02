# davidbcc/forms.py

from django import forms
from .models import PredictionModel, Fichier  # ✅ on importe aussi le bon modèle

class PredictionForm(forms.ModelForm):
    class Meta:
        model = PredictionModel
        fields = ['annee', 'taux_change', 'masse_monnaire', 'inflation_reelle']

class UploadForm(forms.ModelForm):
    class Meta:  
        model = Fichier  # ✅ correction ici !
        fields = ['nom', 'fichier', 'observation']
