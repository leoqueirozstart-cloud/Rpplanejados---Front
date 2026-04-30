import api from './api'

export const testimonialService = {
  async getTestimonials() {
    const res = await api.get('/api/admin/testimonials')
    return res.data
  },
  async addTestimonial(data) {
    const res = await api.post('/api/admin/testimonials', data)
    return res.data
  },
  async deleteTestimonial(id) {
    await api.delete(`/api/admin/testimonials/${id}`)
  }
}