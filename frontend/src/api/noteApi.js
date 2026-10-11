import api from './axiosConfig';

export const noteApi = {
  getAll: (subjectId) => api.get('/notes', { params: subjectId ? { subjectId } : {} }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};
