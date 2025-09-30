import { useState, useEffect } from "react";
import { PATHS } from "../config/constants";
import type { Song, SongsDatabase } from "../types";

interface UseSongsDatabaseReturn {
  readonly songs: SongsDatabase;
  readonly loading: boolean;
  readonly error: string | null;
  readonly findSong: (songId: string) => Song | null;
}

/**
 * Hook for managing songs database
 * Handles loading, caching, and song lookup
 */
export const useSongsDatabase = (): UseSongsDatabaseReturn => {
  const [songs, setSongs] = useState<SongsDatabase>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSongs = async (): Promise<void> => {
      try {
        const response = await fetch(PATHS.SONGS_DATABASE);

        if (!response.ok) {
          throw new Error(`Failed to load songs: ${response.statusText}`);
        }

        const data: SongsDatabase = await response.json();
        setSongs(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  const findSong = (songId: string): Song | null => songs[songId] || null;

  return { songs, loading, error, findSong };
};
