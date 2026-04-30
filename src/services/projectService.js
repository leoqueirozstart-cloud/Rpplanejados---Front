import api from './api'

export const projectService = {
  async getPublishedProjects() {
    return await api.get('/api/projects/public')
  },
  async getPublishedProject(id) {
    return await api.get(`/api/projects/public/${id}`)
  },
  async getAllProjects() {
    return await api.get('/api/admin/projects')
  },
  async getProject(id) {
    return await api.get(`/api/admin/projects/${id}`)
  },
  async createProject(data) {
    return await api.post('/api/admin/projects', data)
  },
  async updateProject(id, data) {
    return await api.put(`/api/admin/projects/${id}`, data)
  },
  async deleteProject(id) {
    return await api.delete(`/api/admin/projects/${id}`)
  },
  async togglePublish(id) {
    return await api.patch(`/api/admin/projects/${id}/publish`)
  },
  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/api/admin/upload', formData)
    return res[0]
  },
  async uploadFiles(files) {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    return await api.post('/api/admin/upload/multiple', formData)
  }
}