# 🖥️ SIS - Sistema Integrado de Socios: Back-end

Índice:

1. Pre-requisitos
2. Configuración inicial del proyecto
3. Levantar servidor de pruebas
4. Limpieza
5. Arquitectura del back-end

## Pre-requisitos

Pre-requisitos:

- Python 3.8 o superior y su herramienta de entornos virtuales python: `python3-venv`.
- Docker y su herramienta Docker Compose.

### Instalación de pre-requisitos en sistemas Windows

1. Descargar e instalar Python desde [python.org](https://www.python.org/downloads/). **Importante:** Marcar la opción "Add Python to PATH" durante la instalación. 
    - La herramienta `venv` viene incluida con Python 3.3+.
2. Descargar Docker Desktop desde [docker.com](https://www.docker.com/products/docker-desktop/).
    - La herramienta Docker Compose viene incluida con Docker Desktop.

**Nota:** Docker Desktop en Windows requiere WSL 2 (Windows Subsystem for Linux). El instalador puede configurarlo automáticamente.

### Instalación de pre-requisitos en sistemas Linux

Utilizando el gestor de paquetes de Debian (`apt`):

```bash
# Instalar herramienta de entornos virtuales Python
sudo apt install python3-venv

# Instalar Docker
# Instalar dependencias de Docker
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Agregar clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker en sí
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar usuario a grupo Docker
sudo usermod -aG docker $USER
sudo reboot
```

## Configuración inicial del proyecto

Estos pasos se realizan **solo la primera vez** que se configura el proyecto.

### En Windows

Abrir una terminal (PowerShell o CMD) en el directorio `backend/`:

```cmd
# Crear entorno virtual Python
python -m venv venv_django

# Activar entorno virtual
venv_django\Scripts\activate

# Instalar dependencias del proyecto
pip install -r requirements.txt
```

### En Linux

Abrir una terminal en el directorio `backend/`:

```bash
# Crear entorno virtual Python
python3 -m venv venv_django

# Activar entorno virtual
source venv_django/bin/activate

# Instalar dependencias del proyecto
pip install -r requirements.txt
```

## Levantar servidor de pruebas

Pasos:

1. Levantar contenedores Docker.
2. Levantar entorno virtual Python.
3. Aplicar migraciones a la base de datos.
4. Levantar servidor de desarrollo django.

### Levantar servidor de pruebas en Windows

```cmd
# Levantar contenedores Docker
docker compose up

# Alternativa: levantar contenedores Docker de fondo para utilizar sólo una terminal
docker compose up -d
```

En otra terminal sobre el directorio `backend/`:

```cmd
# Activar entorno virtual Python
venv_django\Scripts\activate

# Crear/actualizar migraciones y aplicarlas a la base de datos
python sis_django/manage.py makemigrations
python sis_django/manage.py migrate

# Levantar servidor de pruebas
python sis_django/manage.py runserver
```

### Levantar servidor de pruebas en Linux

En una terminal sobre el directorio `backend/`:

```bash
# Levantar contenedores Docker
docker compose up

# Alternativa: levantar contenedores Docker de fondo para utilizar sólo una terminal
docker compose up -d
```

En otra terminal sobre el directorio `backend/`:

```bash
# Activar entorno virtual Python
source venv_django/bin/activate

# Creación/actualización de tablas en base de datos
python sis_django/manage.py makemigrations
python sis_django/manage.py migrate

# Levantar servidor de pruebas
python sis_django/manage.py runserver
```

## Limpieza

1. Terminar procesos (Hotkey `Ctrl+C` en terminal)
2. Detener contenedores/Eliminar volúmenes Docker

```bash
# Detener la ejecución de contenedores Docker
docker compose stop

# Eliminar los volúmenes de los contenedores Docker
docker compose down -v
```

## Arquitectura del back-end

```
backend/
├── docker-compose.yml      # Configuración de contenedores Docker
├── requirements.txt        # Dependencias Python del proyecto
├── venv_django/            # Entorno virtual (no versionado en Git)
├── sis_django/
│   ├── manage.py           # Utilidad de línea de comandos de Django
│   └── sis_django/         # Archivos del proyecto
│
└── README.md               # Este archivo
```