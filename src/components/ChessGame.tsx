'use client';

import React, { useState } from 'react';
import { ChessBoard } from './ChessBoard';
import { MoveHistory } from './MoveHistory';
import { GameInfo } from './GameInfo';
import { FENModal } from './FENModal';
import { MoveExecutor } from './MoveExecutor';
import { useChessGame } from '@/hooks/useChessGame';

export const ChessGame: React.FC = () => {
  const {
    board,
    currentTurn,
    moves,
    capturedByWhite,
    capturedByBlack,
    castlingRights,
    currentFEN,
    handleMove,
    resetGame,
    clearHistory,
    loadFromFEN,
    executePGNMove,
  } = useChessGame();

  const [isFENModalOpen, setIsFENModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-2">
            Chess Master
          </h1>
          <p className="text-slate-400 text-lg">
            Drag pieces or click to move • History saved automatically
          </p>
        </header>

        {/* Main game area */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
          {/* Left sidebar - Game Info & Move Executor */}
          <div className="w-full lg:w-auto order-2 lg:order-1 space-y-4">
            <GameInfo
              currentTurn={currentTurn}
              capturedByWhite={capturedByWhite}
              capturedByBlack={capturedByBlack}
              onNewGame={resetGame}
              onLoadPosition={() => setIsFENModalOpen(true)}
            />
            <MoveExecutor
              currentTurn={currentTurn}
              onExecuteMove={executePGNMove}
            />
          </div>

          {/* Chess Board */}
          <div className="order-1 lg:order-2">
            <ChessBoard
              board={board}
              currentTurn={currentTurn}
              castlingRights={castlingRights}
              onMove={handleMove}
            />
          </div>

          {/* Right sidebar - Move History */}
          <div className="w-full lg:w-auto order-3">
            <MoveHistory
              moves={moves}
              onClear={() => {
                if (confirm('Clear move history? This will not reset the game.')) {
                  clearHistory();
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Built with Next.js • SVG Graphics • LocalStorage Persistence</p>
        </footer>
      </div>

      {/* FEN Import Modal */}
      <FENModal
        isOpen={isFENModalOpen}
        onClose={() => setIsFENModalOpen(false)}
        onLoadFEN={loadFromFEN}
        currentFEN={currentFEN}
      />
    </div>
  );
};

