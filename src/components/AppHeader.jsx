export default function AppHeader({ pageTitle, user, onMenuClick }) {
  const userName = user?.name || "Hospital Staff";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="app-header">
      <div className="header-title-area">
        <button
          type="button"
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div>
          <h1>{pageTitle}</h1>
          <p>Welcome back to your hospital workspace</p>
        </div>
      </div>

      <div className="profile-area">
        <div className="profile-avatar" aria-hidden="true">
          {userInitial}
        </div>
        <div className="profile-details">
          <strong>{userName}</strong>
          <span>Staff account</span>
        </div>
      </div>
    </header>
  );
}
