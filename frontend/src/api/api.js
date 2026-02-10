/**
 * ExpertEase API - Backend connection (matches cli.py flow)
 */
// Use mock API for frontend testing
import * as mockApi from './mockApi.js';

// Toggle between real and mock API
const USE_MOCK_API = true;

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getHeaders(includeAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

// ================= USER AUTH =================
export async function login(username, password) {
  if (USE_MOCK_API) return mockApi.login(username, password);
  
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function signup(name, username, email, password) {
  if (USE_MOCK_API) return mockApi.signup(name, username, email, password);
  
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, username, email, password }),
  });
  return handleResponse(res);
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse(res);
}

export async function getUserInfo() {
  if (USE_MOCK_API) return mockApi.getUserInfo();
  
  const res = await fetch(`${API_BASE}/user/info`, { headers: getHeaders(true) });
  return handleResponse(res);
}

// ================= HEALTHCARE =================
export async function getSpecializations() {
  if (USE_MOCK_API) return mockApi.getSpecializations();
  
  const res = await fetch(`${API_BASE}/healthcare/specializations`);
  return handleResponse(res);
}

export async function getDoctors(specialization = null) {
  if (USE_MOCK_API) return mockApi.getDoctors();
  
  const url = specialization
    ? `${API_BASE}/healthcare/doctors/${encodeURIComponent(specialization)}`
    : `${API_BASE}/healthcare/doctors`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function searchDoctors(q) {
  const res = await fetch(`${API_BASE}/healthcare/search?q=${encodeURIComponent(q || '')}`);
  return handleResponse(res);
}

export async function getWorkerAvailability(workerId, date) {
  const url = `${API_BASE}/worker/${workerId}/availability${date ? `?date=${date}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

// ================= APPOINTMENTS =================
export async function getUserAppointments() {
  if (USE_MOCK_API) return mockApi.getUserAppointments();
  
  const res = await fetch(`${API_BASE}/user/appointments`, { headers: getHeaders(true) });
  return handleResponse(res);
}

export async function bookClinic(userId, workerId, userName, symptoms, date, timeSlot) {
  const res = await fetch(`${API_BASE}/appointment/book`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({
      user_id: userId,
      worker_id: workerId,
      user_name: userName,
      symptoms,
      date,
      time_slot: timeSlot,
    }),
  });
  return handleResponse(res);
}

export async function bookVideo(userId, workerId, userName, symptoms) {
  const res = await fetch(`${API_BASE}/appointment/video-request`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({
      user_id: userId,
      worker_id: workerId,
      user_name: userName,
      symptoms,
    }),
  });
  return handleResponse(res);
}

// ================= AI CARE =================
export async function aiCare(symptoms, userId = 'default', action = 'chat') {
  if (USE_MOCK_API) return mockApi.aiCare(symptoms, userId);
  
  const res = await fetch(`${API_BASE}/healthcare/ai-care`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ symptoms, user_id: userId, action }),
  });
  return handleResponse(res);
}

// ================= WORKER / DOCTOR =================
export async function workerSignup(fullName, email, phone, specialization, experience, clinicLocation = '') {
  const res = await fetch(`${API_BASE}/worker/healthcare/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      full_name: fullName,
      email,
      phone,
      specialization,
      experience: parseInt(experience) || 0,
      clinic_location: clinicLocation,
    }),
  });
  return handleResponse(res);
}

export async function workerLogin(email) {
  const res = await fetch(`${API_BASE}/worker/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function getWorkerRequests(workerId) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/requests`);
  return handleResponse(res);
}

export async function getWorkerAppointments(workerId) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/appointments`);
  return handleResponse(res);
}

export async function getWorkerDashboardStats(workerId) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/dashboard/stats`);
  return handleResponse(res);
}

export async function workerRespond(appointmentId, status) {
  const res = await fetch(`${API_BASE}/worker/respond`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ appointment_id: appointmentId, status }),
  });
  return handleResponse(res);
}

export async function addAvailability(workerId, date, timeSlot) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/availability`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ date, time_slot: timeSlot }),
  });
  return handleResponse(res);
}

export async function removeAvailability(workerId, date, timeSlot) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/availability`, {
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify({ date, time_slot: timeSlot }),
  });
  return handleResponse(res);
}

export async function getWorkerHistory(workerId) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/history`);
  return handleResponse(res);
}
