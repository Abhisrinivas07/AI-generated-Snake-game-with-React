import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setFood(generateFood());
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
      <div 
        className="grid bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          aspectRatio: '1/1',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full transition-all duration-200 ${
                isSnakeHead 
                  ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10 rounded-sm' 
                  : isSnakeBody 
                  ? 'bg-cyan-600/80 rounded-sm' 
                  : isFood 
                  ? 'bg-fuchsia-500 shadow-[0_0_15px_#d946ef] animate-pulse rounded-full scale-75' 
                  : 'border-[0.5px] border-white/5'
              }`}
            />
          );
        })}
      </div>

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm z-20">
          <h2 className="text-4xl font-bold text-fuchsia-500 mb-4 animate-bounce">GAME OVER</h2>
          <p className="text-white text-xl mb-6">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {isPaused && !isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-2xl backdrop-blur-[2px] z-10">
          <button
            onClick={() => setIsPaused(false)}
            className="p-6 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all group"
          >
            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2 group-hover:scale-110 transition-transform" />
          </button>
          <p className="text-cyan-400 mt-4 font-mono tracking-widest animate-pulse">PRESS SPACE TO PLAY</p>
        </div>
      )}
    </div>
  );
};
