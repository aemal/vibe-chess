'use client';

import React, { useEffect, useRef } from 'react';
import { Move } from '@/types/chess';
import { ChessPiece } from './pieces';

interface MoveHistoryProps {
  moves: Move[];
  onClear: () => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  // Group moves into pairs (white move, black move)
  const movePairs: { number: number; white?: Move; black?: Move }[] = [];
  moves.forEach((move, index) => {
    const pairIndex = Math.floor(index / 2);
    if (!movePairs[pairIndex]) {
      movePairs[pairIndex] = { number: pairIndex + 1 };
    }
    if (index % 2 === 0) {
      movePairs[pairIndex].white = move;
    } else {
      movePairs[pairIndex].black = move;
    }
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 w-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Move History
        </h2>
        {moves.length > 0 && (
          <button
            onClick={onClear}
            className="text-amber-200 hover:text-white text-sm px-2 py-1 rounded hover:bg-amber-800 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="bg-slate-700/50 px-4 py-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">
          Total moves: <span className="text-amber-400 font-semibold">{moves.length}</span>
        </span>
        <span className="text-slate-300">
          Turn: <span className={`font-semibold ${moves.length % 2 === 0 ? 'text-white' : 'text-slate-400'}`}>
            {moves.length % 2 === 0 ? 'White' : 'Black'}
          </span>
        </span>
      </div>

      {/* Move list */}
      <div 
        ref={scrollRef}
        className="max-h-[500px] overflow-y-auto custom-scrollbar"
      >
        {movePairs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p>No moves yet</p>
            <p className="text-sm mt-1">Start playing to see history</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {movePairs.map((pair) => (
              <div
                key={pair.number}
                className="flex items-stretch hover:bg-slate-700/30 transition-colors"
              >
                {/* Move number */}
                <div className="w-10 flex items-center justify-center bg-slate-800/50 text-slate-400 font-mono text-sm border-r border-slate-700/50">
                  {pair.number}.
                </div>

                {/* White move */}
                <div className="flex-1 px-3 py-2 border-r border-slate-700/50">
                  {pair.white && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex-shrink-0">
                        <ChessPiece type={pair.white.piece.type} color="white" size={20} />
                      </div>
                      <span className="text-white font-medium font-mono">
                        {pair.white.notation}
                      </span>
                      {pair.white.captured && (
                        <span className="text-red-400 text-xs">
                          ×
                          <span className="ml-0.5">
                            {pair.white.captured.type.charAt(0).toUpperCase()}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Black move */}
                <div className="flex-1 px-3 py-2">
                  {pair.black && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex-shrink-0">
                        <ChessPiece type={pair.black.piece.type} color="black" size={20} />
                      </div>
                      <span className="text-slate-300 font-medium font-mono">
                        {pair.black.notation}
                      </span>
                      {pair.black.captured && (
                        <span className="text-red-400 text-xs">
                          ×
                          <span className="ml-0.5">
                            {pair.black.captured.type.charAt(0).toUpperCase()}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with last move time */}
      {moves.length > 0 && (
        <div className="bg-slate-800/80 px-4 py-2 text-xs text-slate-400 border-t border-slate-700">
          Last move: {formatTime(moves[moves.length - 1].timestamp)}
        </div>
      )}
    </div>
  );
};

