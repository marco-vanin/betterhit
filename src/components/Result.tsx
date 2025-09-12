import type { ScanResult as ScanResultType } from "../types";
import { MusicPlayer } from "./MusicPlayer";

interface ResultProps {
  readonly result: ScanResultType;
  readonly showDetails: boolean;
  readonly onToggleDetails: () => void;
  readonly onBackToScan: () => void;
}

export const Result = ({ 
  result, 
  showDetails, 
  onToggleDetails, 
  onBackToScan 
}: ResultProps) => {
  const { song } = result;

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
          onClick={onBackToScan}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          ← Retour au scan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lecteur Audio */}
      <MusicPlayer url={song.url} />

      {/* Informations sur la chanson */}
      {showDetails && (
        <div className="bg-white rounded-lg border p-4 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">{song.title}</h2>
          <p className="text-gray-600 mb-1">{song.artist}</p>
          <p className="text-gray-500 text-sm">{song.year}</p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="space-y-3">
        <button
          onClick={onToggleDetails}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {showDetails ? "Masquer les infos" : "Voir les infos"}
        </button>

        <button
          onClick={onBackToScan}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          ← Retour au scan
        </button>
      </div>
    </div>
  );
};
