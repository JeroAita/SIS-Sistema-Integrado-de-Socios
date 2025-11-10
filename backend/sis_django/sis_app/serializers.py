import re
from django.utils.text import slugify
from django.utils import timezone
from rest_framework import serializers
from .models import Usuario, Actividad, Inscripcion, Cuota, CompensacionStaff

# --------- serializer especial para Usuario ---------
class UsuarioSerializer(serializers.ModelSerializer):
    # 1) Hacerlos OPCIONALES en la definición del campo (DRF valida aquí):
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = [
            "id", "username", "password",
            "email", "first_name", "last_name",
            "dni", "telefono", "estado",
            "es_admin", "es_staff", "es_socio",
            "date_joined",
        ]
    extra_kwargs = {
        "dni": {"required": False, "allow_blank": True},
        "telefono": {"required": False, "allow_blank": True},
        "estado": {"required": False},
        "es_admin": {"read_only": True},
        "es_staff": {"read_only": True},
        "es_socio": {"read_only": True},
        "date_joined": {"read_only": True},
    }

    # ---------- helpers ----------
    def _to_slug(self, s: str) -> str:
        return slugify(s or "").replace("-", "")

    def _build_username_base(self, first_name, last_name, dni):
        fn = self._to_slug(first_name)
        ln = self._to_slug((last_name or "").split(" ")[0])
        if fn or ln:
            base = ".".join([p for p in [fn, ln] if p])
            base = re.sub(r"\.+", ".", base).strip(".")
            if base:
                return base
        if dni:
            digits = re.sub(r"\D", "", str(dni))
            if digits:
                return f"staff{digits}"
        return f"staff{int(timezone.now().timestamp())}"

    def _make_unique_username(self, base: str) -> str:
        candidate = base
        i = 0
        while Usuario.objects.filter(username=candidate).exists():
            i += 1
            candidate = f"{base}{i}"
        return candidate

    def _generate_dni_if_missing(self) -> str:
        seed = str(int(timezone.now().timestamp() * 1000))[-9:]
        candidate = f"9{seed}"
        i = 0
        dn = candidate
        while Usuario.objects.filter(dni=dn).exists():
            i += 1
            dn = (candidate[:-len(str(i))] + str(i))[:10]
        return dn

    def _split_fullname_if_needed(self, data: dict):
        nombre_completo = (
            data.pop("nombreCompleto", None)
            or data.pop("nombre_completo", None)
            or data.pop("fullName", None)
        )
        if nombre_completo and (not data.get("first_name") and not data.get("last_name")):
            partes = nombre_completo.strip().split()
            if len(partes) == 1:
                data["first_name"] = partes[0]
                data["last_name"] = ""
            else:
                data["first_name"] = " ".join(partes[:-1])
                data["last_name"] = partes[-1]

    def _normalize_estado(self, data: dict):
        estado = data.get("estado")
        if estado:
            estado_l = str(estado).strip().lower()
            mapping = {
                "activo": "activo",
                "activa": "activo",
                "inactivo": "inactivo",
                "inactiva": "inactivo",
                "baja": "baja",
            }
            data["estado"] = mapping.get(estado_l, "activo")

    # --- aceptar campos extra del front ---
    def to_internal_value(self, data):
        data = data.copy()

        # 2) Ignorar 'grupo' en la validación del serializer (lo maneja la view)
        data.pop("grupo", None)

        # mapear phone -> telefono
        if "phone" in data and "telefono" not in data:
            data["telefono"] = data.get("phone")

        # normalizaciones
        self._split_fullname_if_needed(data)
        self._normalize_estado(data)

        # ignorar campos que el modelo no tiene
        data.pop("experiencia", None)
        data.pop("ocupacion", None)
        data.pop("especialidad", None)

        return super().to_internal_value(data)

    # ------------- create / update -------------
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        username = validated_data.get("username")

        if not validated_data.get("dni"):
            validated_data["dni"] = self._generate_dni_if_missing()

        if not username:
            base = self._build_username_base(
                validated_data.get("first_name"),
                validated_data.get("last_name"),
                validated_data.get("dni"),
            )
            username = self._make_unique_username(base)
            validated_data["username"] = username

        user = Usuario(**validated_data)
        if not password:
            password = "Club2025!"  # solo dev
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

# --------- resto de serializers ---------
class ActividadSerializer(serializers.ModelSerializer):
    cantidad_inscriptos = serializers.IntegerField(read_only=True)
    inscriptos_detalle = serializers.SerializerMethodField()
    
    class Meta:
        model = Actividad
        fields = [
            "id","nombre","descripcion","fecha_hora_inicio","fecha_hora_fin",
            "cargo_inscripcion","estado","usuario_staff","cantidad_inscriptos",
            "inscriptos_detalle",
        ]
    
    def get_inscriptos_detalle(self, obj):
        """Devuelve detalles de los socios inscritos en esta actividad"""
        inscripciones = obj.inscripciones.filter(estado='confirmada').select_related('usuario_socio')
        return [
            {
                "id": insc.usuario_socio.id,
                "nombre": f"{insc.usuario_socio.first_name} {insc.usuario_socio.last_name}".strip() or insc.usuario_socio.username,
                "email": insc.usuario_socio.email,
                "telefono": insc.usuario_socio.telefono or "",
                "estado": insc.usuario_socio.estado,
                "fecha_inscripcion": insc.fecha_inscripcion.isoformat() if insc.fecha_inscripcion else None,
            }
            for insc in inscripciones
        ]

class InscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscripcion
        fields = ["id","fecha_inscripcion","usuario_socio","actividad",
                  "estado","estado_pago"
        ]
        read_only_fields = ["fecha_inscripcion"]

class CuotaSerializer(serializers.ModelSerializer):
    dias_atraso = serializers.IntegerField(read_only=True)
    comprobante_url = serializers.SerializerMethodField()
    valor_actividades = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    periodo = serializers.CharField(read_only=True)
    inscripciones_detalle = serializers.SerializerMethodField()
    
    class Meta:
        model = Cuota
        fields = [
            "id","fecha_vencimiento","fecha_pago","valor_base","valor_actividades","valor_total",
            "usuario_socio","estado","dias_atraso","comprobante","comprobante_url",
            "inscripciones","inscripciones_detalle","periodo","periodo_mes","periodo_anio",
        ]
    
    def get_comprobante_url(self, obj):
        """Devuelve la URL completa del comprobante si existe"""
        if obj.comprobante:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.comprobante.url)
            return obj.comprobante.url
        return None
    
    def get_inscripciones_detalle(self, obj):
        """Devuelve detalles de las inscripciones incluidas en la cuota"""
        return [
            {
                "id": insc.id,
                "actividad": insc.actividad.nombre if insc.actividad else None,
                "cargo": float(insc.actividad.cargo_inscripcion) if insc.actividad and insc.actividad.cargo_inscripcion else 0
            }
            for insc in obj.inscripciones.all()
        ]

class CompensacionStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompensacionStaff
        fields = ["id","periodo","usuario_staff","actividad","monto"]
