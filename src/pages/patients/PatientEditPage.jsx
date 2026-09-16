import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientForm from "../../components/PatientForm";
import { getPatient, updatePatient } from "../../services/patientService";
import { createEmptyPatientForm, formToPatientPayload, patientToForm } from "../../data/patientFormData";

export default function PatientEditPage() {
  const { patientId } = useParams(); const navigate = useNavigate();
  const [form, setForm] = useState(createEmptyPatientForm); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { if (!message) return undefined; const timer = setTimeout(() => setMessage(""), 3000); return () => clearTimeout(timer); }, [message]);
  useEffect(() => { getPatient(patientId).then((response) => setForm(patientToForm(response))).catch((requestError) => setError(requestError.message || "Could not load patient.")).finally(() => setLoading(false)); }, [patientId]);
  const onChange = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updatePatient(patientId, formToPatientPayload(form));
      setMessage("Patient updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      const validationError = requestError.data?.errors
        ? Object.values(requestError.data.errors).flat().filter(Boolean).join(" ")
        : "";
      setError(validationError || requestError.message || "Could not update patient.");
    } finally {
      setSaving(false);
    }
  };
  return <section className="mx-auto w-full max-w-5xl space-y-6"><div><p className="text-sm font-semibold text-teal-600">Patients / Edit</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Update patient record</h1><p className="mt-2 text-sm text-slate-500">Keep demographic, address, and identity details current.</p></div>{message && <div className="fixed right-6 top-24 z-50 w-[min(360px,calc(100vw-3rem))] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-lg transition-all duration-300 ease-out toast-slide-in" role="status">{message}</div>}{error && <div className="fixed right-6 top-40 z-50 w-[min(360px,calc(100vw-3rem))] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-lg transition-all duration-300 ease-out toast-slide-in" role="alert">{error}</div>}{loading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading patient record…</div> : <PatientForm form={form} onChange={onChange} onSubmit={submit} loading={saving} submitLabel="Save changes" secondaryLabel="Back to list" onSecondary={() => navigate("/patients")} />}</section>;
}
