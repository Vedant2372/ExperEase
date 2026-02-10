/**
 * ExpertEase Mobile API - connects to Python Flask backend
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

const TOKEN_KEY = '@expertease_token';

export async function getStoredToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setStoredToken(token) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

async function getHeaders(includeAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = await getStoredToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

// ================= AUTH =================
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function workerLogin(email) {
  const res = await fetch(`${API_BASE}/worker/login`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function signup(name, username, email, password) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ name, username, email, password }),
  });
  return handleResponse(res);
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse(res);
}

// ================= USER =================
export async function getUserInfo() {
  const res = await fetch(`${API_BASE}/user/info`, {
    headers: await getHeaders(true),
  });
  return handleResponse(res);
}

// ================= HEALTHCARE =================
export async function getSpecializations() {
  const res = await fetch(`${API_BASE}/healthcare/specializations`);
  return handleResponse(res);
}

export async function getDoctors(specialization = null) {
  const url = specialization
    ? `${API_BASE}/healthcare/doctors/${encodeURIComponent(specialization)}`
    : `${API_BASE}/healthcare/doctors`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function searchDoctors(q) {
  const res = await fetch(`${API_BASE}/healthcare/search?q=${encodeURIComponent(q)}`);
  return handleResponse(res);
}

// ================= APPOINTMENTS =================
export async function getUserAppointments() {
  const res = await fetch(`${API_BASE}/user/appointments`, {
    headers: await getHeaders(true),
  });
  return handleResponse(res);
}

export async function getWorkerAppointments(workerId) {
  const res = await fetch(`${API_BASE}/worker/${workerId}/appointments`, {
    headers: await getHeaders(true),
  });
  return handleResponse(res);
}

export async function bookClinic(userId, workerId, userName, symptoms, date, timeSlot) {
  const res = await fetch(`${API_BASE}/appointment/book`, {
    method: 'POST',
    headers: await getHeaders(true),
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
    headers: await getHeaders(true),
    body: JSON.stringify({
      user_id: userId,
      worker_id: workerId,
      user_name: userName,
      symptoms,
    }),
  });
  return handleResponse(res);
}

// ================= AVAILABILITY =================
export async function getWorkerAvailability(workerId, date) {
  const url = `${API_BASE}/worker/${workerId}/availability${date ? `?date=${date}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

// ================= AI CARE =================
export async function aiCare(symptoms, userId = 'default', action = 'chat') {
  const res = await fetch(`${API_BASE}/healthcare/ai-care`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify({ symptoms, user_id: userId, action }),
  });
  return handleResponse(res);
}
