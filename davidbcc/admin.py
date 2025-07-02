from django import forms

class PredictionForm(forms.Form):
    annee = forms.IntegerField()
    taux_change = forms.FloatField()
    masse_monetaire = forms.FloatField()
    inflation_reelle = forms.FloatField(required=False)
