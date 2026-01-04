export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Square {
  row: number;
  col: number;
}

export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured?: Piece;
  timestamp: number;
  notation: string;
  isCastling?: 'kingside' | 'queenside';
}

export type BoardState = (Piece | null)[][];

export interface GameState {
  board: BoardState;
  currentTurn: PieceColor;
  moves: Move[];
  selectedSquare: Square | null;
  validMoves: Square[];
}

