import { useEffect, useState } from "react";
import { getCommunes, getDistricts, getProvinces, getVillages } from "../services/patientService";

const input = "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-50";
const label = "text-sm font-medium text-slate-700";
const section = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

function Select({ value, onChange, options, placeholder, disabled }) {
  return <select className={input} value={value || ""} onChange={onChange} disabled={disabled}>
    <option value="">{placeholder}</option>
    {options.map((item) => <option key={item.id} value={item.id}>{item.name_other || item.name} · {item.name}</option>)}
  </select>;
}

export default function PatientForm({ form, onChange, onSubmit, loading, submitLabel, secondaryLabel, onSecondary }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [addressError, setAddressError] = useState("");
  const idFor = (value, options) => value?.id || options.find((item) => item.code === value?.code)?.id || "";
  const provinceId = idFor(form.province, provinces);
  const districtId = idFor(form.district, districts);
  const communeId = idFor(form.commune, communes);
  const choose = (name, event, options) => onChange(name, options.find((item) => String(item.id) === event.target.value) || null);
  const change = (event) => onChange(event.target.name, event.target.value);

  useEffect(() => { getProvinces().then((r) => setProvinces(r.data || [])).catch(() => setAddressError("Address options could not be loaded.")); }, []);
  useEffect(() => { if (provinceId) getDistricts(provinceId).then((r) => setDistricts(r.data || [])).catch(() => setAddressError("Districts could not be loaded.")); }, [provinceId]);
  useEffect(() => { if (districtId) getCommunes(districtId).then((r) => setCommunes(r.data || [])).catch(() => setAddressError("Communes could not be loaded.")); }, [districtId]);
  useEffect(() => { if (communeId) getVillages(communeId).then((r) => setVillages(r.data || [])).catch(() => setAddressError("Villages could not be loaded.")); }, [communeId]);

  const addDocument = () => onChange("identifications", [...form.identifications, { card_code: "", card_type: "National ID" }]);
  const removeDocument = (index) => onChange("identifications", form.identifications.length === 1 ? [{ card_code: "", card_type: "National ID" }] : form.identifications.filter((_, i) => i !== index));
  const updateDocument = (index, key, value) => onChange("identifications", form.identifications.map((item, i) => i === index ? { ...item, [key]: value } : item));

  return <form onSubmit={onSubmit} className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-teal-800 to-cyan-700 p-6 text-white shadow-lg shadow-teal-900/10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Patient profile</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{form.name || "New patient"}</h2><p className="mt-1 text-sm text-teal-100">Complete the patient record with confidence.</p></div>
      <div className="rounded-xl bg-white/10 px-4 py-3 text-sm"><span className="block text-teal-100">Required fields</span><strong className="text-xl">{[form.name, form.sex, form.birthdate, form.phone].filter(Boolean).length}/4</strong></div>
    </div>

    <section className={section}><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">01 · Identity</p><h3 className="mt-1 text-lg font-semibold text-slate-900">Personal information</h3><p className="mt-1 text-sm text-slate-500">Core identity and demographic details used across clinical records.</p></div><div className="grid gap-5 sm:grid-cols-2">
      <div><label className={label} htmlFor="name">Given name <span className="text-rose-500">*</span></label><input className={input} id="name" name="name" value={form.name} onChange={change} placeholder="Enter given name" required /></div>
      <div><label className={label} htmlFor="surname">Surname</label><input className={input} id="surname" name="surname" value={form.surname} onChange={change} placeholder="Enter family name" /></div>
      <div><label className={label} htmlFor="sex">Sex <span className="text-rose-500">*</span></label><select className={input} id="sex" name="sex" value={form.sex} onChange={change} required><option value="">Select sex</option><option value="M">Male</option><option value="F">Female</option></select></div>
      <div><label className={label} htmlFor="birthdate">Date of birth <span className="text-rose-500">*</span></label><input className={input} id="birthdate" name="birthdate" type="date" value={form.birthdate} onChange={change} max={new Date().toISOString().split("T")[0]} required /></div>
      <div><label className={label} htmlFor="phone">Phone number <span className="text-rose-500">*</span></label><input className={input} id="phone" name="phone" type="tel" value={form.phone} onChange={change} placeholder="012 345 678" required /></div>
      <div><label className={label} htmlFor="nationality">Nationality</label><input className={input} id="nationality" name="nationality" value={form.nationality} onChange={change} placeholder="e.g. Cambodian" /></div>
    </div></section>

    <section className={section}><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">02 · Location</p><h3 className="mt-1 text-lg font-semibold text-slate-900">Administrative location</h3><p className="mt-1 text-sm text-slate-500">Select the location IDs used by the patient service.</p></div>{addressError && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{addressError}</p>}<div className="grid gap-5 sm:grid-cols-2">
      <div><label className={label}>Province / capital</label><Select value={provinceId} options={provinces} placeholder="Select province" onChange={(e) => choose("province", e, provinces)} /></div>
      <div><label className={label}>District / khan</label><Select value={districtId} options={districts} placeholder="Select district" disabled={!provinceId} onChange={(e) => choose("district", e, districts)} /></div>
      <div><label className={label}>Commune / sangkat</label><Select value={communeId} options={communes} placeholder="Select commune" disabled={!districtId} onChange={(e) => choose("commune", e, communes)} /></div>
      <div><label className={label}>Village</label><Select value={idFor(form.village, villages)} options={villages} placeholder="Select village" disabled={!communeId} onChange={(e) => choose("village", e, villages)} /></div>
    </div></section>

    <section className={section}><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">03 · Records</p><h3 className="mt-1 text-lg font-semibold text-slate-900">Administrative details</h3><p className="mt-1 text-sm text-slate-500">Optional information for matching records and supporting care.</p></div><div className="grid gap-5 sm:grid-cols-3">
      <div><label className={label} htmlFor="occupation">Occupation</label><input className={input} id="occupation" name="occupation" value={form.occupation} onChange={change} placeholder="Patient occupation" /></div>
      <div><label className={label} htmlFor="marital_status">Marital status</label><select className={input} id="marital_status" name="marital_status" value={form.marital_status} onChange={change}><option value="">Select status</option><option value="single">Single</option><option value="married">Married</option><option value="divorced">Divorced</option><option value="widowed">Widowed</option></select></div>
      <div><label className={label} htmlFor="spid">SPID</label><input className={input} id="spid" name="spid" value={form.spid} onChange={change} placeholder="External identifier" /></div>
    </div><div className="mt-6 grid gap-5 sm:grid-cols-2"><div><label className={label} htmlFor="disabilities">Disabilities <span className="font-normal text-slate-400">(comma separated)</span></label><textarea className={`${input} h-auto py-3`} id="disabilities" name="disabilities" value={form.disabilities} onChange={change} rows="3" placeholder="e.g. Reduced mobility" /></div><div><label className={label} htmlFor="photos">Photo URLs <span className="font-normal text-slate-400">(one per line)</span></label><textarea className={`${input} h-auto py-3`} id="photos" name="photos" value={form.photos} onChange={change} rows="3" placeholder="https://example.com/photo.jpg" /></div></div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4"><div className="flex items-center justify-between"><div><h4 className="text-sm font-semibold text-slate-800">Identity documents</h4><p className="mt-1 text-xs text-slate-500">National ID, passport, or other identifier.</p></div><button type="button" onClick={addDocument} className="rounded-lg px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50">+ Add document</button></div><div className="mt-4 space-y-3">{form.identifications.map((item, index) => <div className="flex gap-2" key={index}><select className={input} value={item.card_type} onChange={(e) => updateDocument(index, "card_type", e.target.value)}><option>National ID</option><option>Passport</option><option>Birth Certificate</option><option>Other</option></select><input className={input} value={item.card_code} onChange={(e) => updateDocument(index, "card_code", e.target.value)} placeholder="Document number" /><button type="button" onClick={() => removeDocument(index)} className="mt-2 h-8 w-8 shrink-0 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove document">×</button></div>)}</div></div>
    </section>

    <div className="flex flex-col-reverse items-stretch justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6"><div><p className="text-sm font-semibold text-slate-800">Ready to save?</p><p className="mt-1 text-xs text-slate-500">Review required details before continuing.</p></div><div className="flex gap-3"><button type="button" className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onSecondary} disabled={loading}>{secondaryLabel}</button><button type="submit" className="h-11 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>{loading ? "Saving…" : submitLabel}</button></div></div>
  </form>;
}
