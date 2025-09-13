interface WelcomeProps {
  readonly onStartScan: () => void;
  readonly error: string | null;
  readonly isSimulationMode?: boolean;
  readonly onToggleCamera?: () => void;
}

export const Welcome = ({
  onStartScan,
  error,
  isSimulationMode = false,
  onToggleCamera,
}: WelcomeProps) => {
  return (
    <div className="text-center space-y-8">
      <div>
        <div className="text-6xl mb-4">{isSimulationMode ? "🎮" : "📱"}</div>
        <h2 className="text-xl font-light text-gray-900 mb-2">
          {isSimulationMode ? "Mode simulation" : "Prêt à scanner ?"}
        </h2>
        <p className="text-gray-500 text-sm">
          {isSimulationMode
            ? "Simulation d'un scan Hitster (dev mode)"
            : "Pointez votre caméra vers un QR code Hitster"}
        </p>
      </div>

      <button
        onClick={onStartScan}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        {isSimulationMode ? "Simuler un scan" : "Commencer le scan"}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <div className="font-medium mb-2">❌ Erreur de scan</div>
          <div>{error}</div>
          <div className="mt-3 pt-3 border-t border-red-200">
            <div className="text-xs text-red-600 mb-2">
              💡 Pour tester sans caméra, ajoutez <code>?debug=true</code> à l'URL
            </div>
            <a 
              href="?debug=true" 
              className="inline-block bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Mode Debug
            </a>
          </div>
        </div>
      )}

      {!isSimulationMode && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <div className="font-medium mb-1">📱 Mode Production</div>
          <div>Utilise la vraie caméra pour scanner les QR codes</div>
          <div className="mt-2 text-xs">
            <a href="?debug=true" className="underline hover:no-underline">
              Passer en mode debug
            </a>
          </div>
        </div>
      )}

      {isSimulationMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          💡 Mode développement : Pas besoin de caméra
          {onToggleCamera && (
            <button
              onClick={onToggleCamera}
              className="ml-2 underline hover:no-underline"
            >
              Utiliser la vraie caméra
            </button>
          )}
        </div>
      )}
    </div>
  );
};
