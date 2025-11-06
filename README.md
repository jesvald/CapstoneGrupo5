# Optimización del Sistema de Invitaciones y Ofertas - Plataforma B2B

Proyecto Capstone Grupo 5 - Sistema integral para la optimización de licitaciones en plataforma B2B mediante agentes de voz con IA.

## Descripción del Proyecto

Este proyecto aborda la problemática de la baja tasa de oferta en la plataforma de licitaciones B2B Wherex, con el objetivo de elevarla mediante la automatización inteligente del contacto inicial con proveedores.

### Problema Identificado

En la plataforma actual, solo el **39% de las licitaciones resultan en transacciones exitosas**, principalmente debido a:
- Proceso manual e ineficiente de contacto con proveedores
- Baja tasa de respuesta de los proveedores
- Dificultad para calificar rápidamente el interés real
- Tiempo excesivo en el proceso de invitación

### Solución Propuesta

Sistema inteligente compuesto por tres componentes principales:

1. **Microservicio ETL** (Python + Flask)
   - Extracción y transformación de datos de proveedores
   - Enriquecimiento con información relevante
   - Preparación de datos para el agente de voz

2. **Agente de Voz con IA** (Plataforma dapta.ai)
   - Llamadas automatizadas a proveedores
   - Calificación de interés mediante IA
   - Análisis de sentimiento en tiempo real
   - Registro de interacciones

3. **Dashboard Web de Monitoreo** (React + Node.js) **IMPLEMENTADO**
   - Visualización de métricas en tiempo real
   - KPIs de rendimiento
   - Análisis de sentimiento
   - Sistema de alertas
   - Reportes históricos

## Objetivos del Proyecto

### Objetivo General
Optimizar el sistema de invitaciones y ofertas de la plataforma de licitaciones Wherex mediante la automatización con agentes de voz IA, aumentando la tasa de oferta

### Objetivos Específicos
1. Desarrollar un microservicio ETL para procesamiento de datos
2. Implementar agente de voz con IA para contacto automatizado
3. **Crear dashboard web para monitoreo y análisis de métricas**
4. Integrar los tres componentes en un sistema cohesivo
5. Medir y validar el aumento en la tasa de adjudicación

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    SLACK WORKSPACE                              │
│              (Interfaz de activación)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MICROSERVICIO ETL                              │
│                 (Python + Flask)                                │
│                                                                 │
│  • Extracción de datos                                         │
│  • Transformación y enriquecimiento                            │
│  • Validación de información                                   │
│  • Almacenamiento en MySQL                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               AGENTE DE VOZ IA                                  │
│               (dapta.ai)                                        │
│                                                                 │
│  • Llamadas automatizadas                                      │
│  • Calificación de interés                                     │
│  • Análisis de sentimiento                                     │
│  • Transcripción de llamadas                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MYSQL DATABASE                                │
│                                                                 │
│  • Proveedores                                                 │
│  • Licitaciones                                                │
│  • Llamadas (estado, duración, sentimiento)                   │
│  • Ofertas                                                     │
│  • Métricas agregadas                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              DASHBOARD WEB IMPLEMENTADO                      │
│           (React + Node.js + Express)                          │
│                                                                 │
│  Frontend:                    Backend:                         │
│  • Visualización de KPIs     • API RESTful                    │
│  • Gráficos interactivos     • Servicios de Analytics         │
│  • Filtros temporales        • Autenticación JWT              │
│  • Sistema de alertas        • Caché y Logging                │
│  • Reportes históricos       • Rate Limiting                  │
└─────────────────────────────────────────────────────────────────┘
```

## Dashboard de Monitoreo (Implementado)

El Dashboard Web es la interfaz principal para monitorear el rendimiento del sistema completo.

### Características Principales

#### Autenticación y Seguridad
- Login con JWT
- Control de acceso basado en roles (Admin, Manager, Analyst)
- Sesiones persistentes
- Rate limiting y protección contra ataques

#### KPIs Principales
- **Total de Llamadas**: Volumen diario/semanal/mensual
- **Contacto Exitoso**: % de llamadas que lograron contacto (Meta: >50%)
- **Duración Promedio**: Tiempo promedio de conversación
- **Conversión a Oferta**: % que generaron ofertas (Meta: >20%)

#### Visualizaciones
1. **Desempeño Operativo** (Gráfico Circular)
   - Completadas vs Ocupadas vs Fallidas
   
2. **Análisis de Sentimiento** (Gráfico de Barras)
   - Positivo, Neutro, Negativo
   - Interesados vs No Interesados

3. **Rendimiento Histórico** (Gráfico de Líneas)
   - Series temporales
   - Tendencias y proyecciones

4. **Top Proveedores** (Tabla Dinámica)
   - Ranking por conversión
   - Métricas individuales

#### Sistema de Alertas
- Alertas automáticas basadas en umbrales
- Tres niveles: Info, Warning, Critical
- Ejemplos:
  - Tasa de contacto <50%
  - Tasa de conversión <20%
  - ℹVolumen de llamadas bajo

####  Filtros y Análisis
- Rangos de fecha personalizados
- Presets: Hoy, 7/30/90 días, Este mes
- Agrupación temporal: Hora/Día/Semana/Mes
- Auto-refresh cada 5 minutos

### Tecnologías Utilizadas

**Frontend**
- React 18.2+
- Vite (build tool)
- Chart.js & Recharts (visualizaciones)
- React Router (navegación)
- Axios (HTTP client)
- React Toastify (notificaciones)
- Lucide React (iconos)

**Backend**
- Node.js 18+
- Express.js (framework)
- MySQL2 (database driver)
- JWT (autenticación)
- Winston (logging)
- Node-Cache (caché en memoria)
- Helmet (seguridad)

### Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd CapstoneGrupo5

# 2. Configurar la base de datos
mysql -u root -p < dashboard-web/backend/database_schema.sql

# 3. Instalar y ejecutar el backend
cd dashboard-web/backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev

# 4. Instalar y ejecutar el frontend
cd ../frontend
npm install
npm run dev

# 5. Acceder al dashboard
# URL: http://localhost:3000
# Usuario: admin@dashboard.com
# Contraseña: Admin123!
```

## 📁 Estructura del Repositorio

```
CapstoneGrupo5/
├── README.md                    # Este archivo
├── context.md                   # Contexto y especificaciones
│
├── dashboard-web/               # ✅ Dashboard Web (IMPLEMENTADO)
│   ├── README.md               # Documentación del dashboard
│   ├── backend/                # Backend Node.js + Express
│   │   ├── src/
│   │   │   ├── api/           # Endpoints REST
│   │   │   ├── services/      # Lógica de negocio
│   │   │   ├── middleware/    # Auth, errors, rate limit
│   │   │   ├── config/        # DB, logger
│   │   │   └── server.js      # Servidor principal
│   │   ├── database_schema.sql
│   │   └── package.json
│   │
│   └── frontend/               # Frontend React
│       ├── src/
│       │   ├── components/    # Componentes React
│       │   ├── pages/         # Páginas
│       │   ├── services/      # API services
│       │   ├── hooks/         # Custom hooks
│       │   └── styles/        # Estilos CSS
│       └── package.json
│
├── etl-microservice/           # Microservicio ETL (Por implementar)
│   └── README.md
│
└── voice-agent/                # Agente de Voz IA (Por implementar)
    └── README.md
```



## Metodología de Desarrollo

### Kanban
El proyecto utiliza metodología Kanban con las siguientes columnas:
- **Backlog**: Tareas por priorizar
- **Por hacer**: Tareas priorizadas
- **En progreso**: Desarrollo activo (WIP: 6 max)
- **En revisión**: Code review
- **Testing**: Pruebas
- **Completadas**: Tareas terminadas

### Definition of Done
Código funcional y testeado
Pruebas unitarias pasando
Documentación actualizada
Revisión por pares aprobada
Sin errores de linter
Cumple con los requisitos

## Métricas de Éxito

### KPIs del Proyecto
- **Tasa de Adjudicación**: 39% → 65% (Objetivo)
- **Tasa de Contacto Exitoso**: >50%
- **Tasa de Conversión a Oferta**: >20%
- **Tiempo de Respuesta**: <24 horas
- **Satisfacción de Proveedores**: >4/5

### Métricas Técnicas
- **Disponibilidad del Sistema**: >99%
- **Tiempo de Respuesta API**: <200ms
- **Tasa de Error**: <1%
- **Cobertura de Tests**: >80%

## 🔧 Requisitos del Sistema

### Desarrollo
- Node.js 18.0.0+
- npm 9.0.0+
- MySQL 8.0+
- Git

### Producción
- Servidor Linux/Windows
- 2GB RAM mínimo
- 20GB espacio en disco
- Conexión a internet estable

## Próximos Pasos

### Corto Plazo
1. Implementar Microservicio ETL
2. Integrar Agente de Voz IA
3. Conectar todos los componentes
4. Realizar pruebas de integración
5. Deployar en ambiente de staging

### Mediano Plazo
1. Optimizar rendimiento del sistema
2. Implementar exportación de reportes
3. Agregar WebSockets para tiempo real
4. Desarrollar módulo de gestión de proveedores
5. Implementar análisis predictivo

### Largo Plazo
1. Escalabilidad horizontal
2. Multi-tenancy
3. API pública
4. Dashboard móvil nativo
5. Integración con más plataformas

## Equipo

**Capstone Grupo 5**

Proyecto desarrollado como parte del Capstone para la optimización del Sistema de Licitaciones B2B de Wherex.

**Versión**: 1.1.0  
**Última actualización**: Noviembre 2025