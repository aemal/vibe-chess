'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FENModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadFEN: (fen: string) => void;
  currentFEN?: string;
}

export const FENModal: React.FC<FENModalProps> = ({ isOpen, onClose, onLoadFEN, currentFEN }) => {
  const [fenInput, setFenInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFenInput(currentFEN || '');
      setError(null);
      // Focus the input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentFEN]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmedFen = fenInput.trim();
    if (!trimmedFen) {
      setError('Please enter a FEN string');
      return;
    }

    // Basic validation - check if it has at least the piece placement
    const parts = trimmedFen.split(' ');
    const piecePlacement = parts[0];
    const rows = piecePlacement.split('/');
    
    if (rows.length !== 8) {
      setError('Invalid FEN: Must have exactly 8 rows separated by /');
      return;
    }

    // Validate each row has correct number of squares
    for (const row of rows) {
      let count = 0;
      for (const char of row) {
        if (char >= '1' && char <= '8') {
          count += parseInt(char);
        } else if ('pnbrqkPNBRQK'.includes(char)) {
          count++;
        } else {
          setError(`Invalid FEN: Unknown character '${char}'`);
          return;
        }
      }
      if (count !== 8) {
        setError('Invalid FEN: Each row must have exactly 8 squares');
        return;
      }
    }

    setError(null);
    onLoadFEN(trimmedFen);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const exampleFENs = [
    { name: 'Starting Position', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
    { name: 'Sicilian Defense', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2' },
    { name: 'Endgame Puzzle', fen: '8/p3q1kp/1p2Pnp1/3pQ3/2pP4/1nP3N1/1B4PP/6K1 w - - 0 1' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Load Position</h2>
              <p className="text-sm text-slate-400">Import a position using FEN notation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* FEN Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              FEN String
            </label>
            <textarea
              ref={inputRef}
              value={fenInput}
              onChange={(e) => {
                setFenInput(e.target.value);
                setError(null);
              }}
              placeholder="e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              className="w-full h-24 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 font-mono text-sm resize-none transition-all"
              spellCheck={false}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Example FENs */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quick Load Examples
            </label>
            <div className="flex flex-wrap gap-2">
              {exampleFENs.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFenInput(example.fen);
                    setError(null);
                  }}
                  className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          {/* FEN Format Help */}
          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              FEN Format
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-amber-400">K/Q/R/B/N/P</span> = White pieces • 
              <span className="text-amber-400"> k/q/r/b/n/p</span> = Black pieces • 
              <span className="text-amber-400"> 1-8</span> = Empty squares • 
              <span className="text-amber-400"> /</span> = Row separator
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3 bg-slate-800/30">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Load Position
          </button>
        </div>
      </div>
    </div>
  );
};

