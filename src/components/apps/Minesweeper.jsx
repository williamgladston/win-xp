import React, { useState, useCallback, useEffect } from 'react';

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

function createBoard(rows, cols, mines, firstClick = null) {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false, revealed: false, flagged: false, count: 0,
    }))
  );

  // Place mines
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine && !(firstClick && firstClick.r === r && firstClick.c === c)) {
      board[r][c].mine = true;
      placed++;
    }
  }

  // Count neighbors
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) count++;
        }
      }
      board[r][c].count = count;
    }
  }
  return board;
}

function revealCell(board, r, c) {
  const rows = board.length, cols = board[0].length;
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (board[r][c].revealed || board[r][c].flagged) return;
  board[r][c].revealed = true;
  if (board[r][c].count === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(board, r + dr, c + dc);
      }
    }
  }
}

const NUMBER_COLORS = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState('beginner');
  const [board, setBoard] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  const config = DIFFICULTIES[difficulty];

  const newGame = useCallback(() => {
    setBoard(createBoard(config.rows, config.cols, config.mines));
    setGameState('playing');
    setTime(0);
    setTimerActive(false);
    setFirstClick(true);
  }, [config]);

  useEffect(() => { newGame(); }, [difficulty]);

  useEffect(() => {
    if (!timerActive || gameState !== 'playing') return;
    const interval = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameState]);

  const checkWin = (b) => {
    const rows = b.length, cols = b[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!b[r][c].mine && !b[r][c].revealed) return false;
      }
    }
    return true;
  };

  const handleClick = (r, c) => {
    if (gameState !== 'playing' || !board) return;
    if (board[r][c].flagged || board[r][c].revealed) return;

    let newBoard;
    if (firstClick) {
      newBoard = createBoard(config.rows, config.cols, config.mines, { r, c });
      setFirstClick(false);
      setTimerActive(true);
    } else {
      newBoard = board.map(row => row.map(cell => ({ ...cell })));
    }

    if (newBoard[r][c].mine) {
      // Reveal all mines
      newBoard.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
      setBoard(newBoard);
      setGameState('lost');
      return;
    }

    revealCell(newBoard, r, c);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setGameState('won');
    }
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameState !== 'playing' || !board) return;
    if (board[r][c].revealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
  };

  const flagCount = board ? board.flat().filter(c => c.flagged).length : 0;
  const minesRemaining = config.mines - flagCount;

  const smiley = gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂';

  const formatNum = (n) => String(Math.max(0, n)).padStart(3, '0');

  return (
    <div className="flex flex-col h-full bg-[#C0C0C0]">
      {/* Menu */}
      <div className="xp-menubar">
        <div className="xp-menubar-item group relative">
          Game
          <div className="hidden group-hover:block absolute top-full left-0 xp-context-menu z-50 min-w-[150px]">
            <div className="xp-context-menu-item" onClick={newGame}>New Game</div>
            <div className="xp-context-menu-separator" />
            <div className="xp-context-menu-item" onClick={() => setDifficulty('beginner')}>
              {difficulty === 'beginner' ? '● ' : '  '}Beginner
            </div>
            <div className="xp-context-menu-item" onClick={() => setDifficulty('intermediate')}>
              {difficulty === 'intermediate' ? '● ' : '  '}Intermediate
            </div>
            <div className="xp-context-menu-item" onClick={() => setDifficulty('expert')}>
              {difficulty === 'expert' ? '● ' : '  '}Expert
            </div>
          </div>
        </div>
        <span className="xp-menubar-item">Help</span>
      </div>

      {/* Game area */}
      <div className="p-2 flex flex-col items-center">
        {/* Status bar */}
        <div className="flex items-center gap-4 mb-2 bg-[#C0C0C0] border-2 border-gray-500 p-1 w-full justify-between"
          style={{ borderStyle: 'inset' }}>
          <div className="bg-black text-red-500 font-bold px-1 text-lg tracking-wider" style={{ fontFamily: 'Courier New' }}>
            {formatNum(minesRemaining)}
          </div>
          <button
            className="text-xl cursor-pointer bg-[#C0C0C0] border-2 w-8 h-8 flex items-center justify-center"
            style={{ borderStyle: 'outset' }}
            onClick={newGame}
          >
            {smiley}
          </button>
          <div className="bg-black text-red-500 font-bold px-1 text-lg tracking-wider" style={{ fontFamily: 'Courier New' }}>
            {formatNum(time)}
          </div>
        </div>

        {/* Grid */}
        {board && (
          <div
            className="border-2 inline-block"
            style={{ borderStyle: 'inset', borderColor: '#808080' }}
          >
            {board.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => (
                  <button
                    key={c}
                    className="w-5 h-5 flex items-center justify-center text-xs font-bold border-0 p-0"
                    style={{
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      background: cell.revealed
                        ? (cell.mine ? '#FF0000' : '#C0C0C0')
                        : '#C0C0C0',
                      border: cell.revealed
                        ? '1px solid #808080'
                        : '2px outset #FFFFFF',
                      color: NUMBER_COLORS[cell.count] || '#000',
                    }}
                    onClick={() => handleClick(r, c)}
                    onContextMenu={(e) => handleRightClick(e, r, c)}
                  >
                    {cell.revealed
                      ? (cell.mine ? '💣' : (cell.count > 0 ? cell.count : ''))
                      : (cell.flagged ? '🚩' : '')}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
