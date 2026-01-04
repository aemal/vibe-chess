'use client';

import React, { useState } from 'react';
import { PieceColor } from '@/types/chess';

interface MoveExecutorProps {
  currentTurn: PieceColor;
  onExecuteMove: (pgn: string, color: PieceColor) => boolean;
}

export const MoveExecutor: React.FC<MoveExecutorProps> = ({ currentTurn, onExecuteMove }) => {
  const [selectedColor, setSelectedColor] = useState<PieceColor>(currentTurn);
  const [pgnInput, setPgnInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update selected color when current turn changes
  React.useEffect(() => {
    setSelectedColor(currentTurn);
  }, [currentTurn]);

  const handleExecute = () => {
    if (!pgnInput.trim()) {
      setError('Please enter a move');
      setSuccess(null);
      return;
    }

    const result = onExecuteMove(pgnInput.trim(), selectedColor);
    
    if (result) {
      setSuccess(`Move executed: ${pgnInput.trim()}`);
      setError(null);
      setPgnInput('');
    } else {
      setError(`Invalid move: ${pgnInput.trim()}`);
      setSuccess(null);
    }

    // Clear messages after 3 seconds
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecute();
    }
  };

  const exampleMoves = [
    { notation: 'e4', desc: 'Pawn to e4' },
    { notation: 'Nf3', desc: 'Knight to f3' },
    { notation: 'Bb5', desc: 'Bishop to b5' },
    { notation: 'O-O', desc: 'Kingside castle' },
    { notation: 'Qxd5', desc: 'Queen captures d5' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 w-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3">
        <h2 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Move Executor
        </h2>
        <p className="text-indigo-200 text-xs mt-0.5">Test moves using PGN notation</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Playing as
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedColor('white')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                selectedColor === 'white'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedColor === 'white' ? 'bg-amber-400 border-amber-500' : 'bg-white border-slate-400'
              }`} />
              White
            </button>
            <button
              onClick={() => setSelectedColor('black')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                selectedColor === 'black'
                  ? 'bg-slate-600 text-white shadow-lg ring-2 ring-slate-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedColor === 'black' ? 'bg-slate-800 border-slate-400' : 'bg-slate-800 border-slate-600'
              }`} />
              Black
            </button>
          </div>
        </div>

        {/* PGN Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            PGN Move
          </label>
          <input
            type="text"
            value={pgnInput}
            onChange={(e) => {
              setPgnInput(e.target.value);
              setError(null);
              setSuccess(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="e.g., e4, Nf3, O-O"
            className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 font-mono text-sm transition-all"
            spellCheck={false}
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Execute Move
        </button>

        {/* Examples */}
        <div className="border-t border-slate-700/50 pt-4">
          <p className="text-xs text-slate-400 mb-2">Quick examples:</p>
          <div className="flex flex-wrap gap-1.5">
            {exampleMoves.map((move, index) => (
              <button
                key={index}
                onClick={() => setPgnInput(move.notation)}
                className="px-2 py-1 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 rounded text-xs text-slate-300 hover:text-white transition-all font-mono"
                title={move.desc}
              >
                {move.notation}
              </button>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            PGN Notation
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-indigo-400">K</span>=King 
            <span className="text-indigo-400 ml-1">Q</span>=Queen 
            <span className="text-indigo-400 ml-1">R</span>=Rook 
            <span className="text-indigo-400 ml-1">B</span>=Bishop 
            <span className="text-indigo-400 ml-1">N</span>=Knight
            <br />
            <span className="text-indigo-400">x</span>=capture 
            <span className="text-indigo-400 ml-1">O-O</span>=castle kingside
          </p>
        </div>
      </div>
    </div>
  );
};

