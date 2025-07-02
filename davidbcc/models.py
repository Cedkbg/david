from django.db import models

class PredictionModel(models.Model):
    annee = models.IntegerField()
    taux_change = models.FloatField()
    masse_monnaire = models.FloatField()
    inflation_reelle = models.FloatField(null=True, blank=True)
    inflation_predite = models.FloatField(null=True, blank=True)
    date_prediction = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prédiction {self.annee} - {self.inflation_predite:.2f}%"
class Fichier(models.Model):
    nom = models.CharField(max_length=100)
    fichier = models.FileField(upload_to='uploads/')
    observation = models.TextField(blank=True)
    date_televersement = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom
