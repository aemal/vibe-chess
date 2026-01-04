const API_URL = 'https://aemal.app.n8n.cloud/webhook/a47750d1-a10c-484e-8885-ab20f0891a29';

export interface ChessAPIResponse {
  pgn_next_move?: string;
  error?: string;
}

export async function fetchNextMove(fen: string): Promise<ChessAPIResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fen }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

