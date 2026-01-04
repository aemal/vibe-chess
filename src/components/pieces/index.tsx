import React from 'react';
import { King } from './King';
import { Queen } from './Queen';
import { Rook } from './Rook';
import { Bishop } from './Bishop';
import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { PieceType, PieceColor } from '@/types/chess';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  size?: number;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, size = 45 }) => {
  switch (type) {
    case 'king':
      return <King color={color} size={size} />;
    case 'queen':
      return <Queen color={color} size={size} />;
    case 'rook':
      return <Rook color={color} size={size} />;
    case 'bishop':
      return <Bishop color={color} size={size} />;
    case 'knight':
      return <Knight color={color} size={size} />;
    case 'pawn':
      return <Pawn color={color} size={size} />;
    default:
      return null;
  }
};

export { King, Queen, Rook, Bishop, Knight, Pawn };

