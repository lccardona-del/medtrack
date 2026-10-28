# MedTrack 🩺

**MedTrack** es una aplicación web de tarjetas de estudio y seguimiento del progreso para estudiantes de Medicina, orientada al repaso activo y la consolidación de conocimientos clínicos mediante tarjetas de estudio (*flashcards*).

El diseño original fue concebido en **Google Stitch** bajo el sistema visual *Clinical Precision UI*, combinando ergonomía visual, tipografía clara y una paleta médica (azul clínico, verde menta y blanco).

---

## 🚀 Funcionalidades del MVP

1. **Inicio:**
   - Panel de bienvenida con resumen cuantitativo de tarjetas creadas y estudiadas.
   - Accesos directos a sesiones de estudio y creación de tarjetas.
   - Vista previa de asignaturas registradas.

2. **Crear y Editar Tarjetas:**
   - Registro de nuevas tarjetas con selección de asignatura médica, pregunta clínica y respuesta explicativa.
   - Posibilidad de editar cualquier tarjeta existente para actualizar su contenido clínico.
   - Notificaciones visuales de confirmación de guardado.

3. **Mis Tarjetas:**
   - Consulta de tarjetas agrupadas automáticamente por asignatura (Cardiología, Farmacología, Anatomía, Fisiología, etc.).
   - Visualización controlada de respuestas mediante botones de *"Ver / Ocultar"*.
   - Botón directo de edición para cada tarjeta.
   - Indicador visual cuando una tarjeta ya ha sido estudiada.

4. **Modo Estudio:**
   - Presentación interactiva de tarjetas una a una.
   - Muestra de la pregunta con botón para revelar y ocultar la respuesta clave.
   - Avance secuencial que marca automáticamente la tarjeta como estudiada.
   - Contador de sesión y barra de avance progresivo.
   - Pantalla de finalización con opción de reiniciar el ciclo de estudio.

5. **Mi Progreso:**
   - Métricas en tiempo real de tarjetas creadas y tarjetas estudiadas.
   - Barra de progreso general con porcentaje y cálculo de tarjetas pendientes.
   - Desglose detallado de avance por cada asignatura.

6. **Almacenamiento Local (`localStorage`):**
   - Todos los datos se conservan directamente en la memoria del navegador del usuario. No se pierden al recargar o cerrar la página.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica adaptada a dispositivos móviles y pantallas de escritorio.
* **Tailwind CSS (CDN):** Estilos basados en la especificación de diseño *Clinical Precision UI*.
* **JavaScript Nativo (ES6+):** Lógica completa de navegación SPA, manipulación del DOM y persistencia en `localStorage`. Sin dependencias complejas ni frameworks pesados.
* **Google Fonts:** Tipografía **Manrope** e iconografía **Material Symbols Outlined**.

---

## 📂 Estructura del Proyecto

```text
├── index.html               # Aplicación web unificada (compatible con GitHub Pages)
├── app.js                   # Lógica de la aplicación y almacenamiento local
├── README.md                # Documentación del proyecto
├── .gitignore               # Exclusión de archivos del sistema operativo
├── clinical_precision_ui/   # Especificación de diseño original (DESIGN.md)
├── inicio/                  # Prototipo visual Stitch: Pantalla Inicio
├── crear_tarjeta/           # Prototipo visual Stitch: Pantalla Crear Tarjeta
├── mis_tarjetas/            # Prototipo visual Stitch: Pantalla Mis Tarjetas
├── modo_estudio/            # Prototipo visual Stitch: Pantalla Modo Estudio
└── mi_progreso/             # Prototipo visual Stitch: Pantalla Mi Progreso
```

---

## 💻 Cómo Ejecutar el Proyecto Localmente

1. Descarga o clona este repositorio.
2. Abre el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Safari, Mozilla Firefox, Microsoft Edge).
3. ¡Listo! No requiere servidores locales, Node.js ni bases de datos externas.
