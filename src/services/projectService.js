import api from './api'

export const projectService = {
  async getPublishedProjects() {
    const res = await api.get('/api/projects/public')
    return res.data
  },
  async getPublishedProject(id) {
    const res = await api.get(`/api/projects/public/${id}`)
    return res.data
  },
  async getAllProjects() {
    const res = await api.get('/api/admin/projects')
    return res.data
  },
  async getProject(id) {
    const res = await api.get(`/api/admin/projects/${id}`)
    return res.data
  },
  async createProject(data) {
    const res = await api.post('/api/admin/projects', data)
    return res.data
  },
  async updateProject(id, data) {
    const res = await api.put(`/api/admin/projects/${id}`, data)
    return res.data
  },
  async deleteProject(id) {
    await api.delete(`/api/admin/projects/${id}`)
  },
  async togglePublish(id) {
    const res = await api.patch(`/api/admin/projects/${id}/publish`)
    return res.data
  },
  async reorderProjects(order) {
    const res = await api.patch('/api/admin/projects/reorder', { order })
    return res.data
  },
  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/api/admin/upload', formData)
    return res.data[0]
  },
  async uploadFiles(files) {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    const res = await api.post('/api/admin/upload/multiple', formData)
    return res.data
  }
}