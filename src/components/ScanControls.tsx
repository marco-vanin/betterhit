import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface ScanControlsProps {
  readonly isScanning: boolean;
  readonly error: string | null;
  readonly onStartScan: () => void;
  readonly onStopScan: () => void;
}

/**
 * Clean controls for starting/stopping QR code scanning
 */
export const ScanControls = ({
  isScanning,
  error,
  onStartScan,
  onStopScan,
}: ScanControlsProps) => (
  <Card className="text-center">
    {isScanning ? (
      <Button variant="secondary" onClick={onStopScan} size="lg">
        ⏹️ Arrêter le scan
      </Button>
    ) : (
      <Button onClick={onStartScan} size="lg">
        📱 Scanner un QR code
      </Button>
    )}

    {error && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
        <div className="font-medium text-red-800 mb-2">
          ⚠️ Problème de caméra
        </div>
        <div className="text-red-700 space-y-1 text-xs">
          <p>• Autorisez l'accès à la caméra</p>
          <p>• Vérifiez les permissions dans votre navigateur</p>
          <p>• Essayez de rafraîchir la page</p>
        </div>
      </div>
    )}
  </Card>
);
