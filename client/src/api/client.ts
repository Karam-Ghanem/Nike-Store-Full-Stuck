const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
const TOKEN_KEY = 'nike_store_token';

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getErrorMessage(data: unknown) {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const details = Object.values(data as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === 'string') as string[];
    if (details.length) return details.join(' ');
    if ('detail' in data && typeof (data as { detail?: unknown }).detail === 'string') {
      return (data as { detail: string }).detail;
    }
  }
  return 'Something went wrong. Please try again.';
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<T> {
  const { authenticated = true, headers, body, ...requestOptions } = options;
  const token = getAccessToken();
  const requestHeaders = new Headers(headers);
  if (body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (authenticated && token) {
    requestHeaders.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    ...requestOptions,
    body,
    headers: requestHeaders,
  });

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') || '';
  const data: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) clearAccessToken();
    throw new ApiError(getErrorMessage(data), response.status, data);
  }
  return data as T;
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
};
