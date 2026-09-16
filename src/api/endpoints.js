export const API_BASE_URLS = {
  AUTH: "http://127.0.0.1:8001/api",
  PATIENT: "http://127.0.0.1:8002/api",
  OPD: "http://127.0.0.1:8003/api",
  DOCTOR: "http://127.0.0.1:8004/api",
};

export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  ME: "/me",
};

export const PATIENT_ENDPOINTS = {
  PATIENTS: "/patients",
  ADDRESSES: "/addresses",
};

export const DOCTOR_ENDPOINTS = {
  DOCTORS: "/doctors",
};
