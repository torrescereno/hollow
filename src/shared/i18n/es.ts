import type { Translations } from './types'

export const es = {
  menu: {
    stats: 'Estadísticas',
    config: 'Configuración',
    statsSubtitle: 'Tu historial de sesiones de enfoque',
    configSubtitle: 'Ajusta tus preferencias de temporizador'
  },
  timer: {
    rest: 'Descanso'
  },
  config: {
    focusDuration: 'Duración de enfoque',
    focusSubtitle: 'Mínimo {{min}} minutos',
    restDuration: 'Duración de descanso',
    restSubtitle: 'Mínimo {{min}} minuto',
    sound: 'Sonido de notificación',
    soundSubtitle: 'Reproducir sonido al terminar sesión',
    confetti: 'Confetti',
    confettiSubtitle: 'Lanzar confetti al completar sesión de enfoque',
    language: 'Idioma',
    languageSubtitle: 'Idioma de la aplicación',
    healthWarning:
      'No excedas el tiempo recomendado, cuida tu salud. Sesiones muy largas pueden afectar tu concentración y postura.',
    updateReady: 'Actualización lista',
    downloading: 'Descargando... {{progress}}%',
    updating: 'Actualizando...',
    checking: 'Verificando...',
    upToDate: 'Todo al día',
    checkUpdates: 'Buscar actualizaciones'
  },
  stats: {
    currentStreak: 'Racha Actual',
    today: 'Hoy',
    thisWeek: 'Esta semana',
    total: 'Total',
    streak: 'Racha',
    avgPerDay: 'Prom / día',
    longest: 'Más larga',
    days: 'días',
    exportCsv: 'Exportar CSV',
    clearData: 'Borrar datos',
    confirmClear: 'Clic para confirmar',
    totalHours: 'total'
  },
  motivational: {
    startFirst: '¡Comienza tu primera racha hoy!',
    getBack: '¡Vuelve al ritmo! Récord: {{best}} días',
    bestStreak: '¡Estás en tu mejor racha histórica!',
    goodStart: '¡Buen comienzo! A {{left}} días de tu récord',
    onStreak: '¡Vas en racha! A {{left}} días de tu récord'
  },
  heatmap: {
    activity: 'Actividad',
    less: 'Menos',
    more: 'Más',
    noSessions: 'Sin sesiones',
    session: 'sesión',
    sessions: 'sesiones',
    mon: 'Lu',
    wed: 'Mi',
    fri: 'Vi',
    jan: 'Ene',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Abr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Ago',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dic'
  },
  controls: {
    pinWindow: 'Anclar ventana',
    unpinWindow: 'Desanclar ventana',
    reset: 'Reiniciar',
    pause: 'Pausar',
    start: 'Iniciar',
    skipRest: 'Saltar descanso',
    menu: 'Menú'
  },
  back: {
    label: 'Volver'
  },
  update: {
    later: 'Después',
    download: 'Descargar',
    restart: 'Reiniciar',
    downloading: 'Descargando...',
    skip: 'Omitir',
    available: 'Actualización disponible',
    snooze: '5 min'
  },
  sounds: {
    bell: 'Campana Clásica',
    digital: 'Pitido Digital',
    wood: 'Bloque de Madera',
    bowl: 'Cuenco Tibetano'
  },
  notifications: {
    exportTitle: 'Exportación completada',
    exportBody: 'Se exportaron {{count}} sesiones a CSV',
    timerTitle: 'Hollow - Timer completado',
    timerBody: 'Tu sesión de Pomodoro ha terminado.'
  },
  updater: {
    title: 'Actualización disponible',
    titleSecurity: 'Actualización disponible (Seguridad)',
    titleCritical: 'Actualización disponible (Crítica)',
    linuxMessage:
      'Una nueva versión ({{version}}) está disponible. Por favor descargue desde el repositorio de GitHub.',
    macMessage: 'Una nueva versión ({{version}}) está disponible.',
    macSecurityNote: ' Esta versión incluye correcciones de seguridad importantes.',
    macCriticalNote: ' Esta versión incluye correcciones críticas que deben instalarse.',
    macDetail:
      'Las actualizaciones automáticas no están disponibles en macOS. Puedes descargar la nueva versión desde GitHub.',
    downloadNow: 'Descargar ahora',
    remindLater: 'Recordar después',
    downloadBtn: 'Descargar',
    laterBtn: 'En otro momento'
  }
} as const satisfies Translations
