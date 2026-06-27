import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }
  return response.json() as Promise<T>
}

function authHeaders(): HeadersInit {
  const token = cookies().get('adminToken')?.value
  if (!token) throw new Error('No admin token — user is not authenticated')
  return { Authorization: `Bearer ${token}` }
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' })
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function apiAuthGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET', headers: authHeaders() })
}

export async function apiAuthPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
}

export async function apiAuthPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
}
