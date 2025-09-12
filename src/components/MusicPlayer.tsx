import { useState, useEffect, useRef, useCallback } from "react";
import { extractYouTubeId } from "../utils/youtube";

// Types pour l'API YouTube
declare global {
  interface Window {
    YT: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  readonly url: string;
}

export const MusicPlayer = ({ url }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30); // Durée fixe de 30 secondes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const youtubeId = extractYouTubeId(url);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        // Arrêter après 30 secondes
        if (time >= duration) {
          playerRef.current.pauseVideo();
        }
      }
    }, 100);
  }, [duration]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!youtubeId) return;

    // Charger l'API YouTube Player
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }

    // Initialiser le player
    const initPlayer = () => {
      playerRef.current = new window.YT.Player("youtube-player-hidden", {
        height: "1",
        width: "1",
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onReady: () => {
            setIsLoaded(true);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startTimer();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopTimer();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      stopTimer();
    };
  }, [youtubeId, startTimer, stopTimer]);

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const seekBackward = () => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, currentTime - 5); // Reculer de 5 secondes
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const seekForward = () => {
    if (!playerRef.current) return;
    const newTime = Math.min(duration, currentTime + 5); // Avancer de 5 secondes
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!youtubeId) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">🎵</div>
        <p className="text-gray-600 text-sm">Lecteur non disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Player YouTube caché mais fonctionnel */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div id="youtube-player-hidden"></div>
      </div>

      {/* Interface du lecteur simplifiée */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 text-center text-white">
        {/* Icône et status */}
        <div className="text-5xl mb-4">
          {!isLoaded ? "⏳" : isPlaying ? "🎵" : "⏸️"}
        </div>

        <h3 className="text-lg font-medium mb-4">
          {!isLoaded
            ? "Chargement..."
            : isPlaying
            ? "En cours de lecture"
            : "En pause"}
        </h3>

        {/* Barre de progression */}
        {isLoaded && (
          <div className="mb-6">
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-blue-200">
              <span>{formatTime(currentTime)}</span>
              <span>30 sec max</span>
            </div>
          </div>
        )}

        {/* Contrôles */}
        {isLoaded && (
          <div className="flex justify-center items-center gap-4">
            {/* Reculer */}
            <button
              onClick={seekBackward}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              title="Reculer de 5 secondes"
            >
              <span className="text-xl">⏪</span>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <span className="text-2xl">{isPlaying ? "⏸️" : "▶️"}</span>
            </button>

            {/* Avancer */}
            <button
              onClick={seekForward}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              title="Avancer de 5 secondes"
            >
              <span className="text-xl">⏩</span>
            </button>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-blue-200 opacity-75 mt-4">
          {isLoaded
            ? `🎵 Lecteur limité à ${duration} secondes`
            : "💡 Chargement du lecteur..."}
        </div>
      </div>
    </div>
  );
};
