import type { Translations } from './types'

export const en = {
  menu: {
    stats: 'Statistics',
    config: 'Settings',
    statsSubtitle: 'Your focus session history',
    configSubtitle: 'Adjust your timer preferences'
  },
  timer: {
    rest: 'Rest'
  },
  config: {
    focusDuration: 'Focus duration',
    focusSubtitle: 'Minimum {{min}} minutes',
    restDuration: 'Rest duration',
    restSubtitle: 'Minimum {{min}} minute',
    sound: 'Notification sound',
    soundSubtitle: 'Play sound when session ends',
    backgroundTray: 'Background tray mode',
    backgroundTraySubtitle: 'Send app to tray when focus is lost and window is not pinned',
    confetti: 'Confetti',
    confettiSubtitle: 'Launch confetti when focus session completes',
    language: 'Language',
    languageSubtitle: 'App display language',
    healthWarning:
      'Do not exceed the recommended time, take care of your health. Very long sessions can affect your focus and posture.',
    updateReady: 'Update ready',
    downloading: 'Downloading... {{progress}}%',
    updating: 'Updating...',
    checking: 'Checking...',
    upToDate: 'Up to date',
    checkUpdates: 'Check for updates'
  },
  stats: {
    currentStreak: 'Current Streak',
    today: 'Today',
    thisWeek: 'This week',
    total: 'Total',
    streak: 'Streak',
    avgPerDay: 'Avg / day',
    longest: 'Longest',
    days: 'days',
    exportCsv: 'Export CSV',
    clearData: 'Clear data',
    confirmClear: 'Click to confirm',
    totalHours: 'total'
  },
  motivational: {
    startFirst: 'Start your first streak today!',
    getBack: 'Get back on track! Record: {{best}} days',
    bestStreak: "You're on your best streak ever!",
    goodStart: 'Good start! {{left}} days to your record',
    onStreak: "You're on a streak! {{left}} days to your record"
  },
  heatmap: {
    activity: 'Activity',
    less: 'Less',
    more: 'More',
    noSessions: 'No sessions',
    session: 'session',
    sessions: 'sessions',
    mon: 'Mo',
    wed: 'We',
    fri: 'Fr',
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec'
  },
  controls: {
    pinWindow: 'Pin window',
    unpinWindow: 'Unpin window',
    reset: 'Reset',
    pause: 'Pause',
    start: 'Start',
    skipRest: 'Skip rest',
    menu: 'Menu'
  },
  back: {
    label: 'Back'
  },
  update: {
    later: 'Later',
    download: 'Download',
    restart: 'Restart',
    downloading: 'Downloading...',
    skip: 'Skip',
    available: 'Update available',
    snooze: '5 min'
  },
  sounds: {
    bell: 'Classic Bell',
    digital: 'Digital Beep',
    wood: 'Wood Block',
    bowl: 'Tibetan Bowl'
  },
  notifications: {
    exportTitle: 'Export completed',
    exportBody: 'Exported {{count}} sessions to CSV',
    timerTitle: 'Hollow - Timer completed',
    timerBody: 'Your Pomodoro session has ended.'
  },
  updater: {
    title: 'Update available',
    titleSecurity: 'Update available (Security)',
    titleCritical: 'Update available (Critical)',
    linuxMessage:
      'A new version ({{version}}) is available. Please download from the GitHub repository.',
    macMessage: 'A new version ({{version}}) is available.',
    macSecurityNote: ' This version includes important security fixes.',
    macCriticalNote: ' This version includes critical fixes that must be installed.',
    macDetail:
      'Automatic updates are not available on macOS. You can download the new version from GitHub.',
    downloadNow: 'Download now',
    remindLater: 'Remind later',
    downloadBtn: 'Download',
    laterBtn: 'Later'
  }
} as const satisfies Translations
