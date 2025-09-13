import { useState, useRef, useCallback } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";
import type { QrcodeSuccessCallback } from "html5-qrcode";

interface UseQRScannerReturn {
  readonly isScanning: boolean;
  readonly error: string | null;
  readonly startScanner: () => Promise<void>;
  readonly stopScanner: () => Promise<void>;
}

interface UseQRScannerOptions {
  readonly onScanSuccess: QrcodeSuccessCallback;
  readonly readerId: string;
}

/**
 * Hook for managing QR code scanning
 * Handles scanner lifecycle, permissions, and error states
 */
export const useQRScanner = ({
  onScanSuccess,
  readerId,
}: UseQRScannerOptions): UseQRScannerReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const checkCameraPermissions = async (): Promise<void> => {
    console.log('🎥 Checking camera permissions...');
    
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('❌ Camera API not supported');
      throw new Error("Camera not supported by this browser");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('✅ Camera permissions granted');
      // Fermer le stream de test
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('❌ Camera access denied:', err);
      throw new Error("Camera access denied. Please allow camera permissions.");
    }
  };

  const waitForElement = (elementId: string, timeout = 1000): Promise<void> =>
    new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkElement = (): void => {
        if (document.getElementById(elementId)) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element #${elementId} not found`));
        } else {
          setTimeout(checkElement, 50);
        }
      };
      checkElement();
    });

  const startScanner = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        return;
      }

      setIsScanning(true);
      await waitForElement(readerId);
      await checkCameraPermissions();

      const scanner = new Html5QrcodeScanner(
        readerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
          supportedScanTypes: [],
        },
        false
      );

      // Wrapper pour arrêter automatiquement le scanner après un scan réussi
      const wrappedOnSuccess: QrcodeSuccessCallback = (
        decodedText,
        decodedResult
      ) => {
        // Arrêter le scanner d'abord
        scanner
          .clear()
          .then(() => {
            setIsScanning(false);
            scannerRef.current = null;
            // Puis appeler le callback original
            onScanSuccess(decodedText, decodedResult);
          })
          .catch((clearError) => {
            console.error("Error clearing scanner:", clearError);
            setIsScanning(false);
            scannerRef.current = null;
            // Appeler quand même le callback
            onScanSuccess(decodedText, decodedResult);
          });
      };

      scanner.render(wrappedOnSuccess, (err) => {
        // Only log critical errors to avoid spam
        if (err.includes("NotAllowedError") || err.includes("NotFoundError")) {
          console.error("QR Scanner error:", err);
        }
      });

      scannerRef.current = scanner;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Scanner initialization failed";
      setError(message);
      setIsScanning(false);
    }
  }, [onScanSuccess, readerId]);

  const stopScanner = useCallback(async (): Promise<void> => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.clear();
    } catch (err) {
      console.error("Error stopping scanner:", err);
    } finally {
      scannerRef.current = null;
      setIsScanning(false);
    }
  }, []);

  return { isScanning, error, startScanner, stopScanner };
};
