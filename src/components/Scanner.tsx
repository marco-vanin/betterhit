interface ScannerProps {
  readonly readerId: string;
  readonly onStop: () => void;
}

export const Scanner = ({ readerId, onStop }: ScannerProps) => (
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
      className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
    >
      Annuler
    </button>
  </div>
);
