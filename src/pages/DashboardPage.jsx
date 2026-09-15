const statistics = [
  {
    title: "Total Patients",
    value: "1,248",
    note: "Registered patients",
    icon: "♙",
    color: "blue",
  },
  {
    title: "Waiting Queue",
    value: "18",
    note: "Patients waiting",
    icon: "◷",
    color: "orange",
  },
  {
    title: "Doctors",
    value: "12",
    note: "Available doctors",
    icon: "+",
    color: "green",
  },
  {
    title: "Today Consultations",
    value: "34",
    note: "Completed today",
    icon: "✓",
    color: "purple",
  },
];

export default function DashboardPage() {
  return (
    <section className="dashboard-page" aria-labelledby="overview-title">
      <div className="dashboard-page-heading">
        <div>
          <h2 id="overview-title">Hospital Overview</h2>
          <p>A quick summary of today’s hospital activity.</p>
        </div>
        <span className="today-label">Today</span>
      </div>

      <div className="statistics-grid">
        {statistics.map((statistic) => (
          <article className="stat-card" key={statistic.title}>
            <div className={`stat-icon stat-icon-${statistic.color}`}>
              {statistic.icon}
            </div>
            <div className="stat-content">
              <p className="stat-title">{statistic.title}</p>
              <strong className="stat-value">{statistic.value}</strong>
              <p className="stat-note">{statistic.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
