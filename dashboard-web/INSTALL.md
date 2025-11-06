# Guía de Instalación Rápida - Dashboard B2B

Esta guía te ayudará a poner en marcha el Dashboard de Monitoreo en menos de 10 minutos.

## ⚡ Instalación Rápida

### Paso 1: Requisitos Previos

Verifica que tengas instalado:

```bash
node --version  # Debe ser v18.0.0 o superior
npm --version   # Debe ser v9.0.0 o superior
mysql --version # Debe ser v8.0 o superior
```

### Paso 2: Configurar MySQL

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
mysql -u root -p
```

Luego ejecuta:
```sql
source C:/Users/jesus/Desktop/CapstoneGrupo5/dashboard-web/backend/database_schema.sql
```

O alternativamente:
```bash
mysql -u root -p < backend/database_schema.sql
```

### Paso 3: Configurar el Backend

1. **Navegar al directorio del backend**:
```bash
cd C:\Users\jesus\Desktop\CapstoneGrupo5\dashboard-web\backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Crear archivo de configuración**:

Crear un archivo llamado `.env` en `dashboard-web/backend/` con el siguiente contenido:

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

# Logging
LOG_LEVEL=info
```

**⚠️ IMPORTANTE**: Reemplaza `tu_contraseña_mysql` con tu contraseña real de MySQL.

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

### Paso 4: Configurar el Frontend

1. **Abrir una NUEVA terminal** y navegar al frontend:
```bash
cd C:\Users\jesus\Desktop\CapstoneGrupo5\dashboard-web\frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar la aplicación**:
```bash
npm run dev
```

Deberías ver:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Paso 5: Acceder al Dashboard

1. **Abrir tu navegador** y ve a:
```
http://localhost:3000
```

2. **Iniciar sesión** con las credenciales de prueba:
```
Email: admin@dashboard.com
Contraseña: Admin123!
```

¡Listo! 🎉 Ya deberías estar viendo el Dashboard.

## 🔍 Verificación

### Backend funcionando correctamente

Abre en tu navegador:
```
http://localhost:3001/health
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

### Frontend conectado al Backend

Si ves el dashboard con datos, ¡todo funciona!

Si ves errores, verifica:
1. ✅ Backend está corriendo en puerto 3001
2. ✅ MySQL está corriendo
3. ✅ Credenciales de BD son correctas en .env
4. ✅ No hay errores en la consola del navegador

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to MySQL"

**Solución**:
1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en `.env`
3. Asegúrate de que la base de datos `licitaciones_b2b` existe

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: "Port 3001 already in use"

**Solución en Windows**:
```powershell
# Ver qué proceso está usando el puerto
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID <PID> /F
```

**Solución en Linux/Mac**:
```bash
lsof -ti:3001 | xargs kill -9
```

### Error: "Port 3000 already in use"

Igual que arriba, pero reemplaza 3001 con 3000.

### Error: "Cannot find module"

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### La página no carga / Pantalla en blanco

**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Verifica si hay errores 404 o 500
5. Revisa que el backend esté corriendo

### "Token expirado"

**Solución**:
1. Cierra sesión
2. Vuelve a iniciar sesión
3. El token tiene una duración de 24 horas

## 📊 Verificar Datos de Ejemplo

El script de base de datos incluye datos de ejemplo. Para verificar:

```sql
mysql -u root -p
USE licitaciones_b2b;

-- Ver usuarios
SELECT * FROM usuarios;

-- Ver proveedores de ejemplo
SELECT * FROM proveedores;

-- Ver llamadas de ejemplo
SELECT * FROM llamadas;
```

## 🔄 Reiniciar el Sistema

### Detener todo

**Backend** (Ctrl + C en la terminal del backend)
**Frontend** (Ctrl + C en la terminal del frontend)

### Iniciar de nuevo

**Terminal 1 - Backend**:
```bash
cd dashboard-web/backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd dashboard-web/frontend
npm run dev
```

## 🚀 Modo Producción

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

Los archivos de producción estarán en `frontend/dist/`

## 📝 Siguiente Pasos

Una vez que el dashboard esté funcionando:

1. **Explorar el Dashboard**:
   - Prueba los filtros de fecha
   - Revisa los diferentes gráficos
   - Mira las alertas del sistema

2. **Crear más usuarios** (como Admin):
   - Ve a la API directamente o usa Postman
   - POST `http://localhost:3001/api/auth/register`

3. **Agregar más datos**:
   - Inserta más proveedores y llamadas en la BD
   - El dashboard se actualizará automáticamente

4. **Personalizar**:
   - Modifica los colores en `frontend/src/styles/index.css`
   - Ajusta los umbrales de alertas en `backend/src/services/analytics_service.js`

## 🆘 ¿Necesitas Ayuda?

1. **Revisa los logs**:
   - Backend: `dashboard-web/backend/logs/`
   - Frontend: Consola del navegador (F12)

2. **Revisa la documentación**:
   - [README Principal](../README.md)
   - [Backend README](./backend/README.md)
   - [Frontend README](./frontend/README.md)

3. **Verifica el estado de los servicios**:
   - MySQL: `systemctl status mysql` (Linux) o Services (Windows)
   - Backend: `http://localhost:3001/health`
   - Frontend: `http://localhost:3000`

## ✅ Checklist de Instalación

- [ ] Node.js y npm instalados
- [ ] MySQL instalado y corriendo
- [ ] Base de datos creada con script SQL
- [ ] Backend: dependencias instaladas
- [ ] Backend: archivo .env configurado
- [ ] Backend: directorio logs creado
- [ ] Backend: servidor corriendo en puerto 3001
- [ ] Frontend: dependencias instaladas
- [ ] Frontend: aplicación corriendo en puerto 3000
- [ ] Dashboard accesible en navegador
- [ ] Login exitoso con credenciales de prueba
- [ ] Datos de ejemplo visibles en el dashboard

---

**¡Felicitaciones! 🎉**  
Si completaste todos los pasos, el Dashboard de Monitoreo ya está funcionando correctamente.

Para más información, consulta la documentación completa en los archivos README.

