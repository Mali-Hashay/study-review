const TOKEN_KEY = 'token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'אין חיבור לשרת. כדאי לבדוק את החיבור לאינטרנט ולנסות שוב.')
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // Expired or invalid token: let the app log the user out
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    throw new ApiError(
      response.status,
      data?.error?.message ?? 'משהו השתבש, נסי שוב',
      data?.error?.details,
    )
  }

  return data
}
