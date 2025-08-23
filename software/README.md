# 🚀 SIS - Sistema Integrado de Socios

## Guía Rápida para Levantar el Entorno

### 📋 Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** 
- **Git**

### Instalación

#### 1. Clonar el repositorio
```bash
git clone <URL-DEL-REPOSITORIO>
cd SIS-Sistema-Integrado-de-Socios
```

#### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

#### 5. Levantar el servidor
```bash
# Desarrollo
npm run dev
# o
yarn dev

# Producción
npm start
# o
yarn start
```

### 🌐 Acceder a la aplicación
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Documentación API:** http://localhost:3000/api/docs

### 🔧 Comandos Útiles

#### Desarrollo
```bash
npm run dev          # Servidor en modo desarrollo
npm run build        # Construir para producción
npm run test         # Ejecutar tests
npm run lint         # Verificar código
```

#### Base de datos
```bash
npm run migrate      # Ejecutar migraciones
npm run seed         # Poblar con datos de prueba
npm run db:reset     # Resetear base de datos
```

#### Git
```bash
git checkout -b feature/nueva-funcionalidad
git checkout -b hotfix/correccion-bug
git checkout -b develop
```

### 🐛 Solución de Problemas Comunes

#### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error de conexión a base de datos
- Verificar que la base de datos esté corriendo
- Revisar credenciales en `.env`
- Verificar que el puerto esté disponible

#### Error de puerto ocupado
```bash
# Cambiar puerto en .env
PORT=3001
```

### 📁 Estructura del Proyecto
```
SIS-Sistema-Integrado-de-Socios/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas de la API
│   ├── middleware/     # Middlewares personalizados
│   └── utils/          # Utilidades y helpers
├── public/             # Archivos estáticos
├── views/              # Vistas del frontend
├── tests/              # Tests unitarios e integración
├── docs/               # Documentación
└── config/             # Configuraciones
```

### 🚀 Despliegue Rápido

#### Docker (Recomendado)
```bash
# Construir imagen
docker build -t sis-app .

# Ejecutar contenedor
docker run -p 3000:3000 sis-app
```

#### Docker Compose
```bash
docker-compose up -d
```

### 📞 Soporte
- **Issues:** Crear issue en GitHub
- **Documentación:** Revisar carpeta `docs/`
- **Wiki:** Consultar wiki del proyecto

### 🎯 Próximos Pasos
1. ✅ Entorno funcionando
2. 🔄 Revisar documentación de la API
3. 🧪 Ejecutar tests
4. 🚀 ¡Comenzar a desarrollar!

---

**¿Problemas?** Revisa la sección de [Solución de Problemas](#-solución-de-problemas-comunes) o crea un issue.

**¡Happy Coding! 🎉**
