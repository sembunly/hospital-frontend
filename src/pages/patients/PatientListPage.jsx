import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deletePatient,
  getCommunes,
  getDistricts,
  getProvinces,
  getVillages,
  getPatients,
} from "../../services/patientService";
import { patientCollection, patientDisplayName } from "../../data/patientFormData";

const cell = "px-3 py-2 align-top text-xs text-slate-600";

function genderLabel(patient) {
  if (patient.sex === "M" || patient.gender === "male") return "Male";
  if (patient.sex === "F" || patient.gender === "female") return "Female";
  return patient.sex || patient.gender || "-";
}

export default function PatientListPage({ searchOnly = false }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [locations, setLocations] = useState({ province: {}, district: {}, commune: {}, village: {} });

  useEffect(() => {
    getPatients()
      .then((response) => setPatients(patientCollection(response).filter((patient) => Number(patient.is_active ?? 1) !== 0)))
      .catch((requestError) => setError(requestError.message || "Could not load patients."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!patients.length) return;
    let active = true;
    const ids = (key) => [...new Set(patients.map((patient) => patient[key]).filter(Boolean))];
    const index = (items) => Object.fromEntries(items.map((item) => [item.id, item.name_other || item.name]));

    async function loadLocations() {
      try {
        const provinces = (await getProvinces()).data || [];
        const provinceMap = index(provinces);
        const districtGroups = await Promise.all(ids("province_id").map((id) => getDistricts(id)));
        const districts = districtGroups.flatMap((response) => response.data || []);
        const districtMap = index(districts);
        const communeGroups = await Promise.all(ids("district_id").map((id) => getCommunes(id)));
        const communes = communeGroups.flatMap((response) => response.data || []);
        const communeMap = index(communes);
        const villageGroups = await Promise.all(ids("commune_id").map((id) => getVillages(id)));
        const villages = villageGroups.flatMap((response) => response.data || []);
        if (active) setLocations({ province: provinceMap, district: districtMap, commune: communeMap, village: index(villages) });
      } catch {
        // Keep IDs visible if address lookups are unavailable.
      }
    }

    loadLocations();
    return () => { active = false; };
  }, [patients]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return searchOnly ? [] : patients;
    return patients.filter((patient) => [
      patient.patient_code, patient.code, patient.name, patient.first_name,
      patient.surname, patient.last_name, patient.phone, patient.email,
      patient.identification_number, patient.disability, patient.province_id,
      patient.district_id, patient.commune_id, patient.village_id,
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword)));
  }, [patients, search, searchOnly]);

  const remove = async (patient) => {
    if (!window.confirm(`Delete ${patientDisplayName(patient) || "this patient"}?`)) return;
    setDeleting(patient.id);
    try {
      await deletePatient(patient.id);
      setPatients((current) => current.filter((item) => item.id !== patient.id));
    } catch (requestError) {
      setError(requestError.message || "Could not delete patient.");
    } finally {
      setDeleting(null);
    }
  };

  return <section className="mx-auto w-full max-w-[1500px] space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-teal-600">Patients</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{searchOnly ? "Find a patient" : "All patients"}</h1><p className="mt-2 text-sm text-slate-500">{searchOnly ? "Search the complete patient record." : `${patients.length} patient${patients.length === 1 ? "" : "s"} loaded from the patient service.`}</p></div>
      <Link to="/patients/register" className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">+ Register patient</Link>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6"><label className="relative block"><span className="sr-only">Search patients</span><span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">⌕</span><input className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search any patient field…" /></label></div>
      {error && <div className="mx-5 mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? <div className="p-14 text-center text-sm text-slate-500">Loading patients…</div> : searchOnly && !search.trim() ? <div className="p-14 text-center text-sm text-slate-500">Enter a keyword to begin searching.</div> : filtered.length === 0 ? <div className="p-14 text-center text-sm text-slate-500">No patients found.</div> : <div className="overflow-x-auto"><table className="min-w-[1500px] text-left"><thead className="bg-blue-100 text-[11px] uppercase tracking-wider text-blue-800"><tr>{["Code", "Name", "Sex", "Birthdate", "Phone", "Identification", "Disability", "Province", "District", "Commune", "Village", "Photo", "Created", "Actions"].map((heading) => <th className="px-3 py-2 font-semibold" key={heading}>{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((patient) => <tr className="bg-slate-50/70 transition-colors even:bg-blue-50/30 hover:bg-blue-50" key={patient.id}><td className={cell}><span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">{patient.patient_code || "-"}</span></td><td className={`${cell} whitespace-nowrap font-semibold text-slate-800`}>{patientDisplayName(patient) || "-"}</td><td className={cell}>{genderLabel(patient)}</td><td className={`${cell} whitespace-nowrap`}>{patient.date_of_birth ? String(patient.date_of_birth).slice(0, 10) : "-"}</td><td className={`${cell} whitespace-nowrap`}>{patient.phone || "-"}</td><td className={cell}><div className="whitespace-nowrap">{patient.identification_number || "-"} <span className="text-xs text-slate-400">{patient.identification_type || "-"}</span></div></td><td className={cell}>{patient.disability || "-"}</td><td className={`${cell} whitespace-nowrap`}>{locations.province[patient.province_id] || patient.province_id || "-"}</td><td className={`${cell} whitespace-nowrap`}>{locations.district[patient.district_id] || patient.district_id || "-"}</td><td className={`${cell} whitespace-nowrap`}>{locations.commune[patient.commune_id] || patient.commune_id || "-"}</td><td className={`${cell} whitespace-nowrap`}>{locations.village[patient.village_id] || patient.village_id || "-"}</td><td className={cell}>{patient.photo ? <a className="text-teal-700 hover:underline" href={patient.photo} target="_blank" rel="noreferrer">View</a> : "-"}</td><td className={`${cell} whitespace-nowrap text-xs`}>{patient.created_at ? new Date(patient.created_at).toLocaleString() : "-"}</td><td className={`${cell} whitespace-nowrap text-right`}><div className="flex items-center justify-end gap-2"><Link aria-label={`View ${patientDisplayName(patient)}`} title="View" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-teal-700" to={`/patients/${patient.id}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg></Link><Link aria-label={`Edit ${patientDisplayName(patient)}`} title="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-teal-700 hover:bg-teal-50" to={`/patients/${patient.id}/edit`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 16.5-.8 3.8 3.8-.8L18.5 8a2.1 2.1 0 0 0-3-3L4 16.5Z"/><path d="m14 6 4 4"/></svg></Link><button aria-label={`Delete ${patientDisplayName(patient)}`} title="Delete" className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-50" onClick={() => remove(patient)} disabled={deleting === patient.id}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"/></svg></button></div></td></tr>)}</tbody></table></div>}
    </div>
  </section>;
}
