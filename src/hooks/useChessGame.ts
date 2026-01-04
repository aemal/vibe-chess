'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BoardState, Square, Piece, PieceColor, Move, CastlingRights } from '@/types/chess';
import { initializeBoard, makeMove as makeBoardMove, generateMoveNotation, initializeCastlingRights, updateCastlingRights, isCastlingMove, parseFEN, generateFEN, parsePGNMove } from '@/utils/chess';
import { saveMoves, loadMoves, clearMoves } from '@/utils/storage';
import { fetchNextMove } from '@/utils/api';

interface UseChessGameReturn {
  board: BoardState;
  currentTurn: PieceColor;
  moves: Move[];
  capturedByWhite: Piece[];
  capturedByBlack: Piece[];
  castlingRights: CastlingRights;
  currentFEN: string;
  isAIThinking: boolean;
  aiError: string | null;
  clearAIError: () => void;
  handleMove: (from: Square, to: Square, captured: Piece | null) => void;
  resetGame: () => void;
  clearHistory: () => void;
  loadFromFEN: (fen: string) => boolean;
  executePGNMove: (pgn: string, color: PieceColor) => boolean;
}

export function useChessGame(): UseChessGameReturn {
  const [board, setBoard] = useState<BoardState>(() => initializeBoard());
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');
  const [moves, setMoves] = useState<Move[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<Piece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<Piece[]>([]);
  const [castlingRights, setCastlingRights] = useState<CastlingRights>(() => initializeCastlingRights());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  
  // Ref to track if AI move is in progress to prevent duplicate calls
  const aiMoveInProgress = useRef(false);

  const clearAIError = useCallback(() => {
    setAIError(null);
  }, []);

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

  // Auto-trigger AI move when it's black's turn
  useEffect(() => {
    if (!isInitialized || currentTurn !== 'black' || aiMoveInProgress.current) {
      return;
    }

    const fetchAIMove = async () => {
      aiMoveInProgress.current = true;
      setIsAIThinking(true);
      setAIError(null);
      
      try {
        const currentFEN = generateFEN(board, currentTurn, castlingRights);
        const response = await fetchNextMove(currentFEN);
        
        // Check if the response contains an error
        if (response.error) {
          setAIError(response.error);
          console.error('Chess engine error:', response.error);
          return;
        }
        
        if (response.pgn_next_move) {
          // Parse and execute the AI's move
          const moveResult = parsePGNMove(board, response.pgn_next_move, 'black', castlingRights);
          
          if (moveResult) {
            const { from, to } = moveResult;
            const piece = board[from.row][from.col];
            
            if (piece) {
              const result = makeBoardMove(board, from, to);
              const castlingType = isCastlingMove(piece, from, to);

              const move: Move = {
                from,
                to,
                piece,
                captured: result.captured || undefined,
                timestamp: Date.now(),
                notation: '',
                isCastling: castlingType || undefined,
              };
              move.notation = generateMoveNotation(move);

              setBoard(result.newBoard);
              setMoves(prev => [...prev, move]);
              setCurrentTurn('white');
              setCastlingRights(prev => updateCastlingRights(prev, piece, from));

              if (result.captured) {
                setCapturedByBlack(prev => [...prev, result.captured!]);
              }
            }
          } else {
            setAIError(`Failed to parse AI move: ${response.pgn_next_move}`);
            console.error('Failed to parse AI move:', response.pgn_next_move);
          }
        } else {
          setAIError('No move received from chess engine');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch AI move';
        setAIError(errorMessage);
        console.error('Failed to fetch AI move:', error);
      } finally {
        setIsAIThinking(false);
        aiMoveInProgress.current = false;
      }
    };

    // Small delay to make the AI response feel more natural
    const timer = setTimeout(fetchAIMove, 500);
    return () => clearTimeout(timer);
  }, [currentTurn, isInitialized, board, castlingRights]);

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

  const executePGNMove = useCallback((pgn: string, color: PieceColor): boolean => {
    // Parse the PGN move to get from/to squares
    const moveResult = parsePGNMove(board, pgn, color, castlingRights);
    if (!moveResult) return false;

    const { from, to } = moveResult;
    const piece = board[from.row][from.col];
    if (!piece) return false;

    // Execute the move
    const result = makeBoardMove(board, from, to);
    const castlingType = isCastlingMove(piece, from, to);

    const move: Move = {
      from,
      to,
      piece,
      captured: result.captured || undefined,
      timestamp: Date.now(),
      notation: '',
      isCastling: castlingType || undefined,
    };
    move.notation = generateMoveNotation(move);

    setBoard(result.newBoard);
    setMoves(prev => [...prev, move]);
    setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
    setCastlingRights(prev => updateCastlingRights(prev, piece, from));

    if (result.captured) {
      if (piece.color === 'white') {
        setCapturedByWhite(prev => [...prev, result.captured!]);
      } else {
        setCapturedByBlack(prev => [...prev, result.captured!]);
      }
    }

    return true;
  }, [board, castlingRights]);

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
    isAIThinking,
    aiError,
    clearAIError,
    handleMove,
    resetGame,
    clearHistory,
    loadFromFEN,
    executePGNMove,
  };
}

