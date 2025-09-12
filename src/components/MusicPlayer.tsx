import { useState, useEffect, useRef } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const youtubeId = extractYouTubeId(url);

  useEffect(() => {
    if (!youtubeId) return;

    // Charger l'API YouTube Player
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }

    // Initialiser le player
    const initPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player-hidden', {
        height: '1',
        width: '1',
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: youtubeId
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onReady: (event: any) => {
            setIsLoaded(true);
            event.target.playVideo();
            setIsPlaying(true);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
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
    };
  }, [youtubeId]);

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
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
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="youtube-player-hidden"></div>
      </div>

      {/* Interface visuelle principale */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-8 text-center text-white relative overflow-hidden">
        {/* Animation de lecture */}
        <div className="text-6xl mb-6 relative z-10">
          {!isLoaded ? "⏳" : isPlaying ? "🎵" : "⏸️"}
        </div>
        
        {/* Status */}
        <div className="mb-6 relative z-10">
          <h2 className="text-xl font-medium mb-2">
            {!isLoaded ? "Chargement..." : isPlaying ? "🎵 En cours de lecture" : "⏸️ En pause"}
          </h2>
          <p className="text-blue-200 text-sm">
            Lecteur audio intégré • Contrôlable depuis l'app
          </p>
        </div>

        {/* Visualiseur audio animé */}
        {isLoaded && (
          <div className="flex justify-center items-end gap-1 mb-6 h-12 relative z-10">
            {Array.from({length: 12}).map((_, i) => (
              <div
                key={i}
                className={`bg-white rounded-full w-2 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse bg-opacity-70' : 'bg-opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${20 + Math.sin(Date.now() * 0.005 + i) * 15}px` : '8px',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: isPlaying ? '0.8s' : '0s'
                }}
              />
            ))}
          </div>
        )}

        {/* Contrôles de lecture */}
        {isLoaded && (
          <div className="flex justify-center gap-4 relative z-10">
            <button
              onClick={togglePlayPause}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <span className="text-3xl">
                {isPlaying ? "⏸️" : "▶️"}
              </span>
            </button>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-blue-200 opacity-75 relative z-10 mt-4">
          {isLoaded ? "🎵 Lecteur prêt" : "💡 Chargement du lecteur YouTube..."}
        </div>
      </div>

      {/* Lecteur de secours visible */}
      <details className="bg-gray-50 rounded-lg overflow-hidden">
        <summary className="p-4 cursor-pointer text-sm text-gray-600 hover:bg-gray-100">
          🎬 Afficher le lecteur YouTube (secours)
        </summary>
        <div className="p-4 pt-0">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?controls=1&rel=0`}
              title="YouTube Player"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      </details>
    </div>
  );
};