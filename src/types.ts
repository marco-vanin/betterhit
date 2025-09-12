export interface Song {
  readonly title: string;
  readonly artist: string;
  readonly year: number;
  readonly url: string;
}

export interface SongsDatabase {
  readonly [key: string]: Song;
}

export interface ScanResult {
  readonly song: Song | null;
  readonly songId: string | null;
  readonly error: string | null;
  readonly scannedUrl?: string;
  readonly hitsterId?: string | null;
}
