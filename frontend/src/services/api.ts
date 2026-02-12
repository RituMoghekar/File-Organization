const API_BASE = "http://localhost:9000/api";

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: { "X-API-KEY": "hackathon-secret-key" },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getActivity() {
  const res = await fetch(`${API_BASE}/activity`, {
    headers: { "X-API-KEY": "hackathon-secret-key" },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getFiles() {
  const res = await fetch(`${API_BASE}/files`, {
    headers: { "X-API-KEY": "hackathon-secret-key" },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  return res.json();
}
