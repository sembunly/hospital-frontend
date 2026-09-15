export default function PatientForm({
  form,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <form className="patient-form" onSubmit={onSubmit}>
      <div className="patient-form-grid">
        <div className="patient-field">
          <label htmlFor="first_name">First Name *</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={onChange}
            maxLength="100"
            required
          />
        </div>

        <div className="patient-field">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={onChange}
            maxLength="100"
          />
        </div>

        <div className="patient-field">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="patient-field">
          <label htmlFor="date_of_birth">Date of Birth *</label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={onChange}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="patient-field">
          <label htmlFor="phone">Phone *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            maxLength="20"
            placeholder="012 345 678"
            required
          />
        </div>

        <div className="patient-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            maxLength="255"
            placeholder="patient@example.com"
          />
        </div>

        <div className="patient-field patient-field-full">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={onChange}
            maxLength="255"
            rows="4"
          />
        </div>
      </div>

      <div className="patient-form-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={onSecondary}
          disabled={loading}
        >
          {secondaryLabel}
        </button>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
