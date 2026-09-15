import { apiRequest } from "../api/apiClient";
import { API_BASE_URLS, AUTH_ENDPOINTS } from "../api/endpoints";

export function login(email, password) {
  return apiRequest(API_BASE_URLS.AUTH, AUTH_ENDPOINTS.LOGIN, {
    method: "POST",
    body: { email, password },
  });
}

export function getCurrentUser() {
  return apiRequest(API_BASE_URLS.AUTH, AUTH_ENDPOINTS.ME, {
    authenticated: true,
  });
}

export function logout() {
  return apiRequest(API_BASE_URLS.AUTH, AUTH_ENDPOINTS.LOGOUT, {
    method: "POST",
    authenticated: true,
  });
}
