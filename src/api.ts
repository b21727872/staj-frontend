export type Section = {
  slug: string
  title: string
  content: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const TOKEN_KEY = "proje_token"

const SITE_API_URL = "https://api.alisenol.org"
const PRODUCTION_API_URL = "https://staj-backend-production.up.railway.app"

function apiUrl(path: string) {
  const configured = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "")
  if (configured) return `${configured}${path}`
  if (typeof window !== "undefined") {
    const host = window.location.hostname
    if (host === "alisenol.org" || host === "www.alisenol.org") {
      return `${SITE_API_URL}${path}`
    }
    if (host !== "localhost" && host !== "127.0.0.1") {
      return `${PRODUCTION_API_URL}${path}`
    }
  }
  return path
}

export function readToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function writeToken(token: string | null) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  const token = readToken()
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(apiUrl(path), { ...options, headers })
  } catch {
    throw new ApiError("Sunucuya ulaşılamadı. API çalışıyor mu kontrol edin.", 0)
  }

  if (!response.ok) {
    let message = "İstek tamamlanamadı."
    try {
      const data: unknown = await response.json()
      if (
        data &&
        typeof data === "object" &&
        "detail" in data &&
        typeof data.detail === "string"
      ) {
        message = data.detail
      }
    } catch {
      // Keep the fallback message when the body is not JSON.
    }
    throw new ApiError(message, response.status)
  }

  return (await response.json()) as T
}

export function fetchSections() {
  return request<{ sections: Section[] }>("/api/sections")
}

export function loginRequest(username: string, password: string) {
  return request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export function updateSection(slug: string, content: string) {
  return request<Section>(`/api/sections/${slug}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  })
}

export function sendContact(name: string, email: string, message: string) {
  return request<{ sent: boolean; detail: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  })
}
