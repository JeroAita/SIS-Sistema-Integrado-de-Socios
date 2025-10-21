# 🚀 SIS - Sistema Integrado de Socios

## Guía Rápida para Levantar el Entorno

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** 
- **Git**

### Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/JeroAita/SIS-Sistema-Integrado-de-Socios
cd frontend
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Levantar el servidor
##### 3.1 Desarrollo
```bash
npm run dev
```
##### 3.2 Producción
```bash
# Generar build estático
npm run build
# ó
npm install vite -g
vite build

# Instalar librería `serve` 
npm install serve -g

# Servir el build que se generó en la carpeta dist
serve dist
```

### Estructura del Proyecto
```
SIS-Sistema-Integrado-de-Socios/
├── software/           # Aplicación React + Vite
│   ├── src/
│   │   ├── components/    # Componentes React organizados por módulo
│   │   │   ├── activities/    # Gestión de actividades
│   │   │   ├── common/        # Componentes reutilizables
│   │   │   ├── dashboard/     # Panel principal
│   │   │   ├── layout/        # Estructura de la aplicación
│   │   │   ├── members/       # Gestión de socios
│   │   │   ├── payments/      # Sistema de pagos
│   │   │   ├── reports/       # Reportes y estadísticas
│   │   │   ├── settings/      # Configuraciones
│   │   │   └── staff/         # Gestión del personal
│   │   ├── assets/        # Recursos estáticos
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   ├── public/           # Archivos públicos
│   ├── package.json      # Dependencias y scripts
│   ├── vite.config.js    # Configuración de Vite
│   ├── tailwind.config.js # Configuración de Tailwind CSS
│   └── eslint.config.js  # Configuración de ESLint
├── documentacion/       # Documentos del proyecto
└── .git/               # Control de versiones
```

