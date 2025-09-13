import { useCallback } from 'react';
import { useSongsDatabase } from './useSongsDatabase';
import { parseHitsterUrl } from '../utils/hitster';
import { TEST_URLS } from '../config/constants';
import type { ScanResult, Song } from '../types';

interface UseScanLogicReturn {
  findSong: (songId: string) => Song | null;
  processScanResult: (scannedUrl: string) => ScanResult;
  getTestScanResult: () => ScanResult;
  loading: boolean;
  error: string | null;
}

/**
 * Hook qui encapsule toute la logique métier liée au scan et à la recherche de chansons
 */
export const useScanLogic = (): UseScanLogicReturn => {
  const { findSong, loading, error } = useSongsDatabase();

  const processScanResult = useCallback((scannedUrl: string): ScanResult => {
    const { hitsterId, songId } = parseHitsterUrl(scannedUrl);
    const song = songId ? findSong(songId) : null;

    return {
      song,
      songId,
      hitsterId,
      scannedUrl,
      error: null,
    };
  }, [findSong]);

  const getTestScanResult = useCallback((): ScanResult => {
    return processScanResult(TEST_URLS.VALID_SONG);
  }, [processScanResult]);

  return {
    findSong,
    processScanResult,
    getTestScanResult,
    loading,
    error,
  };
};