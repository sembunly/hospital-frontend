import { apiRequest } from "../api/apiClient";
import { API_BASE_URLS, PATIENT_ENDPOINTS } from "../api/endpoints";

export function getPatients() {
  return apiRequest(API_BASE_URLS.PATIENT, PATIENT_ENDPOINTS.PATIENTS);
}

export function getPatient(patientId) {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.PATIENTS}/${patientId}`,
  );
}

export function createPatient(patient) {
  return apiRequest(API_BASE_URLS.PATIENT, PATIENT_ENDPOINTS.PATIENTS, {
    method: "POST",
    body: patient,
  });
}

export function updatePatient(patientId, patient) {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.PATIENTS}/${patientId}`,
    {
      method: "PUT",
      body: patient,
    },
  );
}

export function deletePatient(patientId) {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.PATIENTS}/${patientId}`,
    { method: "DELETE" },
  );
}
