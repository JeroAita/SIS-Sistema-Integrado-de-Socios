# sis_app/signals.py
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Usuario

@receiver(m2m_changed, sender=Usuario.groups.through)
def sync_is_staff_on_group_change(sender, instance, action, **kwargs):
    if action in ("post_add", "post_remove", "post_clear"):
        instance.is_staff = instance.groups.filter(name__in=["admin", "staff"]).exists()
        instance.save(update_fields=["is_staff"])
