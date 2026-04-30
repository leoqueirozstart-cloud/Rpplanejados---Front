import api from './api'

export const authService = {
  async login(email, password) {
    const res = await api.post('/api/auth/login', { email, password })
    const { token, name, email: userEmail, role } = res
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ name, email: userEmail, role }))
    return res
  },
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}