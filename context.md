# Optimización del Sistema de Invitaciones y Ofertas: Guía de Desarrollo del Dashboard

Este documento proporciona el contexto completo y las directrices técnicas para el desarrollo del Dashboard de Monitoreo dentro del proyecto de "Optimización del Sistema de Invitaciones y Ofertas en la Plataforma de Licitaciones B2B".

## 1. Contexto del Proyecto

El proyecto aborda una ineficiencia crítica en la plataforma de licitaciones B2B Wherex, donde solo el 39% de las licitaciones resultan en transacciones exitosas. La solución propuesta es un sistema inteligente que automatiza el contacto inicial con proveedores mediante agentes de voz de IA, con el objetivo de elevar la tasa de adjudicación al 65%.

La arquitectura de la solución se compone de tres elementos principales:
1.  Un **Microservicio ETL** (Python, Flask) que extrae, transforma y enriquece los datos de los proveedores.
2.  Un **Agente de Voz con IA** (utilizando la plataforma dapta.ai) que realiza llamadas automatizadas para calificar el interés de los proveedores.
3.  Un **Dashboard Web de Monitoreo** que proporciona métricas y análisis en tiempo real sobre el rendimiento del sistema.

Este documento se centra exclusivamente en el desarrollo del tercer componente: el **Dashboard Web de Monitoreo**.

**Objetivo del Dashboard**: Crear una herramienta de monitoreo web que permita visualizar en tiempo real las métricas de rendimiento del sistema de agentes de voz y el progreso hacia los objetivos de negocio establecidos.

## 2. Pila Tecnológica del Dashboard

El desarrollo se realizará utilizando la siguiente pila tecnológica, según lo definido en el documento del proyecto:

*   **Frontend**: **React**
    *   Un framework para construir interfaces de usuario interactivas y reactivas con una arquitectura basada en componentes.
*   **Backend**: **Node.js** con **Express.js**
    *   Node.js como entorno de ejecución de JavaScript del lado del servidor.
    *   Express.js como framework para la construcción de APIs RESTful robustas y eficientes.
*   **Base de Datos**: **MySQL**
    *   Una base de datos relacional para el almacenamiento y la gestión de datos estructurados. El dashboard compartirá una instancia con otros microservicios, pero operará sobre esquemas de datos optimizados para consultas analíticas.

## 3. Estructura de Directorios Sugerida

Se recomienda una estructura de monorepositorio o dos directorios separados para mantener el código organizado y desacoplado.

```
/dashboard-web/
├── /frontend/
│   ├── /public/
│   │   ├── index.html
│   │   └── ...
│   ├── /src/
│   │   ├── /components/       # Componentes reutilizables (botones, gráficos, tablas)
│   │   │   ├── charts/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── /pages/            # Vistas principales del dashboard
│   │   ├── /services/         # Lógica para interactuar con la API del backend (api_service.js)
│   │   ├── /hooks/            # Hooks personalizados de React
│   │   ├── /styles/           # Archivos de estilos (CSS, SASS)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── ...
│
└── /backend/
    ├── /src/
    │   ├── /api/              # Definición de rutas y controladores (metrics_api.js)
    │   ├── /services/         # Lógica de negocio y cálculo de métricas (analytics_service.js)
    │   ├── /middleware/       # Middlewares para autenticación, logging, etc.
    │   ├── /config/           # Configuración de la base de datos y entorno
    │   ├── /utils/            # Funciones de utilidad
    │   └── server.js          # Archivo de entrada del servidor Express
    ├── package.json
    └── ...
```

## 4. Flujo de Integración y Datos

El dashboard es el componente final del flujo de datos y su función principal es la visualización y el análisis.

1.  **Activación**: El proceso general se inicia cuando un ejecutivo comercial activa el microservicio ETL a través de un comando en Slack.
2.  **Procesamiento de Datos**: El microservicio ETL procesa los datos de los proveedores, los enriquece y los almacena en la base de datos MySQL.
3.  **Ejecución de Llamadas**: El Agente de Voz (dapta.ai) utiliza los datos procesados para realizar llamadas, y los resultados (transcripciones, sentimiento, interés) se almacenan de nuevo en la base de datos MySQL.
4.  **Consulta de Datos del Dashboard**: El **backend de Node.js** del dashboard consulta periódicamente la base de datos MySQL. Ejecuta agregaciones, cálculos de KPIs y preparaciones de datos para ser expuestos a través de la API RESTful.
5.  **Visualización**: El **frontend de React** consume los endpoints de la API del backend para obtener los datos procesados y los renderiza en forma de gráficos, tablas y KPIs interactivos para el usuario final.
6.  **Interacción del Usuario**: El usuario puede aplicar filtros (fechas, proveedores, etc.) que generan nuevas solicitudes a la API para obtener vistas granulares de los datos.

## 5. Instrucciones de Desarrollo

Se debe asumir que los componentes del microservicio ETL y del agente de voz están funcionales y que los datos relevantes están siendo poblados en la base de datos MySQL.

### 5.1. Desarrollo del Backend (Node.js + Express.js)

1.  **Configuración del Servidor**:
    *   Inicializar un proyecto de Node.js y configurar un servidor básico con Express.js.
    *   Establecer una conexión segura a la base de datos MySQL principal.

2.  **API RESTful**:
    *   Diseñar y desarrollar una API RESTful que sirva como punto de comunicación con el frontend.
    *   Los endpoints deben ser claros y estar bien documentados (usando OpenAPI/Swagger si es posible).
    *   Ejemplos de endpoints: `GET /api/metrics/kpis`, `GET /api/metrics/performance`, `GET /api/metrics/sentiment`.

3.  **Servicios de Métricas**:
    *   Crear servicios responsables de consultar la base de datos y realizar cálculos complejos de métricas en tiempo real.
    *   Optimizar las consultas a la base de datos para un alto rendimiento, utilizando índices estratégicos y, si es necesario, procedimientos almacenados.

4.  **Autenticación y Autorización**:
    *   Implementar un middleware para la gestión de usuarios basado en roles (RBAC). El documento especifica roles como **Admin**, **Manager** y **Analyst**.
    *   Asegurar los endpoints para que solo los usuarios autorizados puedan acceder a la información.

5.  **Optimización y Logging**:
    *   Implementar mecanismos de caché para optimizar el rendimiento en consultas frecuentes.
    *   Integrar un sistema de logging centralizado para registrar eventos importantes y errores.

### 5.2. Desarrollo del Frontend (React)

1.  **Arquitectura de Componentes**:
    *   Diseñar una interfaz de usuario responsiva e intuitiva, siguiendo el mockup proporcionado en el **Anexo D**.
    *   Construir la UI utilizando componentes reutilizables (por ejemplo, para gráficos, tarjetas de KPIs, tablas de datos y filtros).

2.  **Visualización de Datos**:
    *   Integrar una librería de gráficos interactivos (como Chart.js, D3.js, o Recharts) para visualizar las métricas en tiempo real.
    *   Las visualizaciones clave a implementar (basadas en el mockup) son:
        *   **KPIs principales**: Llamadas realizadas, % de contacto exitoso, duración promedio, conversión a oferta.
        *   **Desempeño Operativo**: Métricas sobre llamadas completadas, ocupadas, fallidas, etc.
        *   **Análisis de Interés y Sentimiento**: Gráficos que muestren la distribución de proveedores interesados, no interesados y el sentimiento general (positivo, neutro, negativo).
        *   **Rendimiento Histórico**: Gráficos de series temporales para analizar tendencias diarias/semanales.

3.  **Interactividad y Funcionalidad**:
    *   Implementar un sistema de filtros avanzados para el análisis granular de datos (por ejemplo, por rango de fechas, proveedor, etc.).
    *   Desarrollar un sistema de notificaciones push para alertas críticas del sistema (ej. "Tasa de conversión por debajo del 20%").
    *   Asegurar que el diseño sea adaptable (responsive) para funcionar correctamente en dispositivos móviles y de escritorio.

4.  **Comunicación con el Backend**:
    *   Crear un servicio de API en el frontend para gestionar todas las solicitudes al backend de Node.js.
    *   Manejar de forma elegante los estados de carga, éxito y error de las solicitudes.

## 6. Metodología de Desarrollo (Kanban)

El desarrollo del dashboard debe seguir la metodología Kanban definida en el proyecto.
*   **Gestión Visual**: Todas las tareas (épicas, historias de usuario) deben ser gestionadas en un tablero Kanban con las columnas definidas: `Backlog`, `Por hacer`, `En progreso`, `En revisión`, `Testing`, `Completadas`.
*   **Límites WIP**: Respetar los límites de "Work In Progress" para mantener el foco y la calidad. Por ejemplo: máximo 6 tareas en desarrollo simultáneamente (3 por desarrollador).
*   **Políticas Explícitas**: Adherirse a la "Definición de Terminado" (Definition of Done) para asegurar que cada tarea completada incluye código funcional, pruebas unitarias, documentación y revisión por pares.
*   **Flujo y Mejora Continua**: Participar en las reuniones de mejora continua (Daily Standup, Reunión de Flujo, Retrospectiva) para identificar bloqueos y optimizar el proceso de desarrollo.
