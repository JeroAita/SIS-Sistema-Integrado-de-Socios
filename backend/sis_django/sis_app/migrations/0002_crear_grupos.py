"""
Migración de datos para crear los grupos de usuarios automáticamente.
"""
from django.db import migrations

def crear_grupos(apps, schema_editor):
    """
    Función que se ejecuta al aplicar la migración (migrate).
    Crea los tres grupos necesarios para el sistema.
    """
    Group = apps.get_model('auth', 'Group')
    
    # Crear los grupos si no existen
    grupos = ['admin', 'staff', 'socio']
    
    for nombre_grupo in grupos:
        Group.objects.get_or_create(name=nombre_grupo)
        print(f"Grupo '{nombre_grupo}' creado/verificado")


def eliminar_grupos(apps, schema_editor):
    """
    Función que se ejecuta al revertir la migración (migrate --fake).
    Elimina los grupos creados.
    """
    Group = apps.get_model('auth', 'Group')
    
    grupos = ['admin', 'staff', 'socio']
    
    for nombre_grupo in grupos:
        Group.objects.filter(name=nombre_grupo).delete()
        print(f"Grupo '{nombre_grupo}' eliminado")


class Migration(migrations.Migration):
    """
    Clase de migración que Django ejecuta automáticamente.
    """
    
    dependencies = [
        ('sis_app', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),  # Dependencia del modelo Group
    ]

    operations = [
        migrations.RunPython(
            crear_grupos,      # Función a ejecutar al hacer migrate
            eliminar_grupos    # Función a ejecutar al hacer migrate --fake (rollback)
        ),
    ]