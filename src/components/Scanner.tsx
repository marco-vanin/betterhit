interface ScannerProps {
  readonly readerId: string;
  readonly onStop: () => void;
}

export const Scanner = ({ readerId, onStop }: ScannerProps) => {
  console.log("📸 Scanner component rendered with readerId:", readerId);

  return (
    <div className="text-center space-y-6">
      <div>
        <div className="text-4xl mb-4">📸</div>
        <h2 className="text-xl font-light text-gray-900 mb-2">
          Scan en cours...
        </h2>
        <p className="text-gray-500 text-sm">
          Centrez le QR code dans le cadre
        </p>
      </div>

      <div
        id={readerId}
        className="w-[350px] h-[350px] max-[400px]:w-[300px] max-[400px]:h-[300px] max-[340px]:w-[280px] max-[340px]:h-[280px] mx-auto bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shadow-inner"
      >
        <div className="text-gray-400 text-sm">
          Initialisation de la caméra...
        </div>
      </div>

      <button
        onClick={onStop}
        className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors border border-gray-300 rounded-lg"
      >
        Annuler
      </button>
    </div>
  );
};
