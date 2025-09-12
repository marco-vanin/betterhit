export interface Song {
  title: string;
  artist: string;
  year: number;
  url: string;
}

export interface SongsDatabase {
  [key: string]: Song;
}

export interface ScanResult {
  song: Song | null;
  songId: string | null;
  error: string | null;
  scannedUrl?: string;
  hitsterId?: string | null;
}
