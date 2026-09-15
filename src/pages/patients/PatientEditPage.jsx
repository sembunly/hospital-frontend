import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientForm from "../../components/PatientForm";
import { getPatient, updatePatient } from "../../services/patientService";

const emptyPatient = {
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  phone: "",
  email: "",
  address: "",
};

export default function PatientEditPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyPatient);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const response = await getPatient(patientId);
        const patient = response.data;

        setForm({
          first_name: patient.first_name || "",
          last_name: patient.last_name || "",
          gender: patient.gender || "",
          date_of_birth: patient.date_of_birth || "",
          phone: patient.phone || "",
          email: patient.email || "",
          address: patient.address || "",
        });
      } catch (requestError) {
        setError(requestError.message || "Could not load patient.");
      } finally {
        setPageLoading(false);
      }
    };

    loadPatient();
  }, [patientId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updatePatient(patientId, form);
      setMessage(response.message || "Patient updated successfully.");
    } catch (requestError) {
      setError(requestError.message || "Could not update patient.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="patient-page">
      <div className="patient-panel">
        <div className="patient-page-heading">
          <div>
            <h2>Edit Patient</h2>
            <p>Update this patient’s personal and contact information.</p>
          </div>
        </div>

        {message && (
          <div className="patient-alert success" role="status">
            {message}
          </div>
        )}
        {error && (
          <div className="patient-alert error" role="alert">
            {error}
          </div>
        )}

        {pageLoading ? (
          <div className="patient-empty-state">Loading patient…</div>
        ) : error && !form.first_name ? null : (
          <PatientForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Save Changes"
            secondaryLabel="Back to List"
            onSecondary={() => navigate("/patients")}
          />
        )}
      </div>
    </section>
  );
}
