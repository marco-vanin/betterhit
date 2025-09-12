import { useState, useCallback } from "react";

import { useSongsDatabase } from "./hooks/useSongsDatabase";
import { useQRScanner } from "./hooks/useQRScanner";
import { parseHitsterUrl } from "./utils/hitster";
import type { ScanResult as ScanResultType } from "./types";

const READER_ID = "qr-reader";

const App = () => {
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showSongDetails, setShowSongDetails] = useState(false);

  const { findSong, loading: dbLoading, error: dbError } = useSongsDatabase();

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
    await startScanner();
  }, [startScanner]);

  const handleNewScan = useCallback(async () => {
    setScanResult(null);
    setShowSongDetails(false);
    await startScanner();
  }, [startScanner]);

  if (dbLoading) {
    return <LoadingView />;
  }

  if (dbError) {
    return <ErrorView error={dbError} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="pt-8 pb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">🎵</span>
        </div>
        <h1 className="text-2xl font-light text-gray-900">Hitster Helper</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {isFirstTime && !isScanning && !scanResult && (
            <WelcomeView onStartScan={handleStartScan} scanError={scanError} />
          )}

          {isScanning && <ScanView readerId={READER_ID} onStop={stopScanner} />}

          {!isFirstTime && !isScanning && scanResult && (
            <ResultView
              scanResult={scanResult}
              showSongDetails={showSongDetails}
              onToggleDetails={() => setShowSongDetails(!showSongDetails)}
              onNewScan={handleNewScan}
              scanError={scanError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const WelcomeView = ({
  onStartScan,
  scanError,
}: {
  readonly onStartScan: () => void;
  readonly scanError: string | null;
}) => (
  <div className="text-center space-y-8">
    <div>
      <div className="text-6xl mb-4">📱</div>
      <h2 className="text-xl font-light text-gray-900 mb-2">
        Prêt à scanner ?
      </h2>
      <p className="text-gray-500 text-sm">
        Pointez votre caméra vers un QR code Hitster
      </p>
    </div>

    <button
      onClick={onStartScan}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
    >
      Commencer le scan
    </button>

    {scanError && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        {scanError}
      </div>
    )}
  </div>
);

const ScanView = ({
  readerId,
  onStop,
}: {
  readonly readerId: string;
  readonly onStop: () => void;
}) => (
  <div className="text-center space-y-6">
    <div>
      <div className="text-4xl mb-4">📸</div>
      <h2 className="text-xl font-light text-gray-900 mb-2">
        Scan en cours...
      </h2>
      <p className="text-gray-500 text-sm">Centrez le QR code dans le cadre</p>
    </div>

    <div
      id={readerId}
      className="w-full max-w-sm mx-auto bg-gray-50 rounded-lg overflow-hidden"
    />

    <button
      onClick={onStop}
      className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
    >
      Annuler
    </button>
  </div>
);

const ResultView = ({
  scanResult,
  showSongDetails,
  onToggleDetails,
  onNewScan,
  scanError,
}: {
  readonly scanResult: ScanResultType;
  readonly showSongDetails: boolean;
  readonly onToggleDetails: () => void;
  readonly onNewScan: () => void;
  readonly scanError: string | null;
}) => {
  const { song } = scanResult;

  if (!song) {
    return (
      <div className="text-center space-y-8">
        <div>
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-xl font-light text-gray-900 mb-2">
            Chanson inconnue
          </h2>
          <p className="text-gray-500 text-sm">
            Cette chanson n'est pas dans notre base
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Nouveau scan
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🎉</div>

      <div className="space-y-4">
        {showSongDetails ? (
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-gray-900">{song.title}</h2>
            <div className="text-gray-600">
              <div className="font-medium">{song.artist}</div>
              <div className="text-sm">{song.year}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-gray-900">
              Chanson trouvée !
            </h2>
            <p className="text-gray-500">Devinez avant de révéler</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!showSongDetails && (
          <button
            onClick={onToggleDetails}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Révéler la chanson
          </button>
        )}

        {showSongDetails && (
          <button
            onClick={onToggleDetails}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
          >
            Masquer les détails
          </button>
        )}

        <a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          🎵 Écouter maintenant
        </a>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={onNewScan}
          className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors duration-200"
        >
          🔄 Nouveau scan
        </button>
      </div>

      {scanError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {scanError}
        </div>
      )}
    </div>
  );
};

const LoadingView = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
        <span className="text-2xl text-white">🎵</span>
      </div>
      <h2 className="text-xl font-light text-gray-900 mb-2">Préparation...</h2>
      <p className="text-gray-500 text-sm">Chargement de la base de données</p>
    </div>
  </div>
);

const ErrorView = ({ error }: { readonly error: string }) => (
  <div className="min-h-screen bg-white flex items-center justify-center px-6">
    <div className="text-center max-w-sm">
      <div className="text-6xl mb-4">💥</div>
      <h2 className="text-xl font-light text-gray-900 mb-2">Erreur</h2>
      <p className="text-gray-500 text-sm">{error}</p>
    </div>
  </div>
);

export default App;
