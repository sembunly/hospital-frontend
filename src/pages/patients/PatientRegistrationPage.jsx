import { useState } from "react";
import PatientForm from "../../components/PatientForm";
import { createPatient } from "../../services/patientService";

const emptyPatient = {
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  phone: "",
  email: "",
  address: "",
};

export default function PatientRegistrationPage() {
  const [form, setForm] = useState(emptyPatient);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const clearForm = () => {
    setForm(emptyPatient);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await createPatient(form);
      const patientCode = response.data?.patient_code;

      setMessage(
        `${response.message || "Patient registered successfully."}${
          patientCode ? ` Patient code: ${patientCode}` : ""
        }`,
      );
      setForm(emptyPatient);
    } catch (requestError) {
      setError(requestError.message || "Patient registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="patient-page">
      <div className="patient-panel">
        <div className="patient-page-heading">
          <div>
            <h2>Register a New Patient</h2>
            <p>Enter the patient’s personal and contact information.</p>
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

        <PatientForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Register Patient"
          secondaryLabel="Clear"
          onSecondary={clearForm}
        />
      </div>
    </section>
  );
}
