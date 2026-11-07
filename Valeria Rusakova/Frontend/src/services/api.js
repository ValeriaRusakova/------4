// services/api.js
// All communication with the FastAPI server lives here.
// The components never call fetch() directly - they use these functions.
// Note: there is NO OpenAI key here. Only the server talks to OpenAI.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// A small helper that sends a request and returns the JSON answer.
// If something goes wrong it throws an Error with a friendly Hebrew message.
async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(API_BASE_URL + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch itself failed = the server is not reachable at all
    throw new Error("אין חיבור לשרת. ודאו שהשרת פועל ונסו שוב.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // The server sends a readable message in "detail" (for example 404 / 503)
    const serverMessage = typeof data?.detail === "string" ? data.detail : null;
    throw new Error(serverMessage || "אירעה שגיאה. נסו שוב.");
  }

  return data;
}

// POST /api/conversations -> { id, created_at }
export function createConversation() {
  return request("/api/conversations", { method: "POST" });
}

// POST /api/conversations/{id}/messages -> { user_message, assistant_message }
export function sendMessage(conversationId, content) {
  return request(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
