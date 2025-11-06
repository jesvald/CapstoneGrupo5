# Dashboard de Monitoreo - Sistema de Licitaciones B2B

Sistema completo de monitoreo y visualización para la optimización del sistema de invitaciones y ofertas en la plataforma de licitaciones B2B Wherex.

## Descripción del Proyecto

El Dashboard de Monitoreo es parte de una solución integral que busca aumentar la tasa de oferta de licitaciones mediante el uso de agentes de voz con IA que califican automáticamente el interés de los proveedores.

Este dashboard proporciona:
- **Visualización en tiempo real** de métricas de rendimiento
- **Análisis de sentimiento** de las interacciones con proveedores
- **KPIs estratégicos** para la toma de decisiones
- **Alertas automáticas** basadas en umbrales críticos
- **Reportes históricos** para análisis de tendencias

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     DASHBOARD WEB                           │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│    FRONTEND          │           BACKEND                    │
│    (React + Vite)    │    (Node.js + Express)              │
│                      │                                      │
│  • Visualización     │  • API RESTful                      │
│  • Gráficos          │  • Servicios de Métricas            │
│  • Filtros           │  • Autenticación JWT                │
│  • Notificaciones    │  • Caché & Logging                  │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   MySQL DB      │
                    │                 │
                    │ • Llamadas      │
                    │ • Proveedores   │
                    │ • Licitaciones  │
                    │ • Métricas      │
                    └─────────────────┘
```

## Inicio Rápido

### Requisitos Previos

- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior
- **MySQL** 8.0 o superior

### Instalación Completa

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd CapstoneGrupo5/dashboard-web
```

2. **Configurar la Base de Datos**
```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de creación
source backend/database_schema.sql
```

3. **Configurar el Backend**
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar el servidor
npm run dev
```

4. **Configurar el Frontend**
```bash
cd ../frontend
npm install

# Iniciar la aplicación
npm run dev
```

5. **Acceder al Dashboard**
```
URL: http://localhost:3000
Usuario: admin@dashboard.com
Contraseña: Admin123!
```

## Estructura del Proyecto

```
dashboard-web/
├── backend/                      # Backend Node.js
│   ├── src/
│   │   ├── api/                 # Rutas y controladores
│   │   │   ├── metrics_api.js
│   │   │   └── auth_api.js
│   │   ├── services/            # Lógica de negocio
│   │   │   └── analytics_service.js
│   │   ├── middleware/          # Middlewares
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── config/              # Configuraciones
│   │   │   ├── database.js
│   │   │   └── logger.js
│   │   ├── utils/               # Utilidades
│   │   └── server.js            # Servidor principal
│   ├── database_schema.sql      # Esquema de base de datos
│   ├── package.json
│   └── README.md
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── charts/         # Gráficos
│   │   │   ├── layout/         # Layout
│   │   │   └── ui/             # UI components
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas
│   │   ├── services/           # Servicios API
│   │   ├── styles/             # Estilos
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── README.md
│
└── README.md                     # Este archivo
```

## Características Principales

### Autenticación y Autorización
- Sistema de login con JWT
- Control de acceso basado en roles (RBAC)
  - **Admin**: Acceso completo
  - **Manager**: Todas las métricas
  - **Analyst**: Solo lectura
- Sesiones persistentes
- Rate limiting para seguridad

### KPIs y Métricas
- **Total de Llamadas**: Volumen de llamadas realizadas
- **Contacto Exitoso**: % de llamadas que lograron contacto
- **Duración Promedio**: Tiempo promedio de conversación
- **Conversión a Oferta**: % de llamadas que generaron ofertas

### Visualizaciones
1. **Desempeño Operativo** (Gráfico Circular)
   - Llamadas completadas
   - Llamadas ocupadas
   - Llamadas fallidas
   - Sin respuesta

2. **Análisis de Sentimiento** (Gráfico de Barras)
   - Sentimiento: Positivo, Neutro, Negativo
   - Interés: Interesados, No interesados, Indecisos

3. **Rendimiento Histórico** (Gráfico de Líneas)
   - Series temporales de llamadas
   - Tendencias de conversión
   - Análisis comparativo

4. **Top Proveedores** (Tabla)
   - Ranking por ofertas generadas
   - Métricas por proveedor
   - Tasas de conversión

### Filtros y Análisis
- Filtros de fecha con presets
- Análisis por períodos personalizados
- Agrupación temporal (hora/día/semana/mes)
- Exportación de datos (futuro)

### Sistema de Alertas
- Alertas automáticas basadas en umbrales
- Tres niveles de severidad
- Notificaciones en tiempo real
- Panel de alertas descartables

### Optimizaciones
- Auto-refresh cada 5 minutos
- Sistema de caché (TTL 5 minutos)
- Lazy loading de componentes
- Consultas optimizadas a BD
- Compresión de respuestas
- Rate limiting

## Configuración

### Variables de Entorno - Backend

```env
# Servidor
PORT=3001
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=dashboard_user
DB_PASSWORD=your_password
DB_NAME=licitaciones_b2b

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Caché
CACHE_TTL=300

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Variables de Entorno - Frontend

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## API Endpoints

### Autenticación
```
POST   /api/auth/login       - Iniciar sesión
POST   /api/auth/register    - Registrar usuario (Admin)
GET    /api/auth/me          - Usuario actual
```

### Métricas
```
GET    /api/metrics/kpis          - KPIs principales
GET    /api/metrics/performance   - Desempeño operativo
GET    /api/metrics/sentiment     - Análisis de sentimiento
GET    /api/metrics/historical    - Datos históricos
GET    /api/metrics/providers     - Top proveedores
GET    /api/metrics/alerts        - Alertas del sistema
DELETE /api/metrics/cache         - Limpiar caché (Admin)
```

### Parámetros Comunes
```
?startDate=2024-01-01T00:00:00.000Z
?endDate=2024-12-31T23:59:59.999Z
?groupBy=day|week|month
?limit=10
```

## Base de Datos

### Tablas Principales

#### usuarios
Gestión de usuarios del dashboard

#### proveedores
Información de proveedores registrados

#### licitaciones
Datos de licitaciones activas

#### llamadas
Registro completo de llamadas realizadas por el agente IA
- Estado de la llamada
- Duración
- Sentimiento detectado
- Interés del proveedor
- Transcripción

#### ofertas
Ofertas generadas por los proveedores

#### metricas_diarias
Agregaciones precomputadas para optimizar consultas

### Vistas y Procedimientos
- `v_kpis_actuales`: Vista con KPIs actuales
- `v_top_proveedores`: Vista de top proveedores
- `sp_actualizar_metricas_diarias`: Procedimiento para actualizar métricas

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Metodología de Desarrollo

El proyecto sigue la metodología **Kanban** con las siguientes columnas:
- Backlog
- Por hacer
- En progreso
- En revisión
- Testing
- Completadas

**Límite WIP**: Máximo 6 tareas en desarrollo simultáneamente

**Definition of Done**:
- Código funcional
- Pruebas unitarias
- Documentación actualizada
- Revisión por pares
- Sin linter errors

## Deployment

### Backend

```bash
cd backend
npm run build
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build
# Los archivos estarán en /dist
```

### Docker (Futuro)

```bash
docker-compose up -d
```

## Seguridad

- Helmet.js para headers seguros
- Rate limiting contra brute force
- Validación de entrada con express-validator
- Contraseñas hasheadas con bcryptjs
- JWT con expiración configurable
- CORS configurado
- SQL injection protection

## Métricas de Negocio

### Objetivo del Proyecto
Aumentar la tasa de adjudicación de **39% a 65%**

### KPIs a Monitorear
- Tasa de contacto exitoso: **>50%**
- Tasa de conversión a oferta: **>20%**
- Duración promedio de llamada: **2-5 minutos**
- Sentimiento positivo: **>60%**

## Troubleshooting

### Problemas Comunes

**1. Error de conexión a la base de datos**
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar credenciales en .env
```

**2. Puerto ya en uso**
```bash
# Backend
lsof -ti:3001 | xargs kill -9

# Frontend
lsof -ti:3000 | xargs kill -9
```

**3. Token expirado**
- Hacer logout y volver a iniciar sesión
- Verificar JWT_EXPIRATION en .env

**4. Datos no se cargan**
- Verificar que el backend esté corriendo
- Revisar logs en backend/logs/
- Verificar conexión a la base de datos

## Roadmap

### Fase 1 (Actual) 
- [x] Sistema de autenticación
- [x] Dashboard principal con KPIs
- [x] Visualizaciones básicas
- [x] Sistema de alertas
- [x] Filtros de fecha

### Fase 2 (Próximo)
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Dashboard en tiempo real con WebSockets
- [ ] Módulo de gestión de proveedores
- [ ] Módulo de gestión de licitaciones
- [ ] Configuración de alertas personalizadas

### Fase 3 (Futuro)
- [ ] Análisis predictivo con ML
- [ ] Dashboard móvil nativo
- [ ] Integración con Slack/Teams
- [ ] API pública documentada
- [ ] Multi-tenancy

## Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Equipo

Dashboard desarrollado por el **Grupo 5 del Capstone** para la optimización del Sistema de Licitaciones B2B de Wherex.

### Tecnologías del Stack Completo

**Frontend**: React, Vite, Chart.js, Axios, React Router
**Backend**: Node.js, Express.js, MySQL, JWT, Winston
**DevOps**: Git, npm, MySQL

---

**Versión**: 1.1.0  
**Última actualización**: Noviembre 2025

