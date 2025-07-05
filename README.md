# Sistema de Asignación de Horario (Frontend)

Este proyecto es el frontend de un sistema de **asignación de horarios** para instituciones educativas, desarrollado en **Next.js** y **TypeScript**. Permite gestionar horarios académicos, docentes, aulas, cursos, periodos y secciones de manera eficiente y visual.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Aporte y Propósito](#aporte-y-propósito)

---

## Descripción General

La aplicación permite a administradores y personal académico realizar la gestión de la oferta académica y horarios, incluyendo la asignación de cursos a docentes, la administración de aulas, periodos académicos y la visualización de horarios generados. Está pensada como una interfaz moderna y ágil para facilitar la planificación educativa y evitar conflictos de horarios.

## Características Principales

- **Gestión de Docentes**: Alta, edición y filtrado de docentes, incluyendo restricciones horarias.
- **Gestión de Aulas**: Registro, actualización, filtrado por tipo (teórico/laboratorio) y capacidad.
- **Gestión de Periodos Académicos**: Manejo de periodos con paginación y búsqueda avanzada.
- **Gestión de Cursos y Secciones**: Asignación de secciones a cursos y cursos a docentes.
- **Visualización de Horarios**: Calendario semanal interactivo por sección, periodo o docente.
- **Filtros, búsquedas y paginación** en todas las entidades principales.
- **Interfaz amigable**: Uso extensivo de modales, notificaciones y confirmaciones para la mejor experiencia de usuario.

## Estructura del Proyecto

```
asignacion-de-horario-web/
│
├── src/
│   ├── feactures/
│   │   ├── aula/                # Gestión de aulas
│   │   ├── curso/               # Gestión de cursos y asignaciones
│   │   ├── docente/             # Gestión de docentes y restricciones
│   │   ├── periodo-academico/   # Gestión de periodos académicos
│   │   ├── seccion-academica/   # Gestión de secciones
│   │   └── visualizar-horario/  # Visualización de horarios en calendario
│   ├── components/              # Componentes reutilizables
│   ├── lib/                     # Utilidades y configuración (ej: axios)
│   └── types/                   # Tipos y modelos TypeScript
├── public/                      # Recursos públicos (imágenes, favicon)
├── app/                         # Entrypoint y rutas Next.js
├── package.json
└── README.md
```

Las carpetas `feactures` están organizadas por dominio funcional, siguiendo buenas prácticas de modularidad y escalabilidad.

## Tecnologías Utilizadas

- **[Next.js](https://nextjs.org/)** (App Router)
- **TypeScript**
- **React** (con hooks personalizados)
- **Axios** (consumo de API REST)
- **Tailwind CSS** (o similar) para estilos modernos y responsivos
- **React Toastify/SweetAlert** para notificaciones y confirmaciones
- **Vercel** (opcional) para despliegue

## Instalación y Ejecución

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/devbryan02/asignacion-de-horario-web.git
   cd asignacion-de-horario-web
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en desarrollo:**

   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador:**  
   [http://localhost:3000](http://localhost:3000)

> **Nota:** Es necesario contar con el backend corriendo para el funcionamiento completo (API en `localhost:8080` por defecto).

## Aporte y Propósito

Este proyecto fue desarrollado como aporte personal para optimizar la gestión académica en instituciones educativas. Destaca por su estructura limpia, uso de tecnologías modernas y enfoque en la experiencia de usuario. Puede ser usado como ejemplo profesional en tu CV, mostrando habilidades en desarrollo frontend avanzado, arquitectura de aplicaciones y buenas prácticas.

---

¿Te gustaría contribuir o tienes sugerencias? ¡Tus aportes son bienvenidos!
