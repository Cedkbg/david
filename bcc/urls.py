from django.contrib import admin
from django.urls import path
from davidbcc.views import dashboard, explorer, home  # ← assure-toi que 'home' existe
from django.urls import path, include

urlpatterns = [
    path('', home, name='home'),  # ← correspond à http://127.0.0.1:8000/
    path('dashboard/', dashboard, name='dashboard'),
    path('explorer/', explorer, name='explorer'),
    path('admin/', admin.site.urls),
    path('', include('davidbcc.urls')),
]
