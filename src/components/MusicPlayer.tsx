import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Cyberpunk Pulse",
    artist: "Digital Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-emerald-500 to-teal-600"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100 || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg shadow-current/20 animate-pulse`}>
          <Music className="w-12 h-12 text-white" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold text-white truncate">{currentTrack.title}</h3>
          <p className="text-white/60 font-medium">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentTrack.color} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={prevTrack}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-4 text-white/40">
          <Volume2 className="w-4 h-4" />
          <div className="h-1 flex-1 bg-white/5 rounded-full">
            <div className="h-full w-2/3 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
