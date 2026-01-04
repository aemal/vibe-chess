'use client';

import { useState, useEffect, useCallback } from 'react';
import { BoardState, Square, Piece, PieceColor, Move, CastlingRights } from '@/types/chess';
import { initializeBoard, makeMove as makeBoardMove, generateMoveNotation, initializeCastlingRights, updateCastlingRights, isCastlingMove, parseFEN, generateFEN } from '@/utils/chess';
import { saveMoves, loadMoves, clearMoves } from '@/utils/storage';

interface UseChessGameReturn {
  board: BoardState;
  currentTurn: PieceColor;
  moves: Move[];
  capturedByWhite: Piece[];
  capturedByBlack: Piece[];
  castlingRights: CastlingRights;
  currentFEN: string;
  handleMove: (from: Square, to: Square, captured: Piece | null) => void;
  resetGame: () => void;
  clearHistory: () => void;
  loadFromFEN: (fen: string) => boolean;
}

export function useChessGame(): UseChessGameReturn {
  const [board, setBoard] = useState<BoardState>(() => initializeBoard());
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');
  const [moves, setMoves] = useState<Move[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<Piece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<Piece[]>([]);
  const [castlingRights, setCastlingRights] = useState<CastlingRights>(() => initializeCastlingRights());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load moves from localStorage on mount
  useEffect(() => {
    const storedMoves = loadMoves();
    if (storedMoves.length > 0) {
      // Replay all moves to restore game state
      let currentBoard = initializeBoard();
      let currentCastlingRights = initializeCastlingRights();
      const whiteCaptured: Piece[] = [];
      const blackCaptured: Piece[] = [];

      storedMoves.forEach((move) => {
        const result = makeBoardMove(currentBoard, move.from, move.to);
        currentBoard = result.newBoard;
        currentCastlingRights = updateCastlingRights(currentCastlingRights, move.piece, move.from);
        if (result.captured) {
          if (move.piece.color === 'white') {
            whiteCaptured.push(result.captured);
          } else {
            blackCaptured.push(result.captured);
          }
        }
      });

      setBoard(currentBoard);
      setMoves(storedMoves);
      setCapturedByWhite(whiteCaptured);
      setCapturedByBlack(blackCaptured);
      setCastlingRights(currentCastlingRights);
      setCurrentTurn(storedMoves.length % 2 === 0 ? 'white' : 'black');
    }
    setIsInitialized(true);
  }, []);

  // Save moves to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      saveMoves(moves);
    }
  }, [moves, isInitialized]);

  const handleMove = useCallback((from: Square, to: Square, captured: Piece | null) => {
    const piece = board[from.row][from.col];
    if (!piece) return;

    const result = makeBoardMove(board, from, to);
    const castlingType = isCastlingMove(piece, from, to);
    
    const move: Move = {
      from,
      to,
      piece,
      captured: captured || undefined,
      timestamp: Date.now(),
      notation: '',
      isCastling: castlingType || undefined,
    };
    // Generate notation after setting isCastling
    move.notation = generateMoveNotation(move);

    setBoard(result.newBoard);
    setMoves(prev => [...prev, move]);
    setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
    setCastlingRights(prev => updateCastlingRights(prev, piece, from));

    if (captured) {
      if (piece.color === 'white') {
        setCapturedByWhite(prev => [...prev, captured]);
      } else {
        setCapturedByBlack(prev => [...prev, captured]);
      }
    }
  }, [board]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentTurn('white');
    setMoves([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setCastlingRights(initializeCastlingRights());
    clearMoves();
  }, []);

  const clearHistory = useCallback(() => {
    setMoves([]);
    clearMoves();
  }, []);

  const loadFromFEN = useCallback((fen: string): boolean => {
    const parsed = parseFEN(fen);
    if (!parsed) return false;

    setBoard(parsed.board);
    setCurrentTurn(parsed.turn);
    setCastlingRights(parsed.castlingRights);
    setMoves([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    clearMoves();
    
    return true;
  }, []);

  // Generate current FEN
  const currentFEN = generateFEN(board, currentTurn, castlingRights);

  return {
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
  };
}

