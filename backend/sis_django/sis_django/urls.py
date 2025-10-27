from django.contrib import admin
from django.urls import path, include   # ← 🔹 Estos imports son los que faltaban

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("sis_app.urls")),   # ← tu app principal
]
