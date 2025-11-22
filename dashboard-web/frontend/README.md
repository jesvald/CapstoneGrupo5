# Dashboard Frontend - Sistema de Licitaciones B2B

Frontend del Dashboard de Monitoreo construido con React y Vite.

## Tecnologías

- **React** 18.2+ - Librería de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Chart.js** & **Recharts** - Visualización de datos
- **React Toastify** - Notificaciones
- **Lucide React** - Iconos
- **date-fns** - Manipulación de fechas

## Requisitos Previos

- Node.js 18.0.0 o superior
- npm 9.0.0 o superior
- Backend corriendo en `http://localhost:3001`

## Instalación

### Con Docker (Recomendado)

La forma más fácil de ejecutar el frontend es usando Docker:

```bash
# Desde el directorio raíz del proyecto
docker compose up -d frontend

# Ver logs
docker compose logs -f frontend

# Reconstruir después de cambios
docker compose build frontend
docker compose up -d frontend
```

El frontend estará disponible en `http://localhost:3000`

**Características del contenedor**:
- ✅ Build optimizado con Vite
- ✅ Servido con Nginx para máximo rendimiento
- ✅ Configuración SPA para React Router
- ✅ Proxy automático al backend
- ✅ Compresión gzip habilitada
- ✅ Headers de seguridad configurados

### Instalación Manual

1. Instalar dependencias:
```bash
cd dashboard-web/frontend
npm install
```

2. Configurar variables de entorno (opcional):
Crear archivo `.env` en la raíz del frontend:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```


## Uso

### Con Docker
```bash
# Iniciar el frontend
docker compose up -d frontend

# Ver logs en tiempo real
docker compose logs -f frontend

# Reiniciar el frontend
docker compose restart frontend

# Detener el frontend
docker compose stop frontend

# Reconstruir después de cambios en el código
docker compose build frontend
docker compose up -d frontend
```

### Manual

#### Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`

#### Build para Producción
```bash
npm run build
```
Los archivos de producción se generarán en el directorio `/dist`

#### Preview de Build
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```


## Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
│   └── vite.svg
├── src/
│   ├── components/        # Componentes React
│   │   ├── charts/       # Componentes de gráficos
│   │   │   ├── PerformanceChart.jsx
│   │   │   ├── SentimentChart.jsx
│   │   │   └── HistoricalChart.jsx
│   │   ├── layout/       # Componentes de layout
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/           # Componentes de UI
│   │       ├── KPICard.jsx
│   │       ├── DateFilter.jsx
│   │       ├── AlertsPanel.jsx
│   │       └── ProvidersTable.jsx
│   ├── hooks/            # Custom hooks
│   │   └── useDateRange.js
│   ├── pages/            # Páginas/Vistas
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/         # Servicios y APIs
│   │   └── api_service.js
│   ├── styles/           # Estilos globales
│   │   └── index.css
│   ├── App.jsx           # Componente principal
│   └── index.jsx         # Punto de entrada
├── index.html
├── vite.config.js
└── package.json
```

## Características

### Autenticación
- Sistema de login con JWT
- Persistencia de sesión
- Protección de rutas
- Control de acceso basado en roles (RBAC)

### Dashboard Principal
- **KPIs en Tiempo Real**:
  - Total de llamadas
  - Porcentaje de contacto exitoso
  - Duración promedio de llamadas
  - Tasa de conversión a oferta

- **Visualizaciones**:
  - Gráfico de desempeño operativo (Doughnut)
  - Análisis de sentimiento e interés (Bar chart)
  - Rendimiento histórico (Line chart con múltiples ejes)
  - Tabla de top proveedores

### Filtros y Análisis
- Filtro de rango de fechas con presets:
  - Hoy
  - Últimos 7/30/90 días
  - Este mes / Mes pasado
  - Rango personalizado

### Sistema de Alertas
- Alertas en tiempo real basadas en umbrales
- Tres niveles de severidad: info, warning, critical
- Alertas descartables por el usuario

### Características Técnicas
- Auto-refresh cada 5 minutos
- Sistema de caché optimizado
- Manejo robusto de errores
- Loading states
- Diseño responsive (mobile-first)
- Notificaciones toast
- Animaciones y transiciones suaves

## Autenticación

### Credenciales de Prueba
```
Email: admin@dashboard.com
Password: Admin123!
```

### Roles de Usuario
- **Admin**: Acceso completo
- **Manager**: Acceso a todas las métricas
- **Analyst**: Solo lectura

## Componentes Principales

### KPICard
Tarjeta para mostrar KPIs con íconos y tendencias.

```jsx
<KPICard
  title="Total de Llamadas"
  value={1234}
  icon="phone"
  color="blue"
  trend="up"
/>
```

### DateFilter
Selector de rango de fechas con presets.

```jsx
<DateFilter
  startDate={startDate}
  endDate={endDate}
  onChange={handleDateChange}
/>
```

### PerformanceChart
Gráfico circular para métricas de desempeño.

```jsx
<PerformanceChart data={performanceData} />
```

### SentimentChart
Gráfico de barras para análisis de sentimiento.

```jsx
<SentimentChart data={sentimentData} />
```

### HistoricalChart
Gráfico de líneas para datos históricos.

```jsx
<HistoricalChart data={historicalData} />
```

## Configuración de API

El servicio de API está configurado en `src/services/api_service.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
```

### Endpoints Disponibles

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual

#### Métricas
- `GET /metrics/kpis` - KPIs principales
- `GET /metrics/performance` - Métricas de desempeño
- `GET /metrics/sentiment` - Análisis de sentimiento
- `GET /metrics/historical` - Datos históricos
- `GET /metrics/providers` - Top proveedores
- `GET /metrics/alerts` - Alertas del sistema

## Personalización de Estilos

Las variables CSS están definidas en `src/styles/index.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  /* ... más variables */
}
```

## Responsive Design

El dashboard está optimizado para múltiples dispositivos:
- **Desktop**: 1400px+ (vista completa)
- **Tablet**: 768px - 1400px (grid adaptado)
- **Mobile**: <768px (vista móvil)

## Optimizaciones

- **Code Splitting**: Rutas lazy-loaded
- **Memoización**: Componentes optimizados con React.memo
- **Caché**: Datos cacheados en el backend
- **Compresión**: Assets comprimidos en build
- **Tree Shaking**: Eliminación de código no usado

## Debugging

### Modo Desarrollo
El modo desarrollo incluye:
- Hot Module Replacement (HMR)
- Source maps
- React DevTools compatible
- Logs de red en consola

### Errores Comunes

1. **Error de conexión al backend**:
   - Verificar que el backend esté corriendo en el puerto 3001
   - Revisar configuración de CORS

2. **Token expirado**:
   - El sistema redirige automáticamente al login
   - Duración del token: 24 horas (configurable)

3. **Datos no se actualizan**:
   - Usar botón de "Actualizar" para forzar recarga
   - Verificar el auto-refresh (cada 5 minutos)


## Equipo

Dashboard desarrollado por el Grupo 5 del Capstone para la optimización del Sistema de Licitaciones B2B - Wherex.


