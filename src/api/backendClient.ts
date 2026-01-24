const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function callAI(task: string, payload: any) {
  const response = await fetch(`${BASE_URL}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ task, payload })
  });

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}
