import api from './api'

export const clientService = {
  async createClient(data) {
    return await api.post('/api/clients', data)
  },
  async getClients() {
    return await api.get('/api/admin/clients')
  },
  async updateClientStatus(id, status) {
    return await api.patch(`/api/admin/clients/${id}`, { status })
  },
  async deleteClient(id) {
    return await api.delete(`/api/admin/clients/${id}`)
  }
}