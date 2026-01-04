'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ChessPiece } from './pieces';
import { BoardState, Square, Piece, PieceColor, CastlingRights } from '@/types/chess';
import { getValidMoves, isValidMove, makeMove } from '@/utils/chess';

interface ChessBoardProps {
  board: BoardState;
  currentTurn: PieceColor;
  castlingRights: CastlingRights;
  onMove: (from: Square, to: Square, captured: Piece | null) => void;
}

const SQUARE_SIZE = 70;

export const ChessBoard: React.FC<ChessBoardProps> = ({ board, currentTurn, castlingRights, onMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [dragging, setDragging] = useState<{
    piece: Piece;
    from: Square;
    x: number;
    y: number;
  } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const getSquareColor = (row: number, col: number): string => {
    const isLight = (row + col) % 2 === 0;
    return isLight ? '#f0d9b5' : '#b58863';
  };

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare !== null && selectedSquare.row === row && selectedSquare.col === col;
  };

  const handleSquareClick = useCallback((row: number, col: number) => {
    const clickedSquare: Square = { row, col };
    const clickedPiece = board[row][col];

    // If we have a selected piece and click on a valid move square
    if (selectedSquare && isValidMoveSquare(row, col)) {
      const result = makeMove(board, selectedSquare, clickedSquare);
      onMove(selectedSquare, clickedSquare, result.captured);
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If clicking on own piece, select it
    if (clickedPiece && clickedPiece.color === currentTurn) {
      setSelectedSquare(clickedSquare);
      setValidMoves(getValidMoves(board, clickedSquare, castlingRights));
    } else {
      // Deselect
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [board, currentTurn, selectedSquare, validMoves, onMove, castlingRights]);

  const handleMouseDown = useCallback((e: React.MouseEvent, row: number, col: number) => {
    const piece = board[row][col];
    if (!piece || piece.color !== currentTurn) return;

    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragging({
      piece,
      from: { row, col },
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setSelectedSquare({ row, col });
    setValidMoves(getValidMoves(board, { row, col }, castlingRights));
  }, [board, currentTurn, castlingRights]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    setDragging({
      ...dragging,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [dragging]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragging || !boardRef.current) {
      setDragging(null);
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / SQUARE_SIZE);
    const row = Math.floor(y / SQUARE_SIZE);

    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const to: Square = { row, col };
      if (isValidMove(board, dragging.from, to, currentTurn, castlingRights)) {
        const result = makeMove(board, dragging.from, to);
        onMove(dragging.from, to, result.captured);
      }
    }

    setDragging(null);
    setSelectedSquare(null);
    setValidMoves([]);
  }, [dragging, board, currentTurn, onMove, castlingRights]);

  const handleMouseLeave = useCallback(() => {
    if (dragging) {
      setDragging(null);
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [dragging]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="relative select-none">
      {/* Board Container with shadow and border */}
      <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-amber-900">
        {/* Coordinate labels - files (letters) */}
        <div className="flex bg-amber-900">
          <div className="w-6" />
          {files.map((file) => (
            <div
              key={file}
              className="flex items-center justify-center text-amber-200 font-semibold text-sm"
              style={{ width: SQUARE_SIZE, height: 24 }}
            >
              {file}
            </div>
          ))}
          <div className="w-6" />
        </div>

        <div className="flex">
          {/* Coordinate labels - ranks (numbers) left */}
          <div className="flex flex-col bg-amber-900 w-6">
            {ranks.map((rank) => (
              <div
                key={rank}
                className="flex items-center justify-center text-amber-200 font-semibold text-sm"
                style={{ width: 24, height: SQUARE_SIZE }}
              >
                {rank}
              </div>
            ))}
          </div>

          {/* The actual board */}
          <div
            ref={boardRef}
            className="relative cursor-pointer"
            style={{ width: SQUARE_SIZE * 8, height: SQUARE_SIZE * 8 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* Squares */}
            {Array(8).fill(null).map((_, row) => (
              <div key={row} className="flex">
                {Array(8).fill(null).map((_, col) => {
                  const piece = board[row][col];
                  const squareColor = getSquareColor(row, col);
                  const isValidTarget = isValidMoveSquare(row, col);
                  const isSelectedSquare = isSelected(row, col);
                  const isDraggingFrom = dragging && dragging.from.row === row && dragging.from.col === col;

                  return (
                    <div
                      key={`${row}-${col}`}
                      className="relative flex items-center justify-center transition-all duration-150"
                      style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        backgroundColor: squareColor,
                        boxShadow: isSelectedSquare ? 'inset 0 0 0 3px rgba(255, 215, 0, 0.8)' : 'none',
                      }}
                      onClick={() => handleSquareClick(row, col)}
                      onMouseDown={(e) => handleMouseDown(e, row, col)}
                    >
                      {/* Valid move indicator */}
                      {isValidTarget && !piece && (
                        <div
                          className="absolute rounded-full bg-black/20"
                          style={{ width: 20, height: 20 }}
                        />
                      )}
                      
                      {/* Capture indicator */}
                      {isValidTarget && piece && (
                        <div
                          className="absolute rounded-full border-4 border-black/30"
                          style={{ width: SQUARE_SIZE - 8, height: SQUARE_SIZE - 8 }}
                        />
                      )}

                      {/* Piece */}
                      {piece && !isDraggingFrom && (
                        <div className="transition-transform hover:scale-105">
                          <ChessPiece type={piece.type} color={piece.color} size={SQUARE_SIZE - 10} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Dragging piece */}
            {dragging && (
              <div
                className="absolute pointer-events-none z-50"
                style={{
                  left: dragging.x - (SQUARE_SIZE - 10) / 2,
                  top: dragging.y - (SQUARE_SIZE - 10) / 2,
                  transform: 'scale(1.1)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}
              >
                <ChessPiece type={dragging.piece.type} color={dragging.piece.color} size={SQUARE_SIZE - 10} />
              </div>
            )}
          </div>

          {/* Coordinate labels - ranks (numbers) right */}
          <div className="flex flex-col bg-amber-900 w-6">
            {ranks.map((rank) => (
              <div
                key={rank}
                className="flex items-center justify-center text-amber-200 font-semibold text-sm"
                style={{ width: 24, height: SQUARE_SIZE }}
              >
                {rank}
              </div>
            ))}
          </div>
        </div>

        {/* Coordinate labels - files (letters) bottom */}
        <div className="flex bg-amber-900">
          <div className="w-6" />
          {files.map((file) => (
            <div
              key={file}
              className="flex items-center justify-center text-amber-200 font-semibold text-sm"
              style={{ width: SQUARE_SIZE, height: 24 }}
            >
              {file}
            </div>
          ))}
          <div className="w-6" />
        </div>
      </div>
    </div>
  );
};

