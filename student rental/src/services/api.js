/**
 * api.js — centralised fetch wrapper for the Spring Boot backend.
 * Base URL: http://localhost:8080/api
 */

const BASE_URL = 'http://localhost:8080/api'

function getToken() {
  const directToken = localStorage.getItem('cc_token')
  if (directToken) return directToken

  try {
    const persisted = localStorage.getItem('campus-circular-auth')
    if (persisted) {
      const parsed = JSON.parse(persisted)
      return parsed?.state?.token || null
    }
  } catch {
    // ignore parse error
  }
  return null
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkErr) {
    // TypeError: Failed to fetch — backend is down or unreachable
    const err = new Error(
      'Cannot connect to Java backend (http://localhost:8080). Please ensure the Spring Boot server is running, or use Demo Login.'
    )
    err.isNetworkError = true
    err.originalError = networkErr
    throw err
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    const errorObj = new Error(err.error || err.message || (res.status === 401 ? 'Invalid email or password' : 'Request failed'))
    errorObj.status = res.status
    throw errorObj
  }

  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
  checkHealth: async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)
      const res = await fetch(`${BASE_URL}/resources/categories`, {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return res.ok
    } catch {
      return false
    }
  }
}

