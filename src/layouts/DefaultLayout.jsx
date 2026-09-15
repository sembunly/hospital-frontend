import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import { logout } from "../services/authService";
import "../styles/dashboard.css";
import "../styles/patients.css";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function DefaultLayout({ children, pageTitle = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="dashboard-layout">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <div className="dashboard-shell">
        <AppHeader
          pageTitle={pageTitle}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
