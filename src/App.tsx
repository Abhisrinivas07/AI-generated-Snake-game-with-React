import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Music, Gamepad2, Github } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <Gamepad2 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                Neon <span className="text-cyan-400">Snake</span>
              </h1>
              <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Arcade Edition v1.0</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-8"
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Current Score</p>
              <p className="text-3xl font-mono font-bold text-white tabular-nums">{score.toString().padStart(4, '0')}</p>
            </div>
            <div className="h-12 w-[1px] bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-500/60 mb-1">High Score</p>
              <p className="text-3xl font-mono font-bold text-fuchsia-500 tabular-nums">{highScore.toString().padStart(4, '0')}</p>
            </div>
          </motion.div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
          {/* Left Panel: Info/Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex flex-col gap-6"
          >
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'CYBER_PUNK', score: 2450 },
                  { name: 'NEON_RIDER', score: 1820 },
                  { name: 'BIT_MASTER', score: 1540 },
                ].map((entry, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white/60">{entry.name}</span>
                    <span className="font-mono text-cyan-400">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <h3 className="font-bold uppercase tracking-wider text-sm mb-4">Controls</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-white/40 block mb-1">MOVE</span>
                  <span className="text-xs font-mono">ARROWS</span>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-white/40 block mb-1">PAUSE</span>
                  <span className="text-xs font-mono">SPACE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center: Snake Game */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col items-center"
          >
            <SnakeGame onScoreChange={handleScoreChange} />
            <div className="mt-8 lg:hidden w-full">
              <MusicPlayer />
            </div>
          </motion.div>

          {/* Right Panel: Music Player */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-6 px-4">
              <Music className="w-5 h-5 text-fuchsia-500" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Now Playing</h3>
            </div>
            <MusicPlayer />
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs uppercase tracking-[0.3em]">
          <p>© 2026 NEON ARCADE SYSTEMS</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
              <Github className="w-3 h-3" /> Source
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
