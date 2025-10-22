# 🖥️ SIS - Sistema Integrado de Socios: Back-end

## Pre-requisitos

Pre-requisitos:

1. Herramienta de entornos virtuales python: `python3-venv`
2. Docker y Docker Compose

### !TODO: Instalación de pre-requisitos en sistemas Windows

(...)

### Instalación de pre-requisitos en sistemas Linux

Utilizando el gestor de paquetes de Debian (`apt`):

```bash
# Instalar herramienta de entornos virtuales Python
sudo apt install python3-venv

# Instalar Docker
# Instalar dependencias de Docker
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Agregar clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor
-o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio Docker
echo "deb [arch=$(dpkg --print-architecture) signed-
by=/usr/share/keyrings/docker-archive-keyring.gpg]
https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo
tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker en sí
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar usuario a grupo Docker
sudo usermod -aG docker $USER
sudo reboot
```

## Levantar servidor de pruebas

Pasos:

1. Levantar contenedores Docker.
2. Activar entorno virtual Python.
3. Interactuar con el proyecto Django.

### !TODO: Levantar servidor de pruebas en Windows

(...)

### Levantar servidor de pruebas en Linux

En una terminal:

```bash
# Levantar contenedores Docker
docker compose up
```

En otra terminal:

```bash
# Activar entorno virtual Python
source venv_django/bin/activate

# Creación/actualización de tablas en base de datos
python manage.py migrate
python manage.py makemigrations

# Levantar servidor de pruebas
python manage.py runserver
```

## Limpieza

1. Terminar procesos (Hotkey ctrl+C en terminal)
2. Frenar contenedores/Borrar volúmenes Docker.

```bash
# Detener la ejecución de contenedores Docker
docker compose stop

# Eliminar los volúmenes de los contenedores Docker
docker compose down -v
```

## Arquitectura del back-end

(diagrama de filesystem)