/**
 * Utility functions for parsing Hitster QR codes and extracting song information
 * Pure functions - no side effects, predictable outputs
 */

export interface HitsterInfo {
  readonly hitsterId: string | null;
  readonly songId: string | null;
}

/**
 * Normalizes URL by adding protocol if missing
 */
const normalizeUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

/**
 * Extracts path segments from URL
 */
const extractPathSegments = (url: string): string[] => {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return urlObj.pathname.split("/").filter(Boolean);
  } catch {
    return [];
  }
};

/**
 * Extracts Hitster IDs from a Hitster QR code URL
 * Expected format: domain.com/lang/hitsterId/songId
 */
export const parseHitsterUrl = (url: string): HitsterInfo => {
  const segments = extractPathSegments(url);

  if (segments.length >= 2) {
    return {
      hitsterId: segments[segments.length - 2],
      songId: segments[segments.length - 1],
    };
  }

  return {
    hitsterId: null,
    songId: segments[0] || null,
  };
};

/**
 * Validates if a string looks like a valid Hitster song ID
 */
export const isValidSongId = (songId: string | null): songId is string =>
  songId !== null && /^\d{5}$/.test(songId);
