'use client';

import React, { useState } from 'react';
import { PieceColor, Piece } from '@/types/chess';
import { ChessPiece } from './pieces';

interface GameInfoProps {
  currentTurn: PieceColor;
  capturedByWhite: Piece[];
  capturedByBlack: Piece[];
  currentFEN: string;
  isAIThinking?: boolean;
  onNewGame: () => void;
  onLoadPosition: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  currentTurn,
  capturedByWhite,
  capturedByBlack,
  currentFEN,
  isAIThinking = false,
  onNewGame,
  onLoadPosition,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(currentFEN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy FEN:', err);
    }
  };
  const pieceValues: Record<string, number> = {
    queen: 9,
    rook: 5,
    bishop: 3,
    knight: 3,
    pawn: 1,
    king: 0,
  };

  const calculateScore = (pieces: Piece[]) => {
    return pieces.reduce((sum, piece) => sum + pieceValues[piece.type], 0);
  };

  const whiteScore = calculateScore(capturedByWhite);
  const blackScore = calculateScore(capturedByBlack);
  const scoreDiff = whiteScore - blackScore;

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 w-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-3">
        <h2 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Game Info
        </h2>
      </div>

      {/* Current turn indicator */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Current Turn</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            currentTurn === 'white' 
              ? 'bg-white text-slate-900' 
              : 'bg-slate-700 text-white'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              currentTurn === 'white' ? 'bg-amber-400' : 'bg-slate-400'
            }`} />
            <span className="font-semibold text-sm capitalize">{currentTurn}</span>
          </div>
        </div>
        
        {/* AI Thinking Indicator */}
        {isAIThinking && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-indigo-300 text-sm font-medium">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Captured pieces - White's captures */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">White captured</span>
          <span className="text-amber-400 font-semibold">+{whiteScore}</span>
        </div>
        <div className="flex flex-wrap gap-1 min-h-[28px]">
          {capturedByWhite.length === 0 ? (
            <span className="text-slate-500 text-xs">No captures yet</span>
          ) : (
            capturedByWhite.map((piece, index) => (
              <div key={index} className="opacity-70">
                <ChessPiece type={piece.type} color="black" size={24} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Captured pieces - Black's captures */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Black captured</span>
          <span className="text-amber-400 font-semibold">+{blackScore}</span>
        </div>
        <div className="flex flex-wrap gap-1 min-h-[28px]">
          {capturedByBlack.length === 0 ? (
            <span className="text-slate-500 text-xs">No captures yet</span>
          ) : (
            capturedByBlack.map((piece, index) => (
              <div key={index} className="opacity-70">
                <ChessPiece type={piece.type} color="white" size={24} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Material advantage */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Material Advantage</span>
          <span className={`font-bold ${
            scoreDiff > 0 ? 'text-green-400' : scoreDiff < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            {scoreDiff === 0 ? 'Even' : scoreDiff > 0 ? `White +${scoreDiff}` : `Black +${Math.abs(scoreDiff)}`}
          </span>
        </div>
      </div>

      {/* Current FEN */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Current FEN</span>
          <button
            onClick={handleCopyFEN}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700/30">
          <code className="text-xs text-amber-400/90 font-mono break-all leading-relaxed">
            {currentFEN}
          </code>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 space-y-2">
        <button
          onClick={onNewGame}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Game
        </button>
        <button
          onClick={onLoadPosition}
          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-slate-500/25 flex items-center justify-center gap-2 border border-slate-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Load Position (FEN)
        </button>
      </div>
    </div>
  );
};

