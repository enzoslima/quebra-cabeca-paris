import { useState, useRef, useCallback, useEffect } from 'react';

export interface PuzzleState {
  grid: number;
  tiles: number[];
  empty: number;
  moves: number;
  elapsed: number;
  started: boolean;
  solved: boolean;
  peeking: boolean;
  correctCount: number;
}

function getNeighbors(idx: number, grid: number): number[] {
  const r = Math.floor(idx / grid);
  const col = idx % grid;
  const nb: number[] = [];
  if (r > 0) nb.push(idx - grid);
  if (r < grid - 1) nb.push(idx + grid);
  if (col > 0) nb.push(idx - 1);
  if (col < grid - 1) nb.push(idx + 1);
  return nb;
}

function countCorrect(tiles: number[]): number {
  return tiles.filter((v, i) => v === i).length;
}

export function usePuzzleGame(initialGrid: number = 3) {
  const [state, setState] = useState<PuzzleState>(() => {
    const total = initialGrid * initialGrid;
    const tiles = Array.from({ length: total }, (_, i) => i);
    return {
      grid: initialGrid,
      tiles,
      empty: total - 1,
      moves: 0,
      elapsed: 0,
      started: false,
      solved: false,
      peeking: false,
      correctCount: total,
    };
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const peekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.solved || !prev.started) return prev;
        return { ...prev, elapsed: prev.elapsed + 1 };
      });
    }, 1000);
  }, [stopTimer]);

  const setGrid = useCallback(
    (n: number) => {
      stopTimer();
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      const total = n * n;
      const tiles = Array.from({ length: total }, (_, i) => i);
      setState({
        grid: n,
        tiles,
        empty: total - 1,
        moves: 0,
        elapsed: 0,
        started: false,
        solved: false,
        peeking: false,
        correctCount: total,
      });
    },
    [stopTimer]
  );

  const startGame = useCallback(() => {
    setState((prev) => {
      const total = prev.grid * prev.grid;
      const tiles = Array.from({ length: total }, (_, i) => i);
      let empty = total - 1;

      for (let i = 0; i < 1200; i++) {
        const nb = getNeighbors(empty, prev.grid);
        const pick = nb[Math.floor(Math.random() * nb.length)];
        [tiles[empty], tiles[pick]] = [tiles[pick], tiles[empty]];
        empty = pick;
      }

      return {
        ...prev,
        tiles,
        empty,
        moves: 0,
        elapsed: 0,
        started: true,
        solved: false,
        peeking: false,
        correctCount: countCorrect(tiles),
      };
    });
    startTimer();
  }, [startTimer]);

  const clickTile = useCallback(
    (pos: number) => {
      setState((prev) => {
        if (prev.solved || !prev.started || prev.peeking) return prev;
        if (!getNeighbors(prev.empty, prev.grid).includes(pos)) return prev;

        const newTiles = [...prev.tiles];
        [newTiles[prev.empty], newTiles[pos]] = [newTiles[pos], newTiles[prev.empty]];
        const newMoves = prev.moves + 1;
        const isSolved = newTiles.every((v, i) => v === i);

        if (isSolved) {
          stopTimer();
        }

        return {
          ...prev,
          tiles: newTiles,
          empty: pos,
          moves: newMoves,
          solved: isSolved,
          correctCount: countCorrect(newTiles),
        };
      });
    },
    [stopTimer]
  );

  const solveHint = useCallback(() => {
    setState((prev) => {
      if (prev.solved || !prev.started || prev.peeking) return prev;
      const nb = getNeighbors(prev.empty, prev.grid);
      let best: number | null = null;
      let bestD = 9999;

      nb.forEach((pos) => {
        const val = prev.tiles[pos];
        if (val === prev.grid * prev.grid - 1) return;
        const d =
          Math.abs(Math.floor(pos / prev.grid) - Math.floor(val / prev.grid)) +
          Math.abs((pos % prev.grid) - (val % prev.grid));
        if (d < bestD) {
          bestD = d;
          best = pos;
        }
      });

      if (best === null) return prev;

      const newTiles = [...prev.tiles];
      [newTiles[prev.empty], newTiles[best]] = [newTiles[best], newTiles[prev.empty]];
      const newMoves = prev.moves + 1;
      const isSolved = newTiles.every((v, i) => v === i);
      if (isSolved) stopTimer();

      return {
        ...prev,
        tiles: newTiles,
        empty: best,
        moves: newMoves,
        solved: isSolved,
        correctCount: countCorrect(newTiles),
      };
    });
  }, [stopTimer]);

  const peekImage = useCallback(() => {
    setState((prev) => {
      if (!prev.started || prev.solved || prev.peeking) return prev;
      return { ...prev, peeking: true };
    });
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    peekTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, peeking: false }));
    }, 1500);
  }, []);

  // Keyboard handling via direct state manipulation
  const handleKeyMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      setState((prev) => {
        if (prev.solved || !prev.started || prev.peeking) return prev;

        const g = prev.grid;
        const er = Math.floor(prev.empty / g);
        const ec = prev.empty % g;
        let target: number | null = null;

        // Moving the empty space = swapping with tile in the opposite direction
        if (direction === 'up' && er < g - 1) target = prev.empty + g;
        if (direction === 'down' && er > 0) target = prev.empty - g;
        if (direction === 'left' && ec < g - 1) target = prev.empty + 1;
        if (direction === 'right' && ec > 0) target = prev.empty - 1;

        if (target === null) return prev;

        const newTiles = [...prev.tiles];
        [newTiles[prev.empty], newTiles[target]] = [newTiles[target], newTiles[prev.empty]];
        const newMoves = prev.moves + 1;
        const isSolved = newTiles.every((v, i) => v === i);
        if (isSolved) stopTimer();

        return {
          ...prev,
          tiles: newTiles,
          empty: target,
          moves: newMoves,
          solved: isSolved,
          correctCount: countCorrect(newTiles),
        };
      });
    },
    [stopTimer]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        handleKeyMove('up');
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        handleKeyMove('down');
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        handleKeyMove('left');
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        handleKeyMove('right');
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKeyMove]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    };
  }, [stopTimer]);

  return {
    state,
    setGrid,
    startGame,
    clickTile,
    solveHint,
    peekImage,
  };
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
