/**
 * SIP-Publik API Client Service
 * Menghubungkan antarmuka frontend ke backend REST API di port 5000
 * Dilengkapi dengan graceful fallback ke LocalStorage saat offline
 */

const API_BASE = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const data = await res.json();
    return { success: res.ok, data, error: res.ok ? null : data.message };
  } catch (err) {
    console.warn(`[API] Server tidak dapat dijangkau pada ${endpoint}, menggunakan fallback lokal.`, err);
    return { success: false, data: null, error: err.message, isOffline: true };
  }
};

export const apiService = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: (username, password, role) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    }),

  // Complaints
  getComplaints: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/complaints${q ? '?' + q : ''}`);
  },

  getComplaintById: (id) => request(`/complaints/${encodeURIComponent(id)}`),

  submitComplaint: (complaintData) => 
    request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    }),

  verifyAndDisposisi: (id, payload) => 
    request(`/complaints/${encodeURIComponent(id)}/verify-disposisi`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  rejectComplaint: (id, alasan, user) => 
    request(`/complaints/${encodeURIComponent(id)}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ alasan, user })
    }),

  acceptDisposition: (id, user) => 
    request(`/complaints/${encodeURIComponent(id)}/accept-disposisi`, {
      method: 'PATCH',
      body: JSON.stringify({ user })
    }),

  returnDisposition: (id, user) => 
    request(`/complaints/${encodeURIComponent(id)}/return-disposisi`, {
      method: 'PATCH',
      body: JSON.stringify({ user })
    }),

  updateProgress: (id, status, catatanProgres, user) => 
    request(`/complaints/${encodeURIComponent(id)}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ status, catatanProgres, user })
    }),

  uploadProof: (id, bukti, user) => 
    request(`/complaints/${encodeURIComponent(id)}/upload-proof`, {
      method: 'POST',
      body: JSON.stringify({ bukti, user })
    }),

  sendOfficialResponse: (id, tanggapan, user) => 
    request(`/complaints/${encodeURIComponent(id)}/official-response`, {
      method: 'POST',
      body: JSON.stringify({ tanggapan, user })
    }),

  escalateComplaint: (id, prioritas, instruksiKhusus, user) => 
    request(`/complaints/${encodeURIComponent(id)}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ prioritas, instruksiKhusus, user })
    }),

  approveClosure: (id, user) => 
    request(`/complaints/${encodeURIComponent(id)}/approve-closure`, {
      method: 'POST',
      body: JSON.stringify({ user })
    }),

  submitReview: (id, rating, ulasan) => 
    request(`/complaints/${encodeURIComponent(id)}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, ulasan })
    }),

  // Users (Admin)
  getUsers: () => request('/users'),
  createUser: (user) => request('/users', { method: 'POST', body: JSON.stringify(user) }),
  toggleUserStatus: (id) => request(`/users/${id}/status`, { method: 'PATCH' }),
  resetPassword: (id) => request(`/users/${id}/reset-password`, { method: 'POST' }),

  // Audit & Config
  getAuditLogs: (q = '') => request(`/audit-logs${q ? '?q=' + encodeURIComponent(q) : ''}`),
  getConfig: () => request('/config'),
  updateConfig: (config) => request('/config', { method: 'PUT', body: JSON.stringify(config) }),

  // Dashboard
  getStats: () => request('/dashboard/stats')
};

