interface ErrorDisplayProps {
  readonly error: string;
  readonly onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const isHttpsError = error.includes("HTTPS");
  const isCameraError = error.includes("Camera") || error.includes("camera");
  const isPermissionError =
    error.includes("denied") || error.includes("permission");

  return (
    <div className="text-center max-w-md mx-auto space-y-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-light text-gray-900 mb-2">
        Problème détecté
      </h2>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        <div className="font-medium mb-2">❌ Erreur</div>
        <div className="mb-3">{error}</div>

        {isHttpsError && (
          <div className="mt-3 pt-3 border-t border-red-200 text-xs">
            <div className="font-medium mb-1">🔒 Solution HTTPS :</div>
            <div>• Utilisez https:// au lieu de http://</div>
            <div>• Déployez sur un serveur HTTPS</div>
            <div>• Ou utilisez localhost pour les tests</div>
          </div>
        )}

        {isCameraError && !isHttpsError && (
          <div className="mt-3 pt-3 border-t border-red-200 text-xs">
            <div className="font-medium mb-1">📱 Vérifications caméra :</div>
            <div>• Autorisez l'accès à la caméra</div>
            <div>• Vérifiez que votre appareil a une caméra</div>
            <div>• Fermez autres apps utilisant la caméra</div>
          </div>
        )}

        {isPermissionError && (
          <div className="mt-3 pt-3 border-red-200 text-xs">
            <div className="font-medium mb-1">🔓 Permissions :</div>
            <div>• Cliquez sur "Autoriser" quand demandé</div>
            <div>• Vérifiez les paramètres du navigateur</div>
            <div>• Rechargez la page si nécessaire</div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <div className="font-medium mb-1">🔧 Informations de debug :</div>
        <div>• Protocole: {window.location.protocol}</div>
        <div>• Host: {window.location.hostname}</div>
        <div>• Navigateur: {navigator.userAgent.split(" ")[0]}</div>
        <div>• MediaDevices: {navigator.mediaDevices ? "✅" : "❌"}</div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};
