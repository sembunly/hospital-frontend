import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuGroups = [
  {
    label: "Patients",
    icon: "♙",
    items: [
      { label: "Register Patient", to: "/patients/register" },
      { label: "Patient List", to: "/patients" },
      { label: "Patient Search", to: "/patients/search" },
    ],
  },
  {
    label: "OPD",
    icon: "✚",
    items: [
      { label: "New OPD Visit" },
      { label: "OPD Queue" },
      { label: "Vital Signs" },
    ],
  },
  {
    label: "Consultation",
    icon: "◉",
    items: [
      { label: "Waiting Patients" },
      { label: "Consultation History" },
    ],
  },
  {
    label: "Administration",
    icon: "⚙",
    items: [{ label: "Users" }, { label: "Roles" }],
  },
];

export default function AppSidebar({ isOpen, onClose, onLogout, loggingOut }) {
  const [openMenu, setOpenMenu] = useState("Patients");

  const toggleMenu = (menuLabel) => {
    setOpenMenu((currentMenu) =>
      currentMenu === menuLabel ? null : menuLabel,
    );
  };

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">
            +
          </span>
          <div>
            <strong>CarePoint</strong>
            <span>Hospital System</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link sidebar-dashboard-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span className="menu-icon" aria-hidden="true">
              ▦
            </span>
            Dashboard
          </NavLink>

          {menuGroups.map((group) => (
            <div className="sidebar-group" key={group.label}>
              <button
                type="button"
                className={`sidebar-group-title ${
                  openMenu === group.label ? "is-expanded" : ""
                }`}
                onClick={() => toggleMenu(group.label)}
                aria-expanded={openMenu === group.label}
              >
                <span className="menu-icon" aria-hidden="true">
                  {group.icon}
                </span>
                {group.label}
                <span className="sidebar-chevron" aria-hidden="true">
                  ›
                </span>
              </button>

              {openMenu === group.label && (
                <div className="sidebar-submenu">
                  {group.items.map((item) =>
                    item.to ? (
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `sidebar-submenu-item ${isActive ? "active" : ""}`
                        }
                        onClick={onClose}
                        end={item.to === "/patients"}
                        key={item.label}
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <span className="sidebar-submenu-item" key={item.label}>
                        {item.label}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
          disabled={loggingOut}
        >
          <span className="menu-icon" aria-hidden="true">
            ↪
          </span>
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </aside>

      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}
