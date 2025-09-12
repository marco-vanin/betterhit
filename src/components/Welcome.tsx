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
  onToggleCamera 
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
            : "Pointez votre caméra vers un QR code Hitster"
          }
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
          {error}
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
