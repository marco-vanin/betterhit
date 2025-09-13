// Configuration de l'application
export const APP_CONFIG = {
  QR_READER_ID: "qr-reader",
  MUSIC_DURATION_SECONDS: 30,
  SEEK_STEP_SECONDS: 5,
  TIMER_INTERVAL_MS: 100,
} as const;

// URLs et chemins
export const PATHS = {
  SONGS_DATABASE: "/songs.json",
  YOUTUBE_IFRAME_API: "https://www.youtube.com/iframe_api",
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  CAMERA_NOT_SUPPORTED: "Camera not supported by this browser",
  CAMERA_ACCESS_DENIED:
    "Camera access denied. Please allow camera permissions.",
  SCANNER_INIT_FAILED: "Scanner initialization failed",
  SONGS_LOAD_FAILED: "Failed to load songs database",
  ELEMENT_NOT_FOUND: (id: string) => `Element #${id} not found`,
} as const;

// Test URLs pour le développement
export const TEST_URLS = {
  VALID_SONG: "https://hitster.com/fr/game/00296",
  INVALID_SONG_1: "https://hitster.com/fr/game/99999",
  INVALID_SONG_2: "https://hitster.com/fr/game/12345",
} as const;
