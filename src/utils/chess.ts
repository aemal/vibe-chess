import { BoardState, Piece, Square, Move, PieceColor, PieceType, CastlingRights } from '@/types/chess';

// Initialize castling rights - all castling available at start
export function initializeCastlingRights(): CastlingRights {
  return {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
  };
}

// Initialize the chess board with pieces in starting positions
export function initializeBoard(): BoardState {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Set up other pieces
  const backRank: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRank[col], color: 'black' };
    board[7][col] = { type: backRank[col], color: 'white' };
  }

  return board;
}

// Convert board position to chess notation (e.g., a1, h8)
export function squareToNotation(square: Square): string {
  const files = 'abcdefgh';
  const rank = 8 - square.row;
  return `${files[square.col]}${rank}`;
}

// Convert piece to notation symbol
export function pieceToSymbol(piece: Piece): string {
  const symbols: Record<PieceType, string> = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: '',
  };
  return symbols[piece.type];
}

// Generate move notation
export function generateMoveNotation(move: Move): string {
  // Handle castling notation
  if (move.isCastling) {
    return move.isCastling === 'kingside' ? 'O-O' : 'O-O-O';
  }
  
  const pieceSymbol = pieceToSymbol(move.piece);
  const toSquare = squareToNotation(move.to);
  const captureSymbol = move.captured ? 'x' : '';
  
  if (move.piece.type === 'pawn' && move.captured) {
    const fromFile = 'abcdefgh'[move.from.col];
    return `${fromFile}x${toSquare}`;
  }
  
  return `${pieceSymbol}${captureSymbol}${toSquare}`;
}

// Check if two squares are the same
export function isSameSquare(a: Square, b: Square): boolean {
  return a.row === b.row && a.col === b.col;
}

// Check if a square is within the board bounds
export function isValidSquare(square: Square): boolean {
  return square.row >= 0 && square.row < 8 && square.col >= 0 && square.col < 8;
}

// Get valid moves for a piece (simplified - no check validation)
export function getValidMoves(board: BoardState, square: Square, castlingRights?: CastlingRights): Square[] {
  const piece = board[square.row][square.col];
  if (!piece) return [];

  const moves: Square[] = [];
  const { row, col } = square;
  const color = piece.color;
  const enemyColor = color === 'white' ? 'black' : 'white';

  const addMoveIfValid = (r: number, c: number, captureOnly = false, moveOnly = false): boolean => {
    if (r < 0 || r >= 8 || c < 0 || c >= 8) return false;
    const target = board[r][c];
    
    if (!target) {
      if (!captureOnly) {
        moves.push({ row: r, col: c });
      }
      return true; // Can continue sliding
    } else if (target.color === enemyColor) {
      if (!moveOnly) {
        moves.push({ row: r, col: c });
      }
      return false; // Can capture but can't continue
    }
    return false; // Own piece blocks
  };

  const addSlideMovesInDirection = (rowDir: number, colDir: number) => {
    for (let i = 1; i < 8; i++) {
      if (!addMoveIfValid(row + i * rowDir, col + i * colDir)) break;
    }
  };

  // Check if squares between two columns are empty (same row)
  const areSquaresEmpty = (startCol: number, endCol: number): boolean => {
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    for (let c = minCol + 1; c < maxCol; c++) {
      if (board[row][c] !== null) return false;
    }
    return true;
  };

  switch (piece.type) {
    case 'pawn': {
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;
      
      // Forward move
      if (addMoveIfValid(row + direction, col, false, true)) {
        // Double move from starting position
        if (row === startRow) {
          addMoveIfValid(row + 2 * direction, col, false, true);
        }
      }
      
      // Captures
      addMoveIfValid(row + direction, col - 1, true);
      addMoveIfValid(row + direction, col + 1, true);
      break;
    }

    case 'knight': {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      knightMoves.forEach(([dr, dc]) => addMoveIfValid(row + dr, col + dc));
      break;
    }

    case 'bishop': {
      addSlideMovesInDirection(-1, -1);
      addSlideMovesInDirection(-1, 1);
      addSlideMovesInDirection(1, -1);
      addSlideMovesInDirection(1, 1);
      break;
    }

    case 'rook': {
      addSlideMovesInDirection(-1, 0);
      addSlideMovesInDirection(1, 0);
      addSlideMovesInDirection(0, -1);
      addSlideMovesInDirection(0, 1);
      break;
    }

    case 'queen': {
      addSlideMovesInDirection(-1, -1);
      addSlideMovesInDirection(-1, 0);
      addSlideMovesInDirection(-1, 1);
      addSlideMovesInDirection(0, -1);
      addSlideMovesInDirection(0, 1);
      addSlideMovesInDirection(1, -1);
      addSlideMovesInDirection(1, 0);
      addSlideMovesInDirection(1, 1);
      break;
    }

    case 'king': {
      // Normal king moves
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      kingMoves.forEach(([dr, dc]) => addMoveIfValid(row + dr, col + dc));

      // Castling moves
      if (castlingRights) {
        // King must be on starting square (e1 for white, e8 for black)
        const isWhiteKingOnStart = color === 'white' && row === 7 && col === 4;
        const isBlackKingOnStart = color === 'black' && row === 0 && col === 4;

        if (isWhiteKingOnStart) {
          // Kingside castling (O-O) - king moves to g1 (col 6)
          if (castlingRights.whiteKingSide) {
            const rookSquare = board[7][7];
            if (rookSquare?.type === 'rook' && rookSquare.color === 'white' && areSquaresEmpty(4, 7)) {
              moves.push({ row: 7, col: 6 }); // g1
            }
          }
          // Queenside castling (O-O-O) - king moves to c1 (col 2)
          if (castlingRights.whiteQueenSide) {
            const rookSquare = board[7][0];
            if (rookSquare?.type === 'rook' && rookSquare.color === 'white' && areSquaresEmpty(0, 4)) {
              moves.push({ row: 7, col: 2 }); // c1
            }
          }
        }

        if (isBlackKingOnStart) {
          // Kingside castling (O-O) - king moves to g8 (col 6)
          if (castlingRights.blackKingSide) {
            const rookSquare = board[0][7];
            if (rookSquare?.type === 'rook' && rookSquare.color === 'black' && areSquaresEmpty(4, 7)) {
              moves.push({ row: 0, col: 6 }); // g8
            }
          }
          // Queenside castling (O-O-O) - king moves to c8 (col 2)
          if (castlingRights.blackQueenSide) {
            const rookSquare = board[0][0];
            if (rookSquare?.type === 'rook' && rookSquare.color === 'black' && areSquaresEmpty(0, 4)) {
              moves.push({ row: 0, col: 2 }); // c8
            }
          }
        }
      }
      break;
    }
  }

  return moves;
}

// Check if a move is a castling move
export function isCastlingMove(piece: Piece | null, from: Square, to: Square): 'kingside' | 'queenside' | null {
  if (!piece || piece.type !== 'king') return null;
  
  // King must move exactly 2 squares horizontally
  if (from.row !== to.row) return null;
  const colDiff = to.col - from.col;
  
  if (colDiff === 2) return 'kingside';  // King moves right 2 squares
  if (colDiff === -2) return 'queenside'; // King moves left 2 squares
  
  return null;
}

// Make a move on the board
export function makeMove(board: BoardState, from: Square, to: Square): { newBoard: BoardState; captured: Piece | null; isCastling?: 'kingside' | 'queenside' } {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  const captured = newBoard[to.row][to.col];
  
  // Move the piece
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  // Check if this is a castling move and move the rook accordingly
  const castlingType = isCastlingMove(piece, from, to);
  if (castlingType) {
    const row = from.row;
    if (castlingType === 'kingside') {
      // Move rook from h-file (col 7) to f-file (col 5)
      newBoard[row][5] = newBoard[row][7];
      newBoard[row][7] = null;
    } else {
      // Move rook from a-file (col 0) to d-file (col 3)
      newBoard[row][3] = newBoard[row][0];
      newBoard[row][0] = null;
    }
    return { newBoard, captured, isCastling: castlingType };
  }
  
  return { newBoard, captured };
}

// Check if a move is valid
export function isValidMove(board: BoardState, from: Square, to: Square, currentTurn: PieceColor, castlingRights?: CastlingRights): boolean {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== currentTurn) return false;
  
  const validMoves = getValidMoves(board, from, castlingRights);
  return validMoves.some(move => isSameSquare(move, to));
}

// Update castling rights after a move
export function updateCastlingRights(rights: CastlingRights, piece: Piece, from: Square): CastlingRights {
  const newRights = { ...rights };
  
  // If king moves, remove both castling rights for that color
  if (piece.type === 'king') {
    if (piece.color === 'white') {
      newRights.whiteKingSide = false;
      newRights.whiteQueenSide = false;
    } else {
      newRights.blackKingSide = false;
      newRights.blackQueenSide = false;
    }
  }
  
  // If rook moves from starting square, remove that castling right
  if (piece.type === 'rook') {
    if (piece.color === 'white') {
      if (from.row === 7 && from.col === 7) newRights.whiteKingSide = false;
      if (from.row === 7 && from.col === 0) newRights.whiteQueenSide = false;
    } else {
      if (from.row === 0 && from.col === 7) newRights.blackKingSide = false;
      if (from.row === 0 && from.col === 0) newRights.blackQueenSide = false;
    }
  }
  
  return newRights;
}

// Parse FEN string and return board state, turn, and castling rights
export function parseFEN(fen: string): { board: BoardState; turn: PieceColor; castlingRights: CastlingRights } | null {
  try {
    const parts = fen.trim().split(' ');
    if (parts.length < 1) return null;

    const piecePlacement = parts[0];
    const activeColor = parts[1] || 'w';
    const castlingAvailability = parts[2] || '-';

    // Parse piece placement
    const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));
    const rows = piecePlacement.split('/');
    
    if (rows.length !== 8) return null;

    const pieceMap: Record<string, { type: PieceType; color: PieceColor }> = {
      'p': { type: 'pawn', color: 'black' },
      'n': { type: 'knight', color: 'black' },
      'b': { type: 'bishop', color: 'black' },
      'r': { type: 'rook', color: 'black' },
      'q': { type: 'queen', color: 'black' },
      'k': { type: 'king', color: 'black' },
      'P': { type: 'pawn', color: 'white' },
      'N': { type: 'knight', color: 'white' },
      'B': { type: 'bishop', color: 'white' },
      'R': { type: 'rook', color: 'white' },
      'Q': { type: 'queen', color: 'white' },
      'K': { type: 'king', color: 'white' },
    };

    for (let row = 0; row < 8; row++) {
      let col = 0;
      for (const char of rows[row]) {
        if (col >= 8) break;
        
        if (char >= '1' && char <= '8') {
          // Empty squares
          col += parseInt(char);
        } else if (pieceMap[char]) {
          // Piece
          board[row][col] = { type: pieceMap[char].type, color: pieceMap[char].color };
          col++;
        }
      }
    }

    // Parse active color
    const turn: PieceColor = activeColor === 'b' ? 'black' : 'white';

    // Parse castling rights
    const castlingRights: CastlingRights = {
      whiteKingSide: castlingAvailability.includes('K'),
      whiteQueenSide: castlingAvailability.includes('Q'),
      blackKingSide: castlingAvailability.includes('k'),
      blackQueenSide: castlingAvailability.includes('q'),
    };

    return { board, turn, castlingRights };
  } catch {
    return null;
  }
}

// Parse PGN move notation and find the corresponding move
export function parsePGNMove(
  board: BoardState, 
  pgn: string, 
  color: PieceColor,
  castlingRights: CastlingRights
): { from: Square; to: Square } | null {
  const trimmedPgn = pgn.trim().replace(/[+#!?]+$/, ''); // Remove check/mate/annotation symbols
  
  // Handle castling
  if (trimmedPgn === 'O-O' || trimmedPgn === '0-0') {
    const row = color === 'white' ? 7 : 0;
    // Check if castling is allowed
    const canCastle = color === 'white' ? castlingRights.whiteKingSide : castlingRights.blackKingSide;
    if (!canCastle) return null;
    return { from: { row, col: 4 }, to: { row, col: 6 } };
  }
  
  if (trimmedPgn === 'O-O-O' || trimmedPgn === '0-0-0') {
    const row = color === 'white' ? 7 : 0;
    const canCastle = color === 'white' ? castlingRights.whiteQueenSide : castlingRights.blackQueenSide;
    if (!canCastle) return null;
    return { from: { row, col: 4 }, to: { row, col: 2 } };
  }

  // Parse the move notation
  // Examples: e4, Nf3, Bxc6, exd5, Qh5, R1a3, Nbd2, etc.
  const files = 'abcdefgh';
  const ranks = '12345678';
  
  // Regex to parse PGN move
  // Group 1: Piece type (optional, empty for pawn)
  // Group 2: Disambiguation file (optional)
  // Group 3: Disambiguation rank (optional)
  // Group 4: Capture indicator (optional)
  // Group 5: Target file
  // Group 6: Target rank
  // Group 7: Promotion piece (optional)
  const moveRegex = /^([KQRBN])?([a-h])?([1-8])?(x)?([a-h])([1-8])(=[QRBN])?$/;
  const match = trimmedPgn.match(moveRegex);
  
  if (!match) return null;
  
  const [, pieceChar, disambigFile, disambigRank, , targetFile, targetRank] = match;
  
  // Determine piece type
  const pieceTypeMap: Record<string, PieceType> = {
    'K': 'king',
    'Q': 'queen',
    'R': 'rook',
    'B': 'bishop',
    'N': 'knight',
  };
  const pieceType: PieceType = pieceChar ? pieceTypeMap[pieceChar] : 'pawn';
  
  // Target square
  const toCol = files.indexOf(targetFile);
  const toRow = 8 - parseInt(targetRank);
  const to: Square = { row: toRow, col: toCol };
  
  // Find all pieces of the correct type and color that can move to the target
  const candidates: Square[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || piece.type !== pieceType || piece.color !== color) continue;
      
      // Check disambiguation
      if (disambigFile && files[col] !== disambigFile) continue;
      if (disambigRank && (8 - row).toString() !== disambigRank) continue;
      
      // Check if this piece can move to the target
      const validMoves = getValidMoves(board, { row, col }, castlingRights);
      if (validMoves.some(m => m.row === toRow && m.col === toCol)) {
        candidates.push({ row, col });
      }
    }
  }
  
  // Should have exactly one candidate
  if (candidates.length === 1) {
    return { from: candidates[0], to };
  }
  
  // If multiple candidates, we need better disambiguation (shouldn't happen with correct PGN)
  if (candidates.length > 1) {
    console.warn('Ambiguous move:', pgn, candidates);
    return { from: candidates[0], to }; // Return first match as fallback
  }
  
  return null;
}

// Generate FEN string from current game state
export function generateFEN(board: BoardState, turn: PieceColor, castlingRights: CastlingRights): string {
  const pieceToFen: Record<PieceType, string> = {
    pawn: 'p',
    knight: 'n',
    bishop: 'b',
    rook: 'r',
    queen: 'q',
    king: 'k',
  };

  // Generate piece placement
  const rows: string[] = [];
  for (let row = 0; row < 8; row++) {
    let rowStr = '';
    let emptyCount = 0;

    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        const fenChar = pieceToFen[piece.type];
        rowStr += piece.color === 'white' ? fenChar.toUpperCase() : fenChar;
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 0) {
      rowStr += emptyCount;
    }
    rows.push(rowStr);
  }

  const piecePlacement = rows.join('/');
  const activeColor = turn === 'white' ? 'w' : 'b';
  
  let castling = '';
  if (castlingRights.whiteKingSide) castling += 'K';
  if (castlingRights.whiteQueenSide) castling += 'Q';
  if (castlingRights.blackKingSide) castling += 'k';
  if (castlingRights.blackQueenSide) castling += 'q';
  if (castling === '') castling = '-';

  return `${piecePlacement} ${activeColor} ${castling} - 0 1`;
}

