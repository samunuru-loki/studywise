import api from './axiosConfig';

export const studyPlanApi = {
  getAll: (params) => api.get('/study-plans', { params }),
  getByDate: (date) => api.get('/study-plans', { params: { date } }),
  getByDateRange: (startDate, endDate) => api.get('/study-plans', { params: { startDate, endDate } }),
  getBySubject: (subjectId) => api.get('/study-plans', { params: { subjectId } }),
  getById: (id) => api.get(`/study-plans/${id}`),
  create: (data) => api.post('/study-plans', data),
  update: (id, data) => api.put(`/study-plans/${id}`, data),
  updateStatus: (id, status) => api.patch(`/study-plans/${id}/status`, { status }),
  delete: (id) => api.delete(`/study-plans/${id}`),
};
