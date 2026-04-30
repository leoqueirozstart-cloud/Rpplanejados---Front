const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getHeaders() {
  const headers = {}
  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function request(method, url, data = null) {
  const config = {
    method,
    headers: getHeaders()
  }

  if (data instanceof FormData) {
    delete config.headers['Content-Type']
    config.body = data
  } else if (data) {
    config.headers['Content-Type'] = 'application/json'
    config.body = JSON.stringify(data)
  }

  const response = await fetch(`${BASE_URL}${url}`, config)

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    const isAdminRoute = url.includes('/admin/')
    if (isAdminRoute && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login'
    }
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, data) => request('POST', url, data),
  patch: (url, data) => request('PATCH', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url) => request('DELETE', url)
}

export default api