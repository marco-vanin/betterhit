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
    console.log("🎥 Checking camera permissions...");
    console.log("🌐 Protocol:", window.location.protocol);
    console.log("📱 User agent:", navigator.userAgent);

    if (!navigator.mediaDevices?.getUserMedia) {
      console.error("❌ Camera API not supported");
      throw new Error("Camera not supported by this browser");
    }

    // Vérifier si on est en HTTPS (requis pour la caméra sur mobile)
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      console.error("❌ HTTPS required for camera access");
      throw new Error("HTTPS is required for camera access on this device");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      console.log("✅ Camera permissions granted");
      console.log("📹 Video tracks:", stream.getVideoTracks().length);
      // Fermer le stream de test
      stream.getTracks().forEach((track) => {
        console.log("🔒 Stopping track:", track.label);
        track.stop();
      });
    } catch (err) {
      console.error("❌ Camera access denied:", err);
      throw new Error(
        "Camera access denied. Please allow camera permissions and ensure HTTPS."
      );
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
          // Adapter la taille selon la largeur de l'écran - forcer une taille plus grande
          qrbox: function (_viewfinderWidth, _viewfinderHeight) {
            // Utiliser des tailles plus agressives pour forcer l'affichage
            if (window.innerWidth <= 340) {
              return { width: 270, height: 270 }; // Presque toute la taille
            } else if (window.innerWidth <= 400) {
              return { width: 290, height: 290 };
            } else {
              return { width: 340, height: 340 }; // Presque toute la taille du conteneur
            }
          },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          // Forcer une résolution plus élevée pour la caméra
          videoConstraints: {
            facingMode: "environment",
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
          },
          supportedScanTypes: [],
          // Désactiver le redimensionnement automatique
          disableFlip: false,
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

      // Fonction pour forcer la taille de manière agressive
      const forceScannerSize = () => {
        const readerElement = document.getElementById(readerId);
        if (!readerElement) return false;

        const video = readerElement.querySelector("video");
        const canvas = readerElement.querySelector("canvas");
        const allDivs = readerElement.querySelectorAll("div");

        const size =
          window.innerWidth <= 340
            ? "280px"
            : window.innerWidth <= 400
            ? "300px"
            : "350px";

        let foundElements = false;

        // Forcer la taille de tous les éléments trouvés
        [video, canvas, ...allDivs].forEach((element) => {
          if (element && element instanceof HTMLElement) {
            element.style.setProperty("width", size, "important");
            element.style.setProperty("height", size, "important");
            element.style.setProperty("max-width", size, "important");
            element.style.setProperty("max-height", size, "important");
            element.style.setProperty("min-width", size, "important");
            element.style.setProperty("min-height", size, "important");
            if (element.tagName === "VIDEO") {
              element.style.setProperty("object-fit", "cover", "important");
            }
            foundElements = true;
          }
        });

        // Forcer la taille du conteneur principal
        if (readerElement instanceof HTMLElement) {
          readerElement.style.setProperty("width", size, "important");
          readerElement.style.setProperty("height", size, "important");
        }

        return foundElements;
      };

      // Polling agressif pour s'assurer que la taille est appliquée
      let attempts = 0;
      const maxAttempts = 50; // 5 secondes max

      const pollForElements = () => {
        attempts++;
        const success = forceScannerSize();

        if (!success && attempts < maxAttempts) {
          setTimeout(pollForElements, 100);
        } else if (success) {
          console.log("✅ Scanner size forced successfully");
          // Continuer à surveiller les changements
          setTimeout(forceScannerSize, 500);
          setTimeout(forceScannerSize, 1000);
          setTimeout(forceScannerSize, 2000);
        }
      };

      // Démarrer le polling
      setTimeout(pollForElements, 50);

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
