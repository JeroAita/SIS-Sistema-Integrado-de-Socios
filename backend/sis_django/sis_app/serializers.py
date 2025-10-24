from rest_framework import serializers
from .models import Usuario, Actividad, Inscripcion, Cuota, CompensacionStaff

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Lista de campos a considerar en respuestas JSON:
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'dni', 'telefono', 'estado', 'date_joined',
            'es_admin', 'es_staff', 'es_socio',
            'password'
        ]
        # Campos que el cliente no puede modificar:
        read_only_fields = [
            'id', 'date_joined', 'es_admin', 'es_staff', 'es_socio'
        ]
        # Nunca exponer password en respuestas; sólo se toma al crear/actualizar la instancia.
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    # Sobrescrir create para manejar el hasheo de password.
    def create(self, validated_data):
        password = validated_data.pop('password', None) # Extrae pass de datos recibidos validados. (None de no haber pass)
        usuario = Usuario(**validated_data)             # Crea una instancia de Usuario con *el resto* de los datos recibidos.
        if password:
            usuario.set_password(password)              # Si pass!=None, provee a la instancia su pass hasheada.
        usuario.save()                                  # Guarda la instancia en la DB
        return usuario
    
    # Sobrescrir update para manejar el hasheo de password.
    def update(self, usuario, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():      # Actualiza atributo por atributo con datos nuevos.
            setattr(usuario, attr, value)
        if password:
            usuario.set_password(password)
        usuario.save()
        return usuario

class ActividadSerializer(serializers.ModelSerializer):
    # Tomar la info. del usuario staff para no sólo incluir su id en la respuesta:
    #usuario_staff_info = UsuarioSerializer(source='usuario_staff', read_only=True)
    
    # Tomar sólo el nombre del usuario staff, porque toda su info. es más de lo neceseario:
    usuario_staff_nombre = serializers.CharField(source='usuario_staff.__str__', read_only=True)
    
    class Meta:
        model = Actividad
        fields = [
            'id', 'nombre', 'descripcion', 'fecha_hora_inicio',
            'fecha_hora_fin', 'cargo_inscripcion', 'estado',
            'usuario_staff', 'usuario_staff_nombre', 'cantidad_inscriptos'
        ]
        read_only_fields = [
            'id', 'usuario_staff_nombre', 'cantidad_inscriptos'
        ]

class InscripcionSerializer(serializers.ModelSerializer):
    usuario_socio_nombre = serializers.CharField(source='usuario_socio.__str__', read_only=True)
    actividad_nombre = serializers.CharField(source='actividad.__str__', read_only=True)
    
    class Meta:
        model = Inscripcion
        fields = [
            'id', 'fecha_inscripcion', 'estado',
            'usuario_socio', 'usuario_socio_nombre',
            'actividad', 'actividad_nombre'
        ]
        read_only_fields = [
            'id', 'fecha_inscripcion', 
            'usuario_socio_nombre', 'actividad_nombre'
        ]
    
    # Validación personalizada: método a ejecutar cuando se utiliza serializer.is_valid() en view:
    def validate(self, data):
        usuario = data.get('usuario_socio')
        actividad = data.get('actividad')
        
        # Validar que el usuario exista y sea socio. Caso contrario: retornar error con status 400
        if usuario and not usuario.es_socio:
            raise serializers.ValidationError(
                "Solo los socios pueden inscribirse a actividades."
            )
        
        # Validar estado de la actividad
        if actividad and actividad.estado != 'activa':
            raise serializers.ValidationError(
                "No se puede inscribir a una actividad que no está activa."
            )
        
        # Verificar inscripción duplicada (solo en creación)
        if not self.instance:
            if Inscripcion.objects.filter(
                usuario_socio=usuario,
                actividad=actividad,
                estado='confirmada'
            ).exists():
                raise serializers.ValidationError(
                    "El usuario ya está inscripto en esta actividad."
                )
        
        return data

class CuotaSerializer(serializers.ModelSerializer):
    usuario_socio_nombre = serializers.CharField(source='usuario_socio.__str__', read_only=True)
    
    class Meta:
        model = Cuota
        fields = [
            'id', 'fecha_vencimiento', 'fecha_pago', 'valor_base',
            'usuario_socio', 'usuario_socio_nombre', 'estado', 'dias_atraso'
        ]
        read_only_fields = ['id', 'usuario_socio_nombre', 'dias_atraso']

class CompensacionStaffSerializer(serializers.ModelSerializer):
    usuario_staff_nombre = serializers.CharField(source='usuario_staff.__str__', read_only=True)
    actividad_nombre = serializers.CharField(source='actividad.__str__', read_only=True)
    
    class Meta:
        model = CompensacionStaff
        fields = [
            'id', 'periodo', 'usuario_staff', 'usuario_staff_nombre',
            'actividad', 'actividad_nombre', 'monto'
        ]
        read_only_fields = ['id', 'usuario_staff_nombre', 'actividad_nombre']
    
    def validate_usuario_staff(self, value):
        if not value.es_staff:
            raise serializers.ValidationError(
                "Solo se pueden crear compensaciones para usuarios staff."
            )
        return value

# --- Serializers con propósitos específicos ---

# Serializer específico para registro de nuevos usuarios
class UsuarioRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirmacion = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'password', 'password_confirmacion',
            'first_name', 'last_name', 'dni', 'telefono'
        ]
    
    def validate(self, data):
        if data['password'] != data['password_confirmacion']:
            raise serializers.ValidationError({
                'password': 'Las contraseñas no coinciden.'
            })
        return data
    
    # Crear usuario con password hasheada
    def create(self, validated_data):
        validated_data.pop('password_confirmacion')
        password = validated_data.pop('password')
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario

# Serializer específico para cambiar contraseña de usuario ya existente
class UsuarioChangePasswordSerializer(serializers.Serializer):
    password_actual = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_nueva = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirmacion = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def validate(self, data):
        if data['password_nueva'] != data['password_confirmacion']:
            raise serializers.ValidationError({
                'password_nueva': 'Las contraseñas no coinciden.'
            })
        return data
    
    def validate_password_actual(self, value):
        usuario = self.context['request'].user
        if not usuario.check_password(value):
            raise serializers.ValidationError('Contraseña actual incorrecta.')
        return value
    
    def save(self):
        usuario = self.context['request'].user
        usuario.set_password(self.validated_data['password_nueva'])
        usuario.save()
        return usuario