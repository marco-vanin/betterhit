import { useCallback } from "react";
import { useSongsDatabase } from "./useSongsDatabase";
import { parseHitsterUrl } from "../utils/hitster";
import type { ScanResult, Song } from "../types";

interface UseScanLogicReturn {
  findSong: (songId: string) => Song | null;
  processScanResult: (scannedUrl: string) => ScanResult;
  loading: boolean;
  error: string | null;
}

/**
 * Hook qui encapsule toute la logique métier liée au scan et à la recherche de chansons
 */
export const useScanLogic = (): UseScanLogicReturn => {
  const { findSong, loading, error } = useSongsDatabase();

  const processScanResult = useCallback(
    (scannedUrl: string): ScanResult => {
      const { hitsterId, songId } = parseHitsterUrl(scannedUrl);
      const song = songId ? findSong(songId) : null;

      return {
        song,
        songId,
        hitsterId,
        scannedUrl,
        error: null,
      };
    },
    [findSong]
  );

  return {
    findSong,
    processScanResult,
    loading,
    error,
  };
};
