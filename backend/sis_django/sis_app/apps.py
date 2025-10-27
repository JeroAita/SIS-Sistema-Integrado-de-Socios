# sis_app/apps.py
from django.apps import AppConfig

class SisAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sis_app'

    def ready(self):
        # Importa las señales al iniciar la app
        from . import signals  # noqa: F401
