from django.urls import path
from . import views
from .views import prediction

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('explorer/', views.explorer, name='explorer'),
    path('upload/', views.upload, name='upload'),
    path('prediction/', prediction, name='prediction'), 
    
]
