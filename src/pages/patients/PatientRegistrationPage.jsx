import { useEffect, useState } from "react";
import PatientForm from "../../components/PatientForm";
import { createPatient } from "../../services/patientService";
import { createEmptyPatientForm, formToPatientPayload } from "../../data/patientFormData";

export default function PatientRegistrationPage() {
  const [form, setForm] = useState(createEmptyPatientForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { if (!message) return undefined; const timer = setTimeout(() => setMessage(""), 3000); return () => clearTimeout(timer); }, [message]);
  const onChange = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await createPatient(formToPatientPayload(form));
      setMessage("Patient saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setForm(createEmptyPatientForm());
    }
    catch (requestError) {
      const validationError = requestError.data?.errors
        ? Object.values(requestError.data.errors).flat().filter(Boolean).join(" ")
        : "";
      setError(validationError || requestError.message || "Patient registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm(createEmptyPatientForm());
    setMessage("");
    setError("");
  };

  return <section className="mx-auto w-full max-w-5xl space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-teal-600">Patients / Registration</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Register a new patient</h1><p className="mt-2 text-sm text-slate-500">Create a complete patient profile for faster, safer care.</p></div><span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">New record</span></div>{message && <div className="flex items-center gap-3 fixed right-6 top-24 z-50 w-[min(360px,calc(100vw-3rem))] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-lg transition-all duration-300 ease-out toast-slide-in" role="status"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-200 text-emerald-800">✓</span><span className="flex-1">{message}</span><button type="button" onClick={() => setMessage("")} className="text-emerald-700 hover:text-emerald-900" aria-label="Dismiss success message">×</button></div>}{error && <div className="flex items-center gap-3 fixed right-6 top-40 z-50 w-[min(360px,calc(100vw-3rem))] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-lg transition-all duration-300 ease-out toast-slide-in" role="alert"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-200 font-bold text-rose-800">!</span><span className="flex-1">{error}</span><button type="button" onClick={() => setError("")} className="text-rose-700 hover:text-rose-900" aria-label="Dismiss error message">×</button></div>}<PatientForm form={form} onChange={onChange} onSubmit={submit} loading={loading} submitLabel="Register patient" secondaryLabel="Clear form" onSecondary={clearForm} /></section>;
}
