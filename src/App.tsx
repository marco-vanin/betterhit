import { useState, useCallback } from "react";
import { useSongsDatabase } from "./hooks/useSongsDatabase";
import { useQRScanner } from "./hooks/useQRScanner";
import { parseHitsterUrl } from "./utils/hitster";
import { Welcome } from "./components/Welcome";
import { Scanner } from "./components/Scanner";
import { Result } from "./components/Result";
import type { ScanResult as ScanResultType } from "./types";

const READER_ID = "qr-reader";

const App = () => {
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [forceRealCamera, setForceRealCamera] = useState(false);

  const { findSong, loading: dbLoading, error: dbError } = useSongsDatabase();

  // Mode simulation pour le développement (sauf si forcé) + mode debug temporaire
  const isSimulationMode = (import.meta.env.DEV && !forceRealCamera) || window.location.search.includes('debug=true');

  const simulateScan = useCallback(() => {
    // URL de test avec la chanson existante dans songs.json
    const testUrl = "https://hitster.com/fr/game/00296"; // Chanson existante

    const { hitsterId, songId } = parseHitsterUrl(testUrl);
    const song = songId ? findSong(songId) : null;

    setScanResult({
      song,
      songId,
      hitsterId,
      scannedUrl: testUrl,
      error: null,
    });

    setIsFirstTime(false);
    setShowSongDetails(false);
  }, [findSong]);

  const {
    isScanning,
    error: scanError,
    startScanner,
    stopScanner,
  } = useQRScanner({
    onScanSuccess: (decodedText: string) => {
      const { hitsterId, songId } = parseHitsterUrl(decodedText);
      const song = songId ? findSong(songId) : null;

      setScanResult({
        song,
        songId,
        hitsterId,
        scannedUrl: decodedText,
        error: null,
      });

      setIsFirstTime(false);
      setShowSongDetails(false);
    },
    readerId: READER_ID,
  });

  const handleStartScan = useCallback(async () => {
    if (isSimulationMode) {
      // En mode dev, simule directement
      simulateScan();
    } else {
      await startScanner();
    }
  }, [startScanner, simulateScan, isSimulationMode]);

  const handleBackToScan = useCallback(() => {
    setScanResult(null);
    setShowSongDetails(false);
    setIsFirstTime(true);
  }, []);

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🎵</div>
          <h2 className="text-xl font-light text-gray-900 mb-2">
            Préparation...
          </h2>
          <p className="text-gray-500 text-sm">
            Chargement de la base de données
          </p>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">�</div>
          <h2 className="text-xl font-light text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-500 text-sm">{dbError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="pt-8 pb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          {/* Logo avec une icône musicale propre */}
          <img
            src="/icons/android/android-launchericon-96-96.png"
            alt="Hitster Helper Logo"
            className="w-full h-full rounded-2xl shadow-lg"
          />
        </div>
        <h1 className="text-2xl font-light text-gray-900">Hitster Helper</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          {isFirstTime && !isScanning && !scanResult && (
            <div className="max-w-md mx-auto">
              <Welcome
                onStartScan={handleStartScan}
                error={scanError}
                isSimulationMode={isSimulationMode}
                onToggleCamera={() => setForceRealCamera(!forceRealCamera)}
              />
            </div>
          )}

          {isScanning && (
            <div className="max-w-md mx-auto">
              <Scanner readerId={READER_ID} onStop={stopScanner} />
            </div>
          )}

          {!isFirstTime && !isScanning && scanResult && (
            <Result
              result={scanResult}
              showDetails={showSongDetails}
              onToggleDetails={() => setShowSongDetails(!showSongDetails)}
              onBackToScan={handleBackToScan}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
