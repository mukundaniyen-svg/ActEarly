/**
 * Backend API Client
 * Communicates with local backend at http://localhost:3000/api/ai
 */

export async function callAI(task: string, payload: any): Promise<any> {
  const response = await fetch('http://localhost:3000/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task, payload }),
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.error || 'Backend AI request failed');
  }

  return result;
}
