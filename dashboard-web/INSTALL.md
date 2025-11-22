# Guía de Instalación - Dashboard B2B

Esta guía te ayudará a poner en marcha el Dashboard de Monitoreo de forma rápida y sencilla.

## Instalación con Docker (Recomendado)

La forma más rápida y sencilla de ejecutar el dashboard es usando Docker. Todo está preconfigurado y listo para usar.

### Requisitos Previos

- **Docker** 20.10+ ([Descargar Docker](https://www.docker.com/get-started))
- **Docker Compose** v2.0+ (incluido con Docker Desktop)

### Instalación Rápida

1. **Clonar el repositorio** (si aún no lo has hecho):
```bash
git clone <repository-url>
cd CapstoneGrupo5/dashboard-web
```

2. **Iniciar todos los servicios**:
```bash
docker compose up -d
```

Esto iniciará automáticamente:
- Base de datos MySQL con el esquema completo
- Backend API en Node.js/Express
- Frontend React servido con Nginx
- **Datos de prueba** (50 proveedores, 20 licitaciones, 500 llamadas)

3. **Acceder al Dashboard**:
```
URL: http://localhost:3000
Usuario: admin@dashboard.com
Contraseña: Admin123!
```

¡Listo! El dashboard está funcionando con datos de prueba.

### Comandos Útiles de Docker

```bash
# Ver el estado de los servicios
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Detener todos los servicios
docker compose down

# Reiniciar un servicio específico
docker compose restart backend

# Reconstruir y reiniciar
docker compose up -d --build

# Detener y eliminar TODO (incluyendo datos de la BD)
docker compose down -v
```

### Puertos Utilizados

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MySQL**: localhost:3307 (mapeado desde el puerto 3306 del contenedor)

### Verificación

**Backend Health Check**:
```bash
curl http://localhost:3001/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123
}
```

**Verificar datos en la base de datos**:
```bash
docker compose exec mysql mysql -u dashboard_user -pdashboard_password licitaciones_b2b -e "SELECT COUNT(*) FROM llamadas;"
```

### Datos de Prueba

El sistema incluye datos de prueba que se cargan automáticamente:
- **50 proveedores** de diferentes industrias y regiones
- **20 licitaciones** activas con diferentes categorías
- **500 llamadas** con estados, sentimientos y conversiones realistas
- **~132 ofertas** generadas automáticamente

---

## Instalación Manual (Desarrollo)

Si prefieres ejecutar los servicios de forma individual para desarrollo, sigue estos pasos:

### Requisitos Previos

```bash
node --version  # Debe ser v18.0.0 o superior
npm --version   # Debe ser v9.0.0 o superior
mysql --version # Debe ser v8.0 o superior
```

### Paso 1: Configurar MySQL

1. **Iniciar MySQL**:
```bash
# En Windows (PowerShell)
Start-Service MySQL80

# En Linux/Mac
sudo systemctl start mysql
# o
brew services start mysql
```

2. **Crear la base de datos**:
```bash
mysql -u root -p < backend/database_schema.sql
```

3. **Cargar datos de prueba** (opcional):
```bash
cd backend
node scripts/seed_data.js
```

### Paso 2: Configurar el Backend

1. **Navegar al directorio del backend**:
```bash
cd backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Crear archivo de configuración `.env`**:
```env
# Configuración del Servidor
PORT=3001
NODE_ENV=development

# Configuración de la Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=licitaciones_b2b

# Configuración de JWT
JWT_SECRET=mi_secreto_super_seguro_cambiar_en_produccion_12345
JWT_EXPIRATION=24h

# Configuración de CORS
CORS_ORIGIN=http://localhost:3000

# Configuración de Caché
CACHE_TTL=300

# Configuración de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**IMPORTANTE**: Reemplaza `tu_contraseña_mysql` con tu contraseña real de MySQL.

4. **Crear directorio de logs**:
```bash
mkdir logs
```

5. **Iniciar el servidor backend**:
```bash
npm run dev
```

Deberías ver:
```
🚀 Servidor iniciado en puerto 3001
📊 Dashboard Backend API corriendo en http://localhost:3001
✓ Sistema listo para recibir peticiones
```

### Paso 3: Configurar el Frontend

1. **Abrir una NUEVA terminal** y navegar al frontend:
```bash
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Crear archivo `.env`** (opcional):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

4. **Iniciar la aplicación**:
```bash
npm run dev
```

Deberías ver:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:3000/
```

### Paso 4: Acceder al Dashboard

1. **Abrir tu navegador** y ve a:
```
http://localhost:3000
```

2. **Iniciar sesión** con las credenciales de prueba:
```
Email: admin@dashboard.com
Contraseña: Admin123!
```

---

## Solución de Problemas

### Docker

#### Error: "port is already allocated"
**Causa**: El puerto ya está en uso por otro servicio.

**Solución**:
```bash
# Ver qué está usando el puerto
# En Linux/Mac
lsof -i :3000
lsof -i :3001
lsof -i :3307

# En Windows
netstat -ano | findstr :3000

# Detener el servicio o cambiar el puerto en docker-compose.yml
```

#### Error: "Cannot connect to Docker daemon"
**Causa**: Docker no está ejecutándose.

**Solución**:
- Inicia Docker Desktop
- En Linux: `sudo systemctl start docker`

#### Los contenedores no inician correctamente
**Solución**:
```bash
# Ver logs detallados
docker compose logs

# Reconstruir desde cero
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Instalación Manual

#### Error: "Cannot connect to MySQL"
**Solución**:
1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en `.env`
3. Asegúrate de que la base de datos `licitaciones_b2b` existe

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

#### Error: "Port 3001 already in use"
**Solución en Linux/Mac**:
```bash
lsof -ti:3001 | xargs kill -9
```

**Solución en Windows**:
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

#### Error: "Cannot find module"
**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### La página no carga / Pantalla en blanco
**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Verifica si hay errores 404 o 500
5. Revisa que el backend esté corriendo

#### "Token expirado"
**Solución**:
1. Cierra sesión
2. Vuelve a iniciar sesión
3. El token tiene una duración de 24 horas

---

## Verificar Datos

### Con Docker
```bash
# Conectarse a MySQL
docker compose exec mysql mysql -u dashboard_user -pdashboard_password licitaciones_b2b

# Ver estadísticas
docker compose exec mysql mysql -u dashboard_user -pdashboard_password licitaciones_b2b -e "
SELECT 
  (SELECT COUNT(*) FROM proveedores) as proveedores,
  (SELECT COUNT(*) FROM licitaciones) as licitaciones,
  (SELECT COUNT(*) FROM llamadas) as llamadas,
  (SELECT COUNT(*) FROM ofertas) as ofertas;
"
```

### Manual
```sql
mysql -u root -p
USE licitaciones_b2b;

-- Ver usuarios
SELECT * FROM usuarios;

-- Ver proveedores de ejemplo
SELECT * FROM proveedores LIMIT 5;

-- Ver llamadas de ejemplo
SELECT * FROM llamadas LIMIT 5;

-- Estadísticas
SELECT COUNT(*) FROM llamadas;
SELECT COUNT(*) FROM ofertas;
```

---

## Modo Producción

### Con Docker (Recomendado)

El setup de Docker ya está optimizado para producción. Solo necesitas:

1. **Actualizar variables de entorno** en `docker-compose.yml`:
```yaml
environment:
  NODE_ENV: production
  JWT_SECRET: <tu_secreto_seguro_aquí>
  MYSQL_ROOT_PASSWORD: <contraseña_segura>
  MYSQL_PASSWORD: <contraseña_segura>
```

2. **Usar un reverse proxy** (Nginx, Traefik) para HTTPS

3. **Configurar backups** para el volumen de MySQL

### Manual

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

Los archivos de producción estarán en `frontend/dist/`

---

## Recursos Adicionales

- [README Principal](./README.md) - Documentación completa del proyecto
- [Backend README](./backend/README.md) - Documentación del API
- [Frontend README](./frontend/README.md) - Documentación del frontend
- [Walkthrough Docker](./walkthrough.md) - Guía detallada de Docker

---

## ¿Necesitas Ayuda?

1. **Revisa los logs**:
   - Docker: `docker compose logs -f`
   - Backend manual: `backend/logs/`
   - Frontend: Consola del navegador (F12)

2. **Verifica el estado de los servicios**:
   - MySQL: `docker compose ps` o `systemctl status mysql`
   - Backend: `http://localhost:3001/health`
   - Frontend: `http://localhost:3000`

3. **Consulta la documentación**:
   - Revisa los archivos README de cada componente
   - Verifica la sección de troubleshooting arriba

---

**Versión**: 2.0.0 (con Docker)  
**Última actualización**: Noviembre 2025
