const CSRF_TOKEN_KEY = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}

export function getCSRFToken(): string | null {
  if (typeof window === "undefined") return null;

  let token = localStorage.getItem(CSRF_TOKEN_KEY);
  if (!token) {
    token = generateCSRFToken();
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  return token;
}

export function setCSRFToken(token: string): void {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function getCSRFHeaders(): Record<string, string> {
  const token = getCSRFToken();
  return token ? { [CSRF_HEADER]: token } : {};
}

export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getCSRFHeaders(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
