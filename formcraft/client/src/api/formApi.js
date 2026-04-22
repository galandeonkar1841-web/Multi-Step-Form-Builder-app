import axios from 'axios'

const api = axios.create({ baseURL: 'https://formcraft-backend-xxxx.onrender.com/api' })

export const formApi = {
  getAll: () => api.get('/forms'),
  getOne: (id) => api.get(`/forms/${id}`),
  create: (data) => api.post('/forms', data),
  update: (id, data) => api.put(`/forms/${id}`, data),
  remove: (id) => api.delete(`/forms/${id}`),
  submit: (id, answers) => api.post(`/forms/${id}/submit`, { answers }),
  getSubmissions: (id) => api.get(`/forms/${id}/submissions`),
}
