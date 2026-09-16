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

export function getProvinces() {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.ADDRESSES}/provinces`,
  );
}

export function getDistricts(provinceId) {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.ADDRESSES}/provinces/${provinceId}/districts`,
  );
}

export function getCommunes(districtId) {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.ADDRESSES}/districts/${districtId}/communes`,
  );
}

export function getVillages(communeId) {
  return apiRequest(
    API_BASE_URLS.PATIENT,
    `${PATIENT_ENDPOINTS.ADDRESSES}/communes/${communeId}/villages`,
  );
}
