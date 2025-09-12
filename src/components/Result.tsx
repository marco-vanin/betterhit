import type { ScanResult as ScanResultType } from "../types";

interface ResultProps {
  readonly result: ScanResultType;
  readonly showDetails: boolean;
  readonly onToggleDetails: () => void;
  readonly onNewScan: () => void;
}

export const Result = ({
  result,
  showDetails,
  onToggleDetails,
  onNewScan,
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
          onClick={onNewScan}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors"
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
        {showDetails ? (
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
        {!showDetails && (
          <button
            onClick={onToggleDetails}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Révéler la chanson
          </button>
        )}

        {showDetails && (
          <button
            onClick={onToggleDetails}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-6 rounded-lg transition-colors text-sm"
          >
            Masquer les détails
          </button>
        )}

        <a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          🎵 Écouter maintenant
        </a>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={onNewScan}
          className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
        >
          🔄 Nouveau scan
        </button>
      </div>
    </div>
  );
};
