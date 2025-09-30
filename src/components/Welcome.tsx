import { ErrorDisplay } from "./ErrorDisplay";

interface WelcomeProps {
  readonly onStartScan: () => void;
  readonly error: string | null;
}

export const Welcome = ({ onStartScan, error }: WelcomeProps) => {
  if (error) {
    return <ErrorDisplay error={error} onRetry={onStartScan} />;
  }

  return (
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
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Commencer le scan
      </button>
    </div>
  );
};
