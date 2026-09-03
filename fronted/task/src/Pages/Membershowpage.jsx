import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .layout {
    display: flex;
    min-height: 100vh;
    background: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .member-page {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    min-width: 0;
  }

  /* ── Top bar ── */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 1.75rem;
  }
  .page-header-left h1 {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
  }
  .page-header-left p {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 3px;
  }
  .add-member-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .add-member-btn:hover { background: #1f2937; }

  /* ── Search bar ── */
  .search-bar {
    margin-bottom: 1.25rem;
  }
  .search-bar input {
    width: 100%;
    max-width: 340px;
    padding: 9px 14px 9px 36px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 13px;
    color: #374151;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 12px center;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-bar input:focus { border-color: #6366f1; }

  /* ── Table card (desktop) ── */
  .table-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 18px;
    overflow: hidden;
  }
  .table-scroll { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  thead tr {
    background: #f9fafb;
    border-bottom: 1px solid #f0f0f0;
  }
  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
  th.th-actions { text-align: right; }

  tbody tr {
    border-bottom: 1px solid #f9fafb;
    transition: background 0.12s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #fafafa; }
  td { padding: 13px 16px; vertical-align: middle; color: #374151; }

  .member-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .member-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
    flex-shrink: 0;
  }
  .member-avatar-fallback {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .member-name {
    font-weight: 600;
    color: #111827;
    font-size: 13px;
  }

  .td-muted { color: #6b7280; font-size: 13px; }

  .role-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    white-space: nowrap;
  }

  /* ── Icon action buttons ── */
  .act-btns {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: flex-end;
  }
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, background 0.15s;
    flex-shrink: 0;
  }
  .icon-btn:hover { transform: translateY(-1px); }
  .icon-btn svg { width: 15px; height: 15px; }

  .icon-btn-update {
    background: #eff6ff;
    color: #1d4ed8;
  }
  .icon-btn-update:hover { background: #dbeafe; }

  .icon-btn-delete {
    background: #fef2f2;
    color: #dc2626;
  }
  .icon-btn-delete:hover { background: #fee2e2; }

  /* ── States ── */
  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 10px;
    color: #9ca3af;
    font-size: 14px;
  }
  .state-box .state-icon { font-size: 36px; opacity: 0.4; }
  .state-box .state-label { font-weight: 500; color: #6b7280; }

  .spin {
    width: 20px; height: 20px;
    border: 2px solid #e5e7eb;
    border-top-color: #6b7280;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 4px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    left: auto;
    max-width: calc(100vw - 48px);
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: slideUp 0.25s ease;
  }
  .toast.success { background: #16a34a; }
  .toast.error   { background: #dc2626; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Mobile card list (replaces table under 768px) ── */
  .mobile-list { display: none; }

  .member-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid #f9fafb;
  }
  .member-card:last-child { border-bottom: none; }
  .member-card-info { flex: 1; min-width: 0; }
  .member-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .member-card-name {
    font-weight: 600;
    color: #111827;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .member-card-meta {
    font-size: 12px;
    color: #6b7280;
    margin-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .member-card-actions {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    .layout { flex-direction: column; }
    .member-page { padding: 1rem; }
    .table-card .table-scroll { display: none; }
    .mobile-list {
      display: block;
      background: #fff;
      border: 1px solid #f0f0f0;
      border-radius: 18px;
      overflow: hidden;
    }
    .search-bar input { max-width: 100%; }
    .page-header { flex-direction: column; align-items: stretch; }
    .add-member-btn { justify-content: center; }
    .toast { right: 16px; left: 16px; }
  }
`;

// ── Inline icons (no external dependency) ──
function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Membershowpage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null); // { msg, type }
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMembers();
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  async function getMembers() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/members/`,
        authHeaders()
      );
      if (res.data.success) {
        setMembers(res.data.data || res.data.members || []);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load members.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deletebyid(id) {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/members/deletemember`, {
        data: { id },
        ...authHeaders(),
      });
      setMembers((prev) => prev.filter((m) => m._id !== id));
      showToast("Member deleted successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = members.filter(
    (m) =>
      !search ||
      (m.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.role || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>

      <div className="layout">
        <Sidebar />

        <div className="member-page">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-left">
              <h1>All Members</h1>
              <p>
                {members.length} member{members.length !== 1 ? "s" : ""} registered
              </p>
            </div>
            <a href="/createmember" className="add-member-btn">
              + Add Member
            </a>
          </div>

          {/* Search */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, email or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="table-card">
              <div className="state-box">
                <div className="spin" />
                <span className="state-label">Loading members…</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="table-card">
              <div className="state-box">
                <span className="state-icon">👥</span>
                <span className="state-label">
                  {search ? "No members match your search." : "No members found."}
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="table-card">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Member</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th className="th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item, index) => (
                        <tr key={item._id}>
                          <td className="td-muted">{index + 1}</td>

                          <td>
                            <div className="member-cell">
                              {item.profilePicture ? (
                                <img
                                  src={item.profilePicture}
                                  alt={item.fullName}
                                  className="member-avatar"
                                />
                              ) : (
                                <div className="member-avatar-fallback">
                                  {getInitials(item.fullName)}
                                </div>
                              )}
                              <span className="member-name">{item.fullName}</span>
                            </div>
                          </td>

                          <td className="td-muted">{item.email}</td>
                          <td className="td-muted">{item.phoneNo || "—"}</td>

                          <td>
                            <span className="role-badge">{item.role || "Member"}</span>
                          </td>

                          <td>
                            <div className="act-btns">
                              <button
                                className="icon-btn icon-btn-update"
                                title="Update member"
                                aria-label="Update member"
                                onClick={() => navigate(`/updatemember/${item._id}`)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="icon-btn icon-btn-delete"
                                title="Delete member"
                                aria-label="Delete member"
                                disabled={deletingId === item._id}
                                onClick={() => deletebyid(item._id)}
                                style={{
                                  opacity: deletingId === item._id ? 0.5 : 1,
                                  cursor: deletingId === item._id ? "not-allowed" : "pointer",
                                }}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile card list */}
              <div className="mobile-list">
                {filtered.map((item) => (
                  <div className="member-card" key={item._id}>
                    {item.profilePicture ? (
                      <img
                        src={item.profilePicture}
                        alt={item.fullName}
                        className="member-avatar"
                      />
                    ) : (
                      <div className="member-avatar-fallback">
                        {getInitials(item.fullName)}
                      </div>
                    )}

                    <div className="member-card-info">
                      <div className="member-card-top">
                        <span className="member-card-name">{item.fullName}</span>
                        <span className="role-badge">{item.role || "Member"}</span>
                      </div>
                      <div className="member-card-meta">{item.email}</div>
                      <div className="member-card-meta">{item.phoneNo || "—"}</div>

                      <div className="member-card-actions">
                        <button
                          className="icon-btn icon-btn-update"
                          title="Update member"
                          aria-label="Update member"
                          onClick={() => navigate(`/updatemember/${item._id}`)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="icon-btn icon-btn-delete"
                          title="Delete member"
                          aria-label="Delete member"
                          disabled={deletingId === item._id}
                          onClick={() => deletebyid(item._id)}
                          style={{
                            opacity: deletingId === item._id ? 0.5 : 1,
                            cursor: deletingId === item._id ? "not-allowed" : "pointer",
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}
    </>
  );
}