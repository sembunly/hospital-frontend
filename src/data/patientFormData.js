export function createEmptyPatientForm() {
  return {
    surname: "",
    name: "",
    sex: "",
    birthdate: "",
    phone: "",
    nationality: "Cambodian",
    occupation: "",
    marital_status: "",
    death_date: "",
    spid: "",
    province: null,
    district: null,
    commune: null,
    village: null,
    house_number: "",
    street_number: "",
    location: "",
    disabilities: "",
    photos: "",
    identifications: [{ card_code: "", card_type: "National ID" }],
  };
}

function compactList(value) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function locationValue(location) {
  if (!location) return null;

  return {
    id: location.id || null,
    code: location.code || null,
    name: location.name || null,
    name_other: location.name_other || null,
  };
}

export function patientToForm(payload) {
  const patient = payload?.data?.patient || payload?.data || payload?.patient || payload || {};
  const address = patient.address || {};
  const identifications = Array.isArray(patient.identifications)
    ? patient.identifications.map(({ card_code = "", card_type = "" }) => ({
        card_code,
        card_type,
      }))
    : [];

  return {
    ...createEmptyPatientForm(),
    surname: patient.surname || patient.last_name || "",
    name: patient.name || patient.first_name || "",
    sex:
      patient.sex ||
      (patient.gender === "male" ? "M" : patient.gender === "female" ? "F" : ""),
    birthdate: String(patient.birthdate || patient.date_of_birth || "").slice(0, 10),
    phone: patient.phone || "",
    nationality: patient.nationality || "Cambodian",
    occupation: patient.occupation || "",
    marital_status: patient.marital_status || "",
    death_date: patient.death_date || "",
    spid: patient.spid || "",
    province: locationValue(address.province) || (patient.province_id ? { id: patient.province_id } : null),
    district: locationValue(address.district) || (patient.district_id ? { id: patient.district_id } : null),
    commune: locationValue(address.commune) || (patient.commune_id ? { id: patient.commune_id } : null),
    village: locationValue(address.village) || (patient.village_id ? { id: patient.village_id } : null),
    house_number: address.house_number || "",
    street_number: address.street_number || "",
    location: address.location || (typeof patient.address === "string" ? patient.address : ""),
    disabilities: Array.isArray(patient.disabilities)
      ? patient.disabilities.join(", ")
      : patient.disability || "",
    photos: Array.isArray(patient.photos) ? patient.photos.join("\n") : patient.photo || "",
      identifications:
      identifications.length > 0
        ? identifications
        : patient.identification_number
          ? [{ card_code: patient.identification_number, card_type: patient.identification_type || "National ID" }]
          : [{ card_code: "", card_type: "National ID" }],
  };
}

export function formToPatientPayload(form) {
  const identification = form.identifications.find(
    (item) => item.card_code.trim() && item.card_type.trim(),
  );
  const photo = compactList(form.photos)[0] || null;

  return {
    patient: {
      first_name: form.name.trim(),
      last_name: form.surname.trim() || null,
      gender: form.sex === "M" ? "male" : form.sex === "F" ? "female" : null,
      date_of_birth: form.birthdate || null,
      phone: form.phone.trim(),
      email: null,
      identification_type: identification?.card_type || null,
      identification_number: identification?.card_code || null,
      disability: compactList(form.disabilities).join(", ") || null,
      photo,
      province_id: form.province?.id || null,
      district_id: form.district?.id || null,
      commune_id: form.commune?.id || null,
      village_id: form.village?.id || null,
    },
  };
}

export function patientCollection(payload) {
  const data = payload?.data?.patients || payload?.data || payload?.patients || [];
  return Array.isArray(data) ? data : [];
}

export function patientDisplayName(patient) {
  return [patient.name || patient.first_name, patient.surname || patient.last_name]
    .filter(Boolean)
    .join(" ");
}
