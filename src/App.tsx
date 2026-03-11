import { useRef, useEffect, useCallback, useMemo } from 'react';
import { buildParis } from './utils/drawParis';
import { usePuzzleGame, formatTime } from './hooks/usePuzzleGame';

function getCellSize(grid: number): number {
  return grid === 3 ? 160 : grid === 4 ? 125 : 100;
}

export default function App() {
  const { state, setGrid, startGame, clickTile, solveHint, peekImage } = usePuzzleGame(3);
  const { grid, tiles, moves, elapsed, started, solved, peeking, correctCount } = state;

  const CELL = getCellSize(grid);
  const SIZE = grid * CELL;

  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement | null>(null);

  // Build Paris scene whenever SIZE changes
  const scene = useMemo(() => buildParis(SIZE, SIZE), [SIZE]);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  // Draw preview
  useEffect(() => {
    const pvCanvas = previewCanvasRef.current;
    if (!pvCanvas || !scene) return;
    const pvSize = Math.round(SIZE * 0.4);
    pvCanvas.width = pvSize;
    pvCanvas.height = pvSize;
    const ctx = pvCanvas.getContext('2d')!;
    ctx.drawImage(scene, 0, 0, pvSize, pvSize);
  }, [scene, SIZE]);

  // Draw puzzle
  const drawPuzzle = useCallback(() => {
    const canvas = puzzleCanvasRef.current;
    if (!canvas || !sceneRef.current) return;
    const ctx = canvas.getContext('2d')!;
    const sc = sceneRef.current;

    canvas.width = SIZE;
    canvas.height = SIZE;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // If peeking, show full image
    if (peeking) {
      ctx.drawImage(sc, 0, 0, SIZE, SIZE);
      ctx.fillStyle = 'rgba(255,220,120,0.15)';
      ctx.fillRect(0, 0, SIZE, SIZE);
      return;
    }

    // If solved, show full image
    if (solved) {
      ctx.drawImage(sc, 0, 0, SIZE, SIZE);
      return;
    }

    tiles.forEach((val, pos) => {
      const row = Math.floor(pos / grid);
      const col = pos % grid;
      const dx = col * CELL;
      const dy = row * CELL;

      if (val === grid * grid - 1) {
        // Empty space
        ctx.fillStyle = '#0a0814';
        ctx.fillRect(dx, dy, CELL, CELL);
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = 'rgba(200,168,75,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(dx + 4, dy + 4, CELL - 8, CELL - 8);
        ctx.setLineDash([]);
        return;
      }

      const sr = Math.floor(val / grid);
      const sc2 = val % grid;
      ctx.drawImage(sc, sc2 * CELL, sr * CELL, CELL, CELL, dx, dy, CELL, CELL);

      const ok = val === pos;
      ctx.strokeStyle = ok ? 'rgba(100,220,80,0.7)' : 'rgba(0,0,0,0.6)';
      ctx.lineWidth = ok ? 3 : 2;
      ctx.strokeRect(dx + 1, dy + 1, CELL - 2, CELL - 2);

      if (ok) {
        ctx.fillStyle = 'rgba(80,200,60,0.10)';
        ctx.fillRect(dx, dy, CELL, CELL);
      }

      // Tile number
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.font = `bold ${CELL * 0.13}px "Courier New"`;
      ctx.fillText(String(val + 1), dx + 5, dy + CELL * 0.16);
    });
  }, [tiles, grid, CELL, SIZE, solved, peeking]);

  useEffect(() => {
    drawPuzzle();
  }, [drawPuzzle]);

  // Handle click on puzzle canvas
  const handlePuzzleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (solved || !started || peeking) return;
      const canvas = puzzleCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = SIZE / rect.width;
      const scaleY = SIZE / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const col = Math.floor(x / CELL);
      const row = Math.floor(y / CELL);
      if (col < 0 || col >= grid || row < 0 || row >= grid) return;

      const pos = row * grid + col;
      clickTile(pos);
    },
    [SIZE, CELL, grid, solved, started, peeking, clickTile]
  );

  // Handle touch on puzzle canvas
  const handlePuzzleTouch = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (solved || !started || peeking) return;
      e.preventDefault();
      const canvas = puzzleCanvasRef.current;
      if (!canvas) return;
      const touch = e.touches[0];

      const rect = canvas.getBoundingClientRect();
      const scaleX = SIZE / rect.width;
      const scaleY = SIZE / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const col = Math.floor(x / CELL);
      const row = Math.floor(y / CELL);
      if (col < 0 || col >= grid || row < 0 || row >= grid) return;

      const pos = row * grid + col;
      clickTile(pos);
    },
    [SIZE, CELL, grid, solved, started, peeking, clickTile]
  );

  const progressPct = (correctCount / (grid * grid)) * 100;

  const diffButtons: { n: number; label: string }[] = [
    { n: 3, label: '3×3' },
    { n: 4, label: '4×4' },
    { n: 5, label: '5×5' },
  ];

  // Determine message
  let message = '';
  if (solved) {
    message = `🎉 Parabéns! ${moves} movimentos em ${formatTime(elapsed)}!`;
  }

  // Calculate canvas display size for responsive layout
  const maxDisplaySize = Math.min(SIZE, 480);
  const previewDisplaySize = Math.round(maxDisplaySize * 0.4);

  return (
    <div className="min-h-screen bg-[#1a1228] flex flex-col items-center justify-center p-2.5 font-serif">
      {/* Title */}
      <h1
        className="text-[clamp(15px,3vw,26px)] text-center mb-2.5 tracking-[3px]"
        style={{
          color: '#FFD700',
          textShadow: '0 0 14px #FFD700, 0 2px 4px #000',
        }}
      >
        🗼 QUEBRA-CABEÇA DE PARIS 🎈
      </h1>

      {/* Main area */}
      <div className="flex gap-4.5 items-start justify-center flex-wrap px-2.5">
        {/* Left panel - puzzle */}
        <div
          className="flex flex-col items-center gap-2.5 p-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '2px solid #c8a84b',
            boxShadow: '0 0 20px rgba(200,168,75,0.2)',
          }}
        >
          <div
            className="text-xs tracking-[2px] text-center"
            style={{ color: '#c8a84b' }}
          >
            ✦ MONTE O QUEBRA-CABEÇA ✦
          </div>

          {/* Puzzle wrapper */}
          <div
            className="relative rounded-md overflow-hidden cursor-pointer"
            style={{
              border: '3px solid #c8a84b',
              boxShadow: '0 0 28px rgba(200,168,75,0.4)',
              width: maxDisplaySize,
              height: maxDisplaySize,
            }}
          >
            <canvas
              ref={puzzleCanvasRef}
              width={SIZE}
              height={SIZE}
              onClick={handlePuzzleClick}
              onTouchStart={handlePuzzleTouch}
              className="block"
              style={{ width: '100%', height: '100%' }}
            />

            {/* Overlay */}
            {!started && !solved && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-center pointer-events-none"
                style={{
                  background: 'rgba(10,8,24,0.78)',
                  color: '#FFD700',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                }}
              >
                <div>🗼 PARIS TE ESPERA!</div>
                <div
                  className="font-normal font-mono"
                  style={{ color: '#fff', fontSize: '13px' }}
                >
                  Clique em EMBARALHAR para começar
                </div>
              </div>
            )}

            {/* Win overlay */}
            {solved && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-center pointer-events-none"
                style={{
                  background: 'rgba(10,8,24,0.78)',
                  color: '#FFD700',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                }}
              >
                <div style={{ fontSize: '26px' }}>🗼 PARIS COMPLETA! 🎈</div>
                <div className="font-normal font-mono" style={{ color: '#fff', fontSize: '13px' }}>
                  {moves} movimentos · {formatTime(elapsed)}
                </div>
                <div className="font-normal font-mono" style={{ color: '#FFD700', fontSize: '13px', marginTop: '6px' }}>
                  Você montou o quebra-cabeça!
                </div>
              </div>
            )}

            {/* Peek overlay */}
            {peeking && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-center pointer-events-none"
                style={{
                  background: 'rgba(10,8,24,0.40)',
                  color: '#FFD700',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                }}
              >
                <div style={{ fontSize: '14px' }}>👁️ VISUALIZANDO IMAGEM ORIGINAL...</div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2.5 rounded overflow-hidden"
            style={{ background: '#333' }}
          >
            <div
              className="h-2.5 rounded transition-all duration-300"
              style={{
                background: 'linear-gradient(90deg, #c8a84b, #FFD700)',
                width: `${started ? progressPct : 0}%`,
              }}
            />
          </div>

          {/* Message */}
          <div
            className="text-center min-h-[20px] font-mono text-[clamp(12px,2vw,15px)]"
            style={{
              color: '#FFD700',
              textShadow: message ? '0 0 8px #FFD700' : 'none',
            }}
          >
            {message}
          </div>

          {/* HUD */}
          <div className="flex gap-3 flex-wrap justify-center">
            <HudBox label="MOVIMENTOS" value={String(moves)} />
            <HudBox label="PEÇAS OK" value={`${started ? correctCount : 0}/${grid * grid}`} />
            <HudBox label="TEMPO" value={formatTime(elapsed)} />
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap justify-center">
            <PrimaryButton onClick={startGame}>🔀 EMBARALHAR</PrimaryButton>
            <SecondaryButton onClick={peekImage}>👁️ VER IMAGEM</SecondaryButton>
            <SecondaryButton onClick={solveHint}>💡 DICA</SecondaryButton>
          </div>

          {/* Difficulty */}
          <div className="flex gap-1.5">
            {diffButtons.map(({ n, label }) => (
              <button
                key={n}
                onClick={() => setGrid(n)}
                className="px-3 py-1 text-[11px] font-bold font-mono rounded-md transition-all duration-150 cursor-pointer border"
                style={
                  grid === n
                    ? {
                        background: 'linear-gradient(135deg, #c8a84b, #FFD700)',
                        color: '#1a1228',
                        borderColor: '#FFD700',
                        letterSpacing: '1px',
                      }
                    : {
                        background: 'transparent',
                        color: '#888',
                        borderColor: '#444',
                        letterSpacing: '1px',
                      }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel - preview */}
        <div
          className="flex flex-col items-center gap-2.5 p-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '2px solid #c8a84b',
            boxShadow: '0 0 20px rgba(200,168,75,0.2)',
          }}
        >
          <div
            className="text-xs tracking-[2px] text-center"
            style={{ color: '#c8a84b' }}
          >
            🖼️ IMAGEM ORIGINAL
          </div>
          <canvas
            ref={previewCanvasRef}
            className="rounded"
            style={{
              border: '2px solid #666',
              width: previewDisplaySize,
              height: previewDisplaySize,
            }}
          />
          <div
            className="text-[10px] tracking-[2px] text-center mt-0.5"
            style={{ color: '#888' }}
          >
            USE COMO REFERÊNCIA
          </div>
        </div>
      </div>
    </div>
  );
}

function HudBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="text-center px-3.5 py-1.5 rounded-md"
      style={{
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid #c8a84b',
      }}
    >
      <div className="text-[10px] font-mono tracking-[1px]" style={{ color: '#888' }}>
        {label}
      </div>
      <div className="text-[22px] font-bold font-mono" style={{ color: '#FFD700' }}>
        {value}
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 text-xs font-bold font-mono rounded-md cursor-pointer transition-all duration-150 border-none hover:brightness-115 hover:scale-[1.04] active:scale-[0.97]"
      style={{
        background: 'linear-gradient(135deg, #c8a84b, #FFD700)',
        color: '#1a1228',
        letterSpacing: '1px',
        boxShadow: '0 2px 8px rgba(200,168,75,0.4)',
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 text-xs font-bold font-mono rounded-md cursor-pointer transition-all duration-150 hover:scale-[1.04] active:scale-[0.97]"
      style={{
        background: 'transparent',
        color: '#c8a84b',
        border: '2px solid #c8a84b',
        letterSpacing: '1px',
      }}
    >
      {children}
    </button>
  );
}
