export async function signup(data: { email: string; password: string; confirmPassword: string }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4001/api'}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json } as const;
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4001/api'}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json } as const;
}
