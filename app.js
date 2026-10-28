/**
 * MedTrack - Lógica Principal (app.js)
 * Paso 3: Modo Estudio interactivo y pantalla de Progreso en tiempo real.
 */

// Clave para guardar en localStorage
const STORAGE_KEY = 'medtrack_cards';

// Títulos para cada pantalla en el encabezado superior
const VISTAS = {
  'inicio': 'Inicio',
  'mis-tarjetas': 'Mis Tarjetas',
  'crear': 'Crear Tarjeta',
  'estudio': 'Modo Estudio',
  'progreso': 'Mi Progreso'
};

// Variable para la vista activa
let vistaActual = 'inicio';

// Variable de temporizador para la notificación toast
let toastTimeout = null;

// Índice de la tarjeta que se está revisando en el Modo Estudio
let indiceEstudio = 0;

/**
 * Función para escapar caracteres especiales de texto y evitar errores en pantalla
 */
function escaparHTML(texto) {
  if (!texto) return '';
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/**
 * 1. OBTENER TARJETAS DESDE LOCALSTORAGE
 * Si no existen tarjetas previamente, añade 4 tarjetas médicas de ejemplo iniciales.
 */
function obtenerTarjetas() {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);

  // Si está vacío por primera vez, creamos las tarjetas médicas iniciales
  if (datosGuardados === null) {
    const tarjetasIniciales = [
      {
        id: 'med_' + Date.now() + '_1',
        asignatura: 'Cardiología',
        pregunta: '¿Cuáles son las ramas principales de la arteria coronaria izquierda?',
        respuesta: 'Se bifurca en la arteria descendente anterior (interventricular anterior) y la arteria circunfleja.',
        estudiada: false
      },
      {
        id: 'med_' + Date.now() + '_2',
        asignatura: 'Farmacología',
        pregunta: '¿Cuál es el antídoto específico para la intoxicación aguda por paracetamol?',
        respuesta: 'N-acetilcisteína (NAC), la cual repone los depósitos hepáticos de glutatión y neutraliza el metabolito tóxico NAPQI.',
        estudiada: false
      },
      {
        id: 'med_' + Date.now() + '_3',
        asignatura: 'Anatomía Humana',
        pregunta: '¿Qué estructuras anatómicas forman los límites del triángulo femoral (de Scarpa)?',
        respuesta: 'Límite superior: Ligamento inguinal. Límite lateral: Músculo sartorio. Límite medial: Músculo aductor largo.',
        estudiada: false
      },
      {
        id: 'med_' + Date.now() + '_4',
        asignatura: 'Fisiología',
        pregunta: '¿Cuál es la función principal del surfactante pulmonar producido por los neumocitos tipo II?',
        respuesta: 'Disminuir la tensión superficial en la interfaz aire-líquido alveolar para evitar el colapso de los alvéolos (atelectasia) al final de la espiración.',
        estudiada: false
      }
    ];

    guardarTarjetasEnStorage(tarjetasIniciales);
    return tarjetasIniciales;
  }

  try {
    return JSON.parse(datosGuardados) || [];
  } catch (error) {
    console.error('Error al leer las tarjetas:', error);
    return [];
  }
}

/**
 * 2. GUARDAR TARJETAS EN LOCALSTORAGE
 */
function guardarTarjetasEnStorage(tarjetas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarjetas));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

/**
 * 3. MOSTRAR MENSAJE EMERGENTE (TOAST)
 */
function mostrarToast(titulo, subtitulo) {
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastSubtitle = document.getElementById('toastSubtitle');

  if (!toast) return;

  if (toastTitle) toastTitle.textContent = titulo;
  if (toastSubtitle) toastSubtitle.textContent = subtitulo;

  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

/**
 * 4. ACTUALIZAR PANTALLA DE INICIO (Métricas y lista de asignaturas)
 */
function renderizarInicio() {
  const tarjetas = obtenerTarjetas();

  // Contador total
  const elTotal = document.getElementById('inicio-total-tarjetas');
  if (elTotal) elTotal.textContent = tarjetas.length;

  // Contador estudiadas
  const elEstudiadas = document.getElementById('inicio-total-estudiadas');
  const totalEstudiadas = tarjetas.filter(t => t.estudiada).length;
  if (elEstudiadas) elEstudiadas.textContent = totalEstudiadas;

  // Resumen de asignaturas
  const contenedorAsignaturas = document.getElementById('inicio-lista-asignaturas');
  if (!contenedorAsignaturas) return;

  if (tarjetas.length === 0) {
    contenedorAsignaturas.innerHTML = `
      <div class="p-space-md rounded-xl bg-surface-container-lowest border border-surface-container-low text-center text-on-surface-variant text-body-sm">
        Aún no tienes asignaturas creadas.
      </div>
    `;
    return;
  }

  // Agrupar por asignatura
  const conteoPorAsignatura = {};
  tarjetas.forEach(t => {
    conteoPorAsignatura[t.asignatura] = (conteoPorAsignatura[t.asignatura] || 0) + 1;
  });

  let htmlAsignaturas = '';
  for (const [asignatura, cantidad] of Object.entries(conteoPorAsignatura)) {
    htmlAsignaturas += `
      <div class="rounded-xl bg-surface-container-lowest p-space-md shadow-sm border border-surface-container-low flex items-center justify-between cursor-pointer active:bg-surface-container-low transition-colors" onclick="cambiarVista('mis-tarjetas')">
        <div class="flex items-center gap-space-sm min-w-0">
          <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span class="material-symbols-outlined text-[20px]">folder</span>
          </div>
          <div class="min-w-0">
            <h3 class="font-title-md text-title-md text-on-surface truncate">${escaparHTML(asignatura)}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant">${cantidad} ${cantidad === 1 ? 'tarjeta' : 'tarjetas'}</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
      </div>
    `;
  }

  contenedorAsignaturas.innerHTML = htmlAsignaturas;
}

/**
 * 5. ACTUALIZAR PANTALLA "MIS TARJETAS"
 * Muestra las tarjetas agrupadas por su asignatura con opción de ver respuesta o editar.
 */
function renderizarMisTarjetas() {
  const tarjetas = obtenerTarjetas();

  // Contador de tarjetas creadas
  const contadorEl = document.getElementById('mis-tarjetas-contador');
  if (contadorEl) {
    contadorEl.textContent = `${tarjetas.length} ${tarjetas.length === 1 ? 'tarjeta creada' : 'tarjetas creadas'}`;
  }

  const contenedorLista = document.getElementById('mis-tarjetas-lista');
  if (!contenedorLista) return;

  // Si no hay tarjetas, mostrar estado vacío
  if (tarjetas.length === 0) {
    contenedorLista.innerHTML = `
      <div class="p-space-xl rounded-2xl bg-surface-container-lowest border border-surface-container-low text-center flex flex-col items-center justify-center gap-space-xs">
        <span class="material-symbols-outlined text-[40px] text-primary">folder_open</span>
        <p class="font-title-md text-title-md text-on-surface">No hay tarjetas registradas</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Crea tu primera tarjeta con el botón superior "Nueva".</p>
      </div>
    `;
    return;
  }

  // Agrupar tarjetas por asignatura
  const grupos = {};
  tarjetas.forEach(tarjeta => {
    if (!grupos[tarjeta.asignatura]) {
      grupos[tarjeta.asignatura] = [];
    }
    grupos[tarjeta.asignatura].push(tarjeta);
  });

  let htmlTotal = '';

  for (const [asignatura, listaTarjetas] of Object.entries(grupos)) {
    let articulosTarjetas = '';

    listaTarjetas.forEach(tarjeta => {
      articulosTarjetas += `
        <article class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-low flex flex-col gap-space-sm" id="card-item-${tarjeta.id}">
          <div class="flex items-start justify-between gap-space-sm">
            <span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-1 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              ${escaparHTML(tarjeta.asignatura)}
            </span>
            ${tarjeta.estudiada ? `
              <span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-[14px]">check</span> Estudiada
              </span>
            ` : ''}
          </div>

          <h3 class="font-title-md text-title-md text-on-surface leading-snug">
            ${escaparHTML(tarjeta.pregunta)}
          </h3>

          <!-- Respuesta (inicialmente oculta) -->
          <div id="card-answer-${tarjeta.id}" class="hidden rounded-xl bg-surface-container-low p-space-sm border border-surface-container text-body-sm text-on-surface">
            <p class="font-semibold text-secondary text-label-sm mb-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              RESPUESTA
            </p>
            <p class="leading-relaxed">${escaparHTML(tarjeta.respuesta)}</p>
          </div>

          <!-- Botones de acción de la tarjeta -->
          <div class="pt-space-xs flex items-center justify-end gap-space-xs">
            <button class="p-2 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container transition-colors flex items-center gap-1" onclick="toggleRespuestaTarjeta('${tarjeta.id}')" type="button">
              <span class="material-symbols-outlined text-[18px]" id="icon-toggle-${tarjeta.id}">visibility</span>
              <span class="font-label-md text-label-md" id="label-toggle-${tarjeta.id}">Ver</span>
            </button>
            <button class="p-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center gap-1" onclick="iniciarEdicion('${tarjeta.id}')" type="button">
              <span class="material-symbols-outlined text-[18px]">edit</span>
              <span class="font-label-md text-label-md">Editar</span>
            </button>
          </div>
        </article>
      `;
    });

    htmlTotal += `
      <section class="flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <h2 class="font-title-lg text-title-lg text-on-surface">${escaparHTML(asignatura)}</h2>
            <span class="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-medium">
              ${listaTarjetas.length} ${listaTarjetas.length === 1 ? 'tarjeta' : 'tarjetas'}
            </span>
          </div>
          <span class="material-symbols-outlined text-outline text-[20px]">folder</span>
        </div>
        <div class="flex flex-col gap-space-sm">
          ${articulosTarjetas}
        </div>
      </section>
    `;
  }

  contenedorLista.innerHTML = htmlTotal;
}

/**
 * 6. MOSTRAR U OCULTAR RESPUESTA DENTRO DE "MIS TARJETAS"
 */
function toggleRespuestaTarjeta(id) {
  const answerEl = document.getElementById(`card-answer-${id}`);
  const iconEl = document.getElementById(`icon-toggle-${id}`);
  const labelEl = document.getElementById(`label-toggle-${id}`);

  if (!answerEl) return;

  const estaOculta = answerEl.classList.contains('hidden');

  if (estaOculta) {
    answerEl.classList.remove('hidden');
    if (iconEl) iconEl.textContent = 'visibility_off';
    if (labelEl) labelEl.textContent = 'Ocultar';
  } else {
    answerEl.classList.add('hidden');
    if (iconEl) iconEl.textContent = 'visibility';
    if (labelEl) labelEl.textContent = 'Ver';
  }
}

/**
 * 7. INICIAR EDICIÓN DE UNA TARJETA
 */
function iniciarEdicion(id) {
  const tarjetas = obtenerTarjetas();
  const tarjeta = tarjetas.find(t => t.id === id);
  if (!tarjeta) return;

  // Llenar campos del formulario
  document.getElementById('editingCardId').value = tarjeta.id;
  document.getElementById('subjectSelect').value = tarjeta.asignatura;
  document.getElementById('cardQuestion').value = tarjeta.pregunta;
  document.getElementById('cardAnswer').value = tarjeta.respuesta;

  // Ajustar textos para modo edición
  document.getElementById('form-badge-title').textContent = 'Edición de Tarjeta';
  document.getElementById('form-main-title').textContent = 'Editar Tarjeta';
  document.getElementById('btnSubmitCardText').textContent = 'Guardar Cambios';

  const btnCancel = document.getElementById('btnCancelEdit');
  if (btnCancel) btnCancel.classList.remove('hidden');

  // Navegar a la pantalla de Crear / Editar
  cambiarVista('crear');
}

/**
 * 8. CANCELAR EDICIÓN
 */
function cancelarEdicion() {
  const form = document.getElementById('cardForm');
  if (form) form.reset();

  document.getElementById('editingCardId').value = '';
  document.getElementById('form-badge-title').textContent = 'Creación de Tarjetas';
  document.getElementById('form-main-title').textContent = 'Crear Tarjeta';
  document.getElementById('btnSubmitCardText').textContent = 'Guardar Tarjeta';

  const btnCancel = document.getElementById('btnCancelEdit');
  if (btnCancel) btnCancel.classList.add('hidden');

  cambiarVista('mis-tarjetas');
}

/**
 * 9. GUARDAR O ACTUALIZAR TARJETA DESDE EL FORMULARIO
 */
function manejarEnvioFormulario(evento) {
  evento.preventDefault();

  const idEdicion = document.getElementById('editingCardId').value.trim();
  const asignatura = document.getElementById('subjectSelect').value;
  const pregunta = document.getElementById('cardQuestion').value.trim();
  const respuesta = document.getElementById('cardAnswer').value.trim();

  if (!asignatura || !pregunta || !respuesta) {
    alert('Por favor completa todos los campos requeridos.');
    return;
  }

  let tarjetas = obtenerTarjetas();

  if (idEdicion) {
    // Modo Edición: Actualizar tarjeta existente
    const indice = tarjetas.findIndex(t => t.id === idEdicion);
    if (indice !== -1) {
      tarjetas[indice].asignatura = asignatura;
      tarjetas[indice].pregunta = pregunta;
      tarjetas[indice].respuesta = respuesta;
      guardarTarjetasEnStorage(tarjetas);
      mostrarToast('Tarjeta actualizada', 'Los cambios se han guardado con éxito.');
    }
  } else {
    // Modo Creación: Añadir nueva tarjeta
    const nuevaTarjeta = {
      id: 'med_' + Date.now(),
      asignatura: asignatura,
      pregunta: pregunta,
      respuesta: respuesta,
      estudiada: false
    };

    tarjetas.push(nuevaTarjeta);
    guardarTarjetasEnStorage(tarjetas);
    mostrarToast('Tarjeta creada', 'Tu tarjeta médica ha sido guardada correctamente.');
  }

  // Limpiar formulario y restablecer estados
  const form = document.getElementById('cardForm');
  if (form) form.reset();
  document.getElementById('editingCardId').value = '';
  document.getElementById('form-badge-title').textContent = 'Creación de Tarjetas';
  document.getElementById('form-main-title').textContent = 'Crear Tarjeta';
  document.getElementById('btnSubmitCardText').textContent = 'Guardar Tarjeta';

  const btnCancel = document.getElementById('btnCancelEdit');
  if (btnCancel) btnCancel.classList.add('hidden');

  // Actualizar pantallas
  renderizarInicio();
  renderizarMisTarjetas();
  renderizarProgreso();

  // Redirigir a "Mis Tarjetas" para ver el resultado
  cambiarVista('mis-tarjetas');
}

/**
 * 10. MODO ESTUDIO
 * Presenta una tarjeta a la vez, permite revelar/ocultar respuesta y avanzar.
 */
function renderizarModoEstudio() {
  const tarjetas = obtenerTarjetas();

  const contActivo = document.getElementById('estudio-contenedor-activo');
  const contFinalizado = document.getElementById('estudio-contenedor-finalizado');
  const contVacio = document.getElementById('estudio-contenedor-vacio');

  // Caso 1: No existen tarjetas para estudiar
  if (tarjetas.length === 0) {
    if (contActivo) contActivo.classList.add('hidden');
    if (contFinalizado) contFinalizado.classList.add('hidden');
    if (contVacio) contVacio.classList.remove('hidden');
    return;
  }

  if (contVacio) contVacio.classList.add('hidden');

  // Caso 2: Se completaron todas las tarjetas de la sesión
  if (indiceEstudio >= tarjetas.length) {
    if (contActivo) contActivo.classList.add('hidden');
    if (contFinalizado) contFinalizado.classList.remove('hidden');
    return;
  }

  // Caso 3: Mostrando tarjeta activa
  if (contFinalizado) contFinalizado.classList.add('hidden');
  if (contActivo) contActivo.classList.remove('hidden');

  const tarjetaActual = tarjetas[indiceEstudio];

  // Asignatura
  const elAsignatura = document.getElementById('estudio-asignatura-nombre');
  if (elAsignatura) elAsignatura.textContent = tarjetaActual.asignatura;

  // Contador de sesión ("Tarjeta X de Y")
  const elContador = document.getElementById('estudio-contador');
  if (elContador) elContador.textContent = `Tarjeta ${indiceEstudio + 1} de ${tarjetas.length}`;

  // Barra de progreso de la sesión
  const elBarra = document.getElementById('estudio-progreso-barra');
  if (elBarra) {
    const porcentaje = Math.round(((indiceEstudio + 1) / tarjetas.length) * 100);
    elBarra.style.width = `${porcentaje}%`;
  }

  // Pregunta y respuesta
  const elPregunta = document.getElementById('estudio-pregunta');
  if (elPregunta) elPregunta.textContent = tarjetaActual.pregunta;

  const elRespuesta = document.getElementById('estudio-respuesta');
  if (elRespuesta) elRespuesta.textContent = tarjetaActual.respuesta;

  // Asegurar que la respuesta empiece oculta
  const contRespuesta = document.getElementById('estudio-respuesta-container');
  if (contRespuesta) contRespuesta.classList.add('hidden');

  const btnLabel = document.getElementById('toggle-respuesta-label');
  if (btnLabel) btnLabel.textContent = 'Revelar Respuesta';

  const btnIcon = document.getElementById('toggle-respuesta-icon');
  if (btnIcon) btnIcon.textContent = 'visibility';
}

/**
 * Revelar u ocultar la respuesta en el Modo Estudio
 */
function toggleRespuestaEstudio() {
  const contRespuesta = document.getElementById('estudio-respuesta-container');
  const btnLabel = document.getElementById('toggle-respuesta-label');
  const btnIcon = document.getElementById('toggle-respuesta-icon');

  if (!contRespuesta) return;

  const estaOculta = contRespuesta.classList.contains('hidden');

  if (estaOculta) {
    contRespuesta.classList.remove('hidden');
    if (btnLabel) btnLabel.textContent = 'Ocultar Respuesta';
    if (btnIcon) btnIcon.textContent = 'visibility_off';
  } else {
    contRespuesta.classList.add('hidden');
    if (btnLabel) btnLabel.textContent = 'Revelar Respuesta';
    if (btnIcon) btnIcon.textContent = 'visibility';
  }
}

/**
 * Avanzar a la siguiente tarjeta y marcar la actual como estudiada
 */
function avanzarSiguienteTarjetaEstudio() {
  let tarjetas = obtenerTarjetas();

  if (indiceEstudio < tarjetas.length) {
    // Marcar como estudiada
    tarjetas[indiceEstudio].estudiada = true;
    guardarTarjetasEnStorage(tarjetas);

    // Actualizar métricas generales
    renderizarInicio();
    renderizarProgreso();
    renderizarMisTarjetas();

    // Avanzar índice
    indiceEstudio++;
    renderizarModoEstudio();
  }
}

/**
 * Reiniciar la sesión de estudio desde la primera tarjeta
 */
function reiniciarSesionEstudio() {
  indiceEstudio = 0;
  renderizarModoEstudio();
}

/**
 * 11. ACTUALIZAR PANTALLA "MI PROGRESO"
 * Métricas numéricas, barra de progreso general y progreso por asignatura con datos reales.
 */
function renderizarProgreso() {
  const tarjetas = obtenerTarjetas();
  const totalCreadas = tarjetas.length;
  const totalEstudiadas = tarjetas.filter(t => t.estudiada).length;

  // 1. Tarjetas de métricas
  const elTotalCreadas = document.getElementById('progreso-total-creadas');
  if (elTotalCreadas) elTotalCreadas.textContent = totalCreadas;

  const elTotalEstudiadas = document.getElementById('progreso-total-estudiadas');
  if (elTotalEstudiadas) elTotalEstudiadas.textContent = totalEstudiadas;

  // 2. Progreso General (Barra y porcentajes)
  const porcentaje = totalCreadas > 0 ? Math.round((totalEstudiadas / totalCreadas) * 100) : 0;
  const pendientes = Math.max(0, totalCreadas - totalEstudiadas);

  const elPorcentaje = document.getElementById('progreso-porcentaje-general');
  if (elPorcentaje) elPorcentaje.textContent = `${porcentaje}%`;

  const elBarra = document.getElementById('progreso-barra-general');
  if (elBarra) elBarra.style.width = `${porcentaje}%`;

  const elTextoGeneral = document.getElementById('progreso-texto-general');
  if (elTextoGeneral) {
    elTextoGeneral.textContent = `${totalEstudiadas} de ${totalCreadas} tarjetas estudiadas`;
  }

  const elPendientes = document.getElementById('progreso-pendientes-general');
  if (elPendientes) {
    elPendientes.textContent = `${pendientes} ${pendientes === 1 ? 'pendiente' : 'pendientes'}`;
  }

  // 3. Desglose de progreso por Asignatura
  const contenedorAsignaturas = document.getElementById('progreso-lista-asignaturas');
  if (!contenedorAsignaturas) return;

  if (totalCreadas === 0) {
    contenedorAsignaturas.innerHTML = `
      <p class="font-body-sm text-body-sm text-on-surface-variant text-center py-2">
        Aún no tienes tarjetas creadas.
      </p>
    `;
    return;
  }

  // Agrupar tarjetas por asignatura y contar cuántas han sido estudiadas
  const grupos = {};
  tarjetas.forEach(t => {
    if (!grupos[t.asignatura]) {
      grupos[t.asignatura] = { total: 0, estudiadas: 0 };
    }
    grupos[t.asignatura].total++;
    if (t.estudiada) {
      grupos[t.asignatura].estudiadas++;
    }
  });

  let htmlAsignaturas = '';
  for (const [asignatura, stats] of Object.entries(grupos)) {
    htmlAsignaturas += `
      <div class="flex items-center justify-between p-space-sm bg-surface-container-low/50 rounded-xl border border-surface-container-low">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
          <span class="font-title-md text-title-md text-on-surface font-medium">${escaparHTML(asignatura)}</span>
        </div>
        <div class="flex items-center gap-space-sm">
          <span class="font-body-sm text-body-sm text-on-surface-variant">
            <strong class="text-secondary font-semibold">${stats.estudiadas}</strong> / ${stats.total} estudiadas
          </span>
        </div>
      </div>
    `;
  }

  contenedorAsignaturas.innerHTML = htmlAsignaturas;
}

/**
 * 12. CAMBIO DE PANTALLAS (Router simple)
 */
function cambiarVista(nombreVista) {
  if (!VISTAS[nombreVista]) return;

  vistaActual = nombreVista;

  // Ocultar todas las pantallas y mostrar solo la seleccionada
  document.querySelectorAll('.view-screen').forEach(seccion => {
    seccion.classList.add('hidden');
  });

  const seccionObjetivo = document.getElementById(`view-${nombreVista}`);
  if (seccionObjetivo) {
    seccionObjetivo.classList.remove('hidden');
  }

  // Actualizar título en el encabezado superior
  const tituloEncabezado = document.getElementById('header-view-title');
  if (tituloEncabezado) {
    tituloEncabezado.textContent = VISTAS[nombreVista];
  }

  // Actualizar pestaña activa en la barra de navegación inferior
  document.querySelectorAll('.nav-tab-btn').forEach(boton => {
    const tabName = boton.getAttribute('data-nav-tab');
    if (tabName === nombreVista) {
      boton.classList.add('text-primary', 'font-bold');
      boton.classList.remove('text-on-surface-variant');
    } else {
      boton.classList.remove('text-primary', 'font-bold');
      boton.classList.add('text-on-surface-variant');
    }
  });

  // Refrescar datos según la vista que se acaba de abrir
  const tarjetas = obtenerTarjetas();

  if (nombreVista === 'inicio') {
    renderizarInicio();
  } else if (nombreVista === 'mis-tarjetas') {
    renderizarMisTarjetas();
  } else if (nombreVista === 'estudio') {
    // Si la sesión anterior había terminado, reiniciar desde la tarjeta 1
    if (indiceEstudio >= tarjetas.length) {
      indiceEstudio = 0;
    }
    renderizarModoEstudio();
  } else if (nombreVista === 'progreso') {
    renderizarProgreso();
  }

  // Scroll suave al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 13. INICIALIZACIÓN AL CARGAR LA PÁGINA
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar almacenamiento y cargar tarjetas iniciales si está vacío
  obtenerTarjetas();

  // Renderizar vistas con los datos guardados
  renderizarInicio();
  renderizarMisTarjetas();
  renderizarProgreso();

  // Eventos de la barra inferior
  document.querySelectorAll('.nav-tab-btn').forEach(boton => {
    boton.addEventListener('click', () => {
      const destino = boton.getAttribute('data-nav-tab');
      cambiarVista(destino);
    });
  });

  // Eventos de accesos rápidos
  document.querySelectorAll('[data-navigate]').forEach(elemento => {
    elemento.addEventListener('click', () => {
      const destino = elemento.getAttribute('data-navigate');
      cambiarVista(destino);
    });
  });

  // Evento de envío del formulario de tarjetas
  const form = document.getElementById('cardForm');
  if (form) {
    form.addEventListener('submit', manejarEnvioFormulario);
  }

  // Evento del botón cancelar edición
  const btnCancel = document.getElementById('btnCancelEdit');
  if (btnCancel) {
    btnCancel.addEventListener('click', cancelarEdicion);
  }

  // Eventos del Modo Estudio
  const btnToggleRespuesta = document.getElementById('btn-toggle-respuesta');
  if (btnToggleRespuesta) {
    btnToggleRespuesta.addEventListener('click', toggleRespuestaEstudio);
  }

  const btnSiguiente = document.getElementById('btn-siguiente-tarjeta');
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', avanzarSiguienteTarjetaEstudio);
  }

  const btnReiniciar = document.getElementById('btn-reiniciar-estudio');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', reiniciarSesionEstudio);
  }

  // Iniciar en la pantalla de Inicio
  cambiarVista('inicio');
});
