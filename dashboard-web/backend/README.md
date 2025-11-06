# Dashboard Backend - Sistema de Licitaciones B2B

Backend del Dashboard de Monitoreo para el Sistema de Invitaciones y Ofertas en la Plataforma de Licitaciones B2B.

## Tecnologías

- **Node.js** v18+
- **Express.js** - Framework web
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Winston** - Logging
- **Node-Cache** - Caché en memoria

## Requisitos Previos

- Node.js 18.0.0 o superior
- npm 9.0.0 o superior
- MySQL 8.0 o superior

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=licitaciones_b2b
JWT_SECRET=tu_secreto_jwt
```

3. Configurar la base de datos (ver esquema en `database_schema.sql`)

4. Crear directorio para logs:
```bash
mkdir logs
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Tests
```bash
npm test
```

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (Admin)
- `GET /api/auth/me` - Obtener información del usuario actual

### Métricas

Todos los endpoints de métricas requieren autenticación (Bearer Token).

- `GET /api/metrics/kpis` - KPIs principales
- `GET /api/metrics/performance` - Métricas de desempeño
- `GET /api/metrics/sentiment` - Análisis de sentimiento
- `GET /api/metrics/historical` - Rendimiento histórico
- `GET /api/metrics/providers` - Top proveedores
- `GET /api/metrics/alerts` - Alertas del sistema
- `DELETE /api/metrics/cache` - Limpiar caché (Admin)

### Parámetros de Query Comunes

- `startDate` (opcional): Fecha de inicio en formato ISO 8601
- `endDate` (opcional): Fecha de fin en formato ISO 8601
- `groupBy` (opcional): Agrupación temporal (hour, day, week, month)
- `limit` (opcional): Límite de resultados

### Ejemplo de Request

```bash
curl -X GET "http://localhost:3001/api/metrics/kpis?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer your_jwt_token"
```

## Autenticación y Autorización

El sistema implementa autenticación basada en JWT y control de acceso basado en roles (RBAC).

### Roles

- **Admin**: Acceso completo al sistema
- **Manager**: Acceso a todas las métricas y reportes
- **Analyst**: Acceso de solo lectura a métricas

### Uso del Token

Incluir el token JWT en el header Authorization:
```
Authorization: Bearer <token>
```

## Estructura de la Base de Datos

### Tabla: usuarios
```sql
- id (INT, PK)
- email (VARCHAR)
- password_hash (VARCHAR)
- nombre (VARCHAR)
- role (ENUM: Admin, Manager, Analyst)
- activo (BOOLEAN)
- ultimo_login (DATETIME)
- created_at (TIMESTAMP)
```

### Tabla: llamadas
```sql
- id (INT, PK)
- proveedor_id (INT, FK)
- fecha_llamada (DATETIME)
- estado (ENUM: completada, ocupada, fallida, sin_respuesta)
- duracion_segundos (INT)
- contacto_exitoso (BOOLEAN)
- proveedor_interesado (BOOLEAN)
- conversion_oferta (BOOLEAN)
- sentimiento (ENUM: positivo, neutro, negativo)
- transcripcion (TEXT)
- created_at (TIMESTAMP)
```

### Tabla: proveedores
```sql
- id (INT, PK)
- nombre (VARCHAR)
- rubro (VARCHAR)
- telefono (VARCHAR)
- email (VARCHAR)
- created_at (TIMESTAMP)
```

## 📊 Sistema de Caché

El backend implementa un sistema de caché en memoria para optimizar el rendimiento:

- **TTL**: 5 minutos (configurable)
- **Endpoints cacheados**: Todos los endpoints de métricas
- **Limpieza**: Automática por TTL o manual vía endpoint

## Logging

Los logs se almacenan en el directorio `/logs`:

- `error.log`: Solo errores
- `combined.log`: Todos los logs

Niveles de log: error, warn, info, http, verbose, debug, silly

## Seguridad

- Helmet.js para headers de seguridad
- Rate limiting para prevenir ataques de fuerza bruta
- Validación de entrada con express-validator
- Passwords hasheados con bcryptjs
- JWT con expiración configurable
- CORS configurado

## 🚦 Health Check

```bash
GET /health
```

Respuesta:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## Contribución

1. Seguir la metodología Kanban definida en el proyecto
2. Respetar los límites WIP
3. Incluir pruebas unitarias
4. Documentar cambios significativos
5. Realizar revisión por pares

## Equipo

Proyecto desarrollado por el Grupo 5 del Capstone para la optimización del Sistema de Licitaciones B2B.

