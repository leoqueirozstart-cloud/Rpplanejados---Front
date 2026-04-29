import api from './api'

export const clientService = {
  async createClient(data) {
    const res = await api.post('/api/clients', data)
    return res.data
  },
  async getClients() {
    const res = await api.get('/api/admin/clients')
    return res.data
  },
  async updateClientStatus(id, status) {
    const res = await api.patch(`/api/admin/clients/${id}`, { status })
    return res.data
  },
  async deleteClient(id) {
    const res = await api.delete(`/api/admin/clients/${id}`)
    return res.data
  }
}