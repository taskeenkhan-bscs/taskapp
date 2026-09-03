import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  .sb-sidebar {
    width: 240px;
    min-width: 240px;
    height: 100vh;
    position: sticky;
    top: 0;
    background: #0f1117;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    border-right: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 0.25s ease;
    z-index: 40;
  }

  .sb-logo {
    padding: 0 0.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sb-logo-name {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .sb-logo-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    display: inline-block;
    flex-shrink: 0;
  }
  .sb-logo-sub {
    font-size: 11px;
    color: #4b5563;
    margin-top: 4px;
    padding-left: 16px;
  }

  .sb-close-btn {
    display: none;
    background: transparent;
    border: none;
    color: #6b7280;
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
  }

  .sb-section-label {
    font-size: 10px;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0 0.75rem;
    margin: 0 0 6px;
  }

  .sb-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 1.5rem;
  }

  .sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    width: 100%;
    border: none;
    text-align: left;
    transition: background 0.15s, color 0.15s;
  }
  .sb-link:hover {
    background: rgba(255,255,255,0.05);
    color: #e5e7eb;
  }
  .sb-link.active {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
  }
  .sb-link:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  .sb-link-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    color: #4b5563;
    transition: color 0.15s;
  }
  .sb-link:hover .sb-link-icon { color: #9ca3af; }
  .sb-link.active .sb-link-icon { color: #818cf8; }

  .sb-link-label { flex: 1; }

  .sb-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 0.25rem 0.75rem 1rem;
  }

  .sb-logout {
    margin-top: 4px;
    background: rgba(220,38,38,0.12);
    color: #fca5a5;
    justify-content: center;
    font-weight: 600;
  }
  .sb-logout:hover {
    background: rgba(220,38,38,0.22);
    color: #fecaca;
  }

  .sb-user {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .sb-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .sb-user-info { flex: 1; min-width: 0; }
  .sb-user-name {
    font-size: 12px;
    font-weight: 600;
    color: #e5e7eb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sb-user-role {
    font-size: 11px;
    color: #4b5563;
    margin-top: 1px;
    text-transform: capitalize;
  }

  /* Mobile topbar trigger */
  .sb-mobile-trigger {
    display: none;
    position: fixed;
    top: 14px;
    left: 14px;
    z-index: 50;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #0f1117;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e5e7eb;
    font-size: 18px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .sb-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 39;
  }

  @media (max-width: 900px) {
    .sb-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      transform: translateX(-100%);
      box-shadow: 8px 0 24px rgba(0,0,0,0.4);
    }
    .sb-sidebar.open {
      transform: translateX(0);
    }
    .sb-close-btn { display: block; }
    .sb-mobile-trigger { display: flex; }
    .sb-overlay.open { display: block; }
  }
`;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname;

  const [mobileOpen, setMobileOpen] = useState(false);

  // Safely read logged-in user
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  const role = user?.role;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  // Admin sees everything, employee sees a limited set
  const NAV =
    role === "admin"
      ? [
          { icon: "⊞", label: "Home", href: "/" },
          { icon: "◫", label: "All Projects", href: "/projectlist" },
          { icon: "+", label: "Add Project", href: "/addproject" },
          { icon: "👤", label: "Add Member", href: "/createmember" },
          { icon: "👥", label: "All Members", href: "/Membershowpage" },
          { icon: "📝", label: "All Tasks", href: "/tasklist" },
          { icon: "✅", label: "Completed Tasks", href: "/completedtask" },
        ]
      : [
          { icon: "📝", label: "All Tasks", href: "/tasklist" },
          { icon: "✅", label: "Completed Tasks", href: "/completedtask" },
        ];

  return (
    <>
      <style>{styles}</style>

      {/* Mobile hamburger trigger */}
      <button
        className="sb-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Overlay behind drawer on mobile */}
      <div
        className={"sb-overlay" + (mobileOpen ? " open" : "")}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={"sb-sidebar" + (mobileOpen ? " open" : "")}>
        <div className="sb-logo">
          <div>
            <Link to="/" className="sb-logo-name">
              <span className="sb-logo-dot"></span>
              TaskApp
            </Link>
            <div className="sb-logo-sub">Manage your daily tasks</div>
          </div>
          <button
            className="sb-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <p className="sb-section-label">Menu</p>

        <nav className="sb-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={"sb-link" + (active === item.href ? " active" : "")}
            >
              <span className="sb-link-icon">{item.icon}</span>
              <span className="sb-link-label">{item.label}</span>
            </Link>
          ))}

          <button className="sb-link sb-logout" onClick={handleLogout}>
            <span className="sb-link-icon">🚪</span>
            <span className="sb-link-label" style={{ flex: "none" }}>
              Logout
            </span>
          </button>
        </nav>

        <div className="sb-divider"></div>

        <div className="sb-user">
          <div className="sb-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="sb-user-info">
            <div className="sb-user-name">{user?.name || "Guest"}</div>
            <div className="sb-user-role">{user?.role || "unknown"}</div>
          </div>
        </div>
      </aside>
    </>
  );
}