import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deletePatient, getPatients } from "../../services/patientService";

export default function PatientListPage({ searchOnly = false }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        setError(requestError.message || "Could not load patients.");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return searchOnly ? [] : patients;

    return patients.filter((patient) =>
      [
        patient.patient_code,
        patient.first_name,
        patient.last_name,
        patient.phone,
        patient.email,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [patients, search, searchOnly]);

  const handleDelete = async (patient) => {
    const patientName = `${patient.first_name} ${patient.last_name || ""}`.trim();

    if (!window.confirm(`Delete ${patientName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(patient.id);
    setError("");

    try {
      await deletePatient(patient.id);
      setPatients((currentPatients) =>
        currentPatients.filter((item) => item.id !== patient.id),
      );
    } catch (requestError) {
      setError(requestError.message || "Could not delete patient.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="patient-page">
      <div className="patient-panel">
        <div className="patient-page-heading patient-list-heading">
          <div>
            <h2>{searchOnly ? "Search Patients" : "Patient List"}</h2>
            <p>
              {searchOnly
                ? "Find a patient by code, name, phone, or email."
                : `${patients.length} registered patient${patients.length === 1 ? "" : "s"}.`}
            </p>
          </div>
          <Link className="button-primary patient-add-link" to="/patients/register">
            + Register Patient
          </Link>
        </div>

        <div className="patient-search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search patient code, name, phone, or email"
            aria-label="Search patients"
          />
        </div>

        {error && (
          <div className="patient-alert error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="patient-empty-state">Loading patients…</div>
        ) : searchOnly && !search.trim() ? (
          <div className="patient-empty-state">Enter a keyword to search.</div>
        ) : filteredPatients.length === 0 ? (
          <div className="patient-empty-state">No patients found.</div>
        ) : (
          <div className="patient-table-wrap">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Patient Code</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <span className="patient-code">{patient.patient_code}</span>
                    </td>
                    <td className="patient-name">
                      {patient.first_name} {patient.last_name || ""}
                    </td>
                    <td className="patient-capitalize">{patient.gender}</td>
                    <td>{patient.date_of_birth}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.email || "—"}</td>
                    <td>
                      <div className="patient-row-actions">
                        <Link to={`/patients/${patient.id}/edit`}>Edit</Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(patient)}
                          disabled={deletingId === patient.id}
                        >
                          {deletingId === patient.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
