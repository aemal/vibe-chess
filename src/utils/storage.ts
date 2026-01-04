import { Move } from '@/types/chess';

const MOVES_STORAGE_KEY = 'chess_game_moves';

export function saveMoves(moves: Move[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOVES_STORAGE_KEY, JSON.stringify(moves));
  }
}

export function loadMoves(): Move[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(MOVES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading moves from localStorage:', error);
  }
  
  return [];
}

export function clearMoves(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MOVES_STORAGE_KEY);
  }
}

