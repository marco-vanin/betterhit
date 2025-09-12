import { useState } from "react";
import type { Song } from "../types";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface ScanResultProps {
  readonly scannedUrl: string;
  readonly hitsterId: string | null;
  readonly songId: string | null;
  readonly song: Song | null;
}

/**
 * Clean result display with centered layout
 */
export const ScanResult = ({
  scannedUrl,
  hitsterId,
  songId,
  song,
}: ScanResultProps) => {
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (song) {
    return (
      <SongFoundResult
        song={song}
        showSongDetails={showSongDetails}
        onToggleSongDetails={() => setShowSongDetails(!showSongDetails)}
        onShowTechDetails={() => setShowTechnicalDetails(!showTechnicalDetails)}
        showTechDetails={showTechnicalDetails}
        technicalInfo={{ scannedUrl, hitsterId, songId }}
      />
    );
  }

  if (songId) {
    return <SongNotFoundResult songId={songId} scannedUrl={scannedUrl} />;
  }

  return <InvalidQRResult scannedUrl={scannedUrl} />;
};

const SongFoundResult = ({
  song,
  showSongDetails,
  onToggleSongDetails,
  onShowTechDetails,
  showTechDetails,
  technicalInfo,
}: {
  readonly song: Song;
  readonly showSongDetails: boolean;
  readonly onToggleSongDetails: () => void;
  readonly onShowTechDetails: () => void;
  readonly showTechDetails: boolean;
  readonly technicalInfo: {
    scannedUrl: string;
    hitsterId: string | null;
    songId: string | null;
  };
}) => (
  <div className="space-y-4">
    {/* Résultat principal */}
    <Card className="text-center py-8">
      <div className="text-5xl mb-4">🎉</div>

      {showSongDetails ? (
        <>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {song.title}
          </h2>

          <div className="space-y-3 mb-8">
            <div className="text-slate-600">
              <div className="text-lg font-medium">{song.artist}</div>
              <div className="text-sm">• {song.year}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Chanson trouvée !
          </h2>

          <div className="space-y-3 mb-8">
            <div className="text-slate-600">
              <div className="text-lg font-medium">
                Devinez le titre et l'artiste
              </div>
              <div className="text-sm">• Hitster Game</div>
            </div>
          </div>

          {/* Bouton pour révéler la chanson */}
          <div className="mb-6">
            <button
              onClick={onToggleSongDetails}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-lg mr-2">🎵</span>
              Révéler la chanson
            </button>
          </div>
        </>
      )}

      {/* Bouton principal d'action - toujours visible */}
      <div className="mb-6">
        <a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span className="text-xl">🎵</span>
          <span>Écouter maintenant</span>
          <span className="text-lg">↗️</span>
        </a>
      </div>

      {/* Bouton détails techniques */}
      <Button variant="secondary" size="sm" onClick={onShowTechDetails}>
        {showTechDetails ? "🔧 Masquer les détails" : "🔧 Infos techniques"}
      </Button>
    </Card>

    {/* Détails techniques */}
    {showTechDetails && <TechnicalDetails {...technicalInfo} />}
  </div>
);

const SongNotFoundResult = ({
  songId,
  scannedUrl,
}: {
  readonly songId: string;
  readonly scannedUrl: string;
}) => (
  <Card className="text-center py-8">
    <div className="text-5xl mb-4">🤔</div>
    <h2 className="text-xl font-bold text-slate-800 mb-3">Chanson inconnue</h2>
    <p className="text-slate-600 mb-6 leading-relaxed">
      Cette chanson n'est pas encore dans notre base de données
    </p>
    <div className="text-sm text-slate-500 mb-4">
      ID:{" "}
      <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">
        {songId}
      </code>
    </div>
    <details className="text-left max-w-xs mx-auto">
      <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700 text-center">
        Voir l'URL scannée
      </summary>
      <div className="font-mono bg-slate-100 p-3 rounded text-xs mt-2 break-all border">
        {scannedUrl}
      </div>
    </details>
  </Card>
);

const InvalidQRResult = ({ scannedUrl }: { readonly scannedUrl: string }) => (
  <Card className="text-center py-8">
    <div className="text-5xl mb-4">❌</div>
    <h2 className="text-xl font-bold text-slate-800 mb-3">QR code invalide</h2>
    <p className="text-slate-600 mb-6 leading-relaxed">
      Ce QR code n'est pas un code Hitster valide
    </p>
    <details className="text-left max-w-xs mx-auto">
      <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700 text-center">
        Voir l'URL scannée
      </summary>
      <div className="font-mono bg-slate-100 p-3 rounded text-xs mt-2 break-all border">
        {scannedUrl}
      </div>
    </details>
  </Card>
);

const TechnicalDetails = ({
  scannedUrl,
  hitsterId,
  songId,
}: {
  readonly scannedUrl: string;
  readonly hitsterId: string | null;
  readonly songId: string | null;
}) => (
  <Card variant="default" className="bg-slate-50">
    <h3 className="text-center font-semibold text-slate-700 mb-4 text-sm">
      🔧 Détails techniques
    </h3>

    <div className="space-y-3 text-xs">
      <div>
        <div className="font-medium text-slate-600 mb-1">URL scannée:</div>
        <div className="font-mono bg-white p-2 rounded border break-all">
          {scannedUrl}
        </div>
      </div>

      {hitsterId && (
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-600">ID Hitster:</span>
          <code className="bg-white px-2 py-1 rounded border font-mono">
            {hitsterId}
          </code>
        </div>
      )}

      {songId && (
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-600">ID Morceau:</span>
          <code className="bg-white px-2 py-1 rounded border font-mono">
            {songId}
          </code>
        </div>
      )}
    </div>
  </Card>
);
