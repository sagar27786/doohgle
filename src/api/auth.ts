const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://doohgle-backend.onrender.com/api";

export async function signup(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json } as const;
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json } as const;
}
