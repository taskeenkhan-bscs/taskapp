import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import Projectdetail from "../Compoment/Projectdetail.jsx";

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap');

  :root {
    --bg: #F3F5F8;
    --surface: #FFFFFF;
    --surface-alt: #F8FAFC;
    --border: #E2E8F0;
    --text: #0F172A;
    --text-muted: #64748B;
    --primary: #0D9488;
    --primary-dark: #0B7A70;
    --primary-soft: #E6FBF8;
    --danger: #DC2626;
    --danger-soft: #FEF2F2;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .pl-page {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text);
  }

  .pl-main {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
  }

  /* Header */

  .pl-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
  }

  .pl-header h1 {
    font-family: 'Sora', 'Inter', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    margin: 0;
  }

  .pl-header p {
    font-size: 13px;
    color: var(--text-muted);
    margin: 4px 0 0;
  }

  /* Add button */

  .pl-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    background: var(--primary);
    border: none;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
  }

  .pl-add-btn:hover {
    background: var(--primary-dark);
  }

  /* Table */

  .pl-table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  .pl-table-scroll {
    overflow-x: auto;
  }

  .pl-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .pl-table thead tr {
    background: var(--surface-alt);
    border-bottom: 1px solid var(--border);
  }

  .pl-table th {
    padding: 12px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  .pl-table tbody tr {
    border-bottom: 1px solid var(--surface-alt);
    transition: background 0.12s;
  }

  .pl-table tbody tr:last-child {
    border-bottom: none;
  }

  .pl-table tbody tr:hover {
    background: var(--surface-alt);
  }

  .pl-table td {
    padding: 13px 20px;
    vertical-align: middle;
    color: #374151;
  }

  .pl-td-title {
    font-weight: 600;
    color: var(--text);
    font-size: 13px;
  }

  .pl-td-muted {
    color: var(--text-muted);
    font-size: 13px;
  }

  /* Badge */

  .pl-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid;
  }

  .pl-badge-low {
    background: var(--primary-soft);
    color: var(--primary-dark);
    border-color: #99E6DC;
  }

  .pl-badge-medium {
    background: #fffbeb;
    color: #92400e;
    border-color: #fde68a;
  }

  .pl-badge-high {
    background: var(--danger-soft);
    color: var(--danger);
    border-color: #fecaca;
  }

  /* Image cell */

  .pl-tbl-img {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    object-fit: cover;
    border: 1px solid var(--border);
    display: block;
  }

  .pl-tbl-img-empty {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: var(--surface-alt);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }

  /* ─────────────────────────────────────────────
     Professional Action Buttons
  ───────────────────────────────────────────── */

  .act-btns {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    transition:
      all 0.2s ease,
      box-shadow 0.2s ease;
    padding: 0;
  }

  .icon-btn svg {
    width: 16px;
    height: 16px;
  }

  .icon-btn:hover {
    transform: translateY(-1px);
  }

  .icon-btn:active {
    transform: translateY(0);
  }

  /* Details */

  .icon-btn-details {
    color: #2563EB;
    background: #EFF6FF;
    border-color: #BFDBFE;
  }

  .icon-btn-details:hover {
    color: #1D4ED8;
    background: #DBEAFE;
    border-color: #93C5FD;
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.15);
  }

  /* Update */

  .icon-btn-update {
    color: #059669;
    background: #ECFDF5;
    border-color: #A7F3D0;
  }

  .icon-btn-update:hover {
    color: #047857;
    background: #D1FAE5;
    border-color: #6EE7B7;
    box-shadow: 0 3px 8px rgba(5, 150, 105, 0.15);
  }

  /* Delete */

  .icon-btn-delete {
    color: #DC2626;
    background: #FEF2F2;
    border-color: #FECACA;
  }

  .icon-btn-delete:hover {
    color: #B91C1C;
    background: #FEE2E2;
    border-color: #FCA5A5;
    box-shadow: 0 3px 8px rgba(220, 38, 38, 0.15);
  }

  .icon-btn:disabled {
    transform: none;
    box-shadow: none;
  }

  /* Loading */

  .pl-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6rem 0;
    color: var(--text-muted);
    font-size: 14px;
  }

  .pl-spin {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: pl-spin 0.7s linear infinite;
  }

  @keyframes pl-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Error */

  .pl-error {
    background: var(--danger-soft);
    border: 1px solid #fecaca;
    color: var(--danger);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 13px;
  }

  /* Empty */

  .pl-empty {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
  }

  .pl-empty a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
  }

  .pl-empty a:hover {
    text-decoration: underline;
  }

  /* Responsive */

  @media (max-width: 768px) {
    .pl-main {
      padding: 20px;
    }

    .pl-header {
      margin-bottom: 18px;
    }

    .pl-table th,
    .pl-table td {
      padding: 11px 14px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pl-spin,
    .icon-btn,
    .pl-add-btn {
      transition: none;
      animation: none;
    }
  }
`;

// ─────────────────────────────────────────────────────────────
// Eye Icon
// ─────────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Edit Icon
// ─────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Trash Icon
// ─────────────────────────────────────────────────────────────

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function priorityClass(p) {
  return p === "High"
    ? "pl-badge pl-badge-high"
    : p === "Medium"
      ? "pl-badge pl-badge-medium"
      : "pl-badge pl-badge-low";
}

function fmtDate(d) {
  if (!d) return "—";

  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────
// Project List
// ─────────────────────────────────────────────────────────────

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [visbabality, setvisibility] = useState(false);
  const [projecttdata, setprojectdata] = useState({});

  // Track which project is currently being deleted
  const [deletingId, setDeletingId] = useState(null);

  // ─────────────────────────────────────────────────────────
  // Get Projects
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function getProjects() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/projects`,
          {
            withCredentials: true,
          }
        );

        setProjects(res.data.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    getProjects();
  }, []);

  // ─────────────────────────────────────────────────────────
  // Delete Project
  // ─────────────────────────────────────────────────────────

async function deletebyid(id) {
  try {
    setDeletingId(id);
    setError("");

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/projects/delete`,
      { id },
      { withCredentials: true }   // 👈 YE LINE ADD KARO — isके bina cookie jaati nahi
    );

    console.log(res.data);

    setProjects((prev) => prev.filter((item) => item._id !== id));
  } catch (error) {
    console.log(error.response?.data || error.message);
    setError(
      error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to delete project"
    );
  } finally {
    setDeletingId(null);
  }
}

  // ─────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────

  return (
    <>
      <style>{styles}</style>

      <div className="pl-page">

        {/* Sidebar */}
        <Sidebar />

        {/* Project Details Modal */}
        {visbabality && (
          <Projectdetail
            setvisibility={setvisibility}
            project={projecttdata}
          />
        )}

        <div className="pl-main">

          {/* Header */}
          <div className="pl-header">
            <div>
              <h1>Projects</h1>
              <p>All your active projects in one place.</p>
            </div>

            <a
              href="/addproject"
              className="pl-add-btn"
            >
              + Add project
            </a>
          </div>

          {/* Loading */}
          {loading && (
            <div className="pl-loading">
              <div className="pl-spin" />
              Loading projects…
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="pl-error">
              ⚠️ {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="pl-table-wrap">

              <div className="pl-table-scroll">

                <table className="pl-table">

                  {/* Table Header */}
                  <thead>
                    <tr>
                      {[
                        "#",
                        "Title",
                        "Category",
                        "Priority",
                        "Deadline",
                        "Image",
                        "Action",
                      ].map((h) => (
                        <th key={h}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>

                    {projects.map((item, index) => (
                      <tr key={item._id}>

                        {/* Number */}
                        <td className="pl-td-muted">
                          {index + 1}
                        </td>

                        {/* Title */}
                        <td className="pl-td-title">
                          {item.title}
                        </td>

                        {/* Category */}
                        <td className="pl-td-muted">
                          {item.category}
                        </td>

                        {/* Priority */}
                        <td>
                          <span
                            className={priorityClass(
                              item.priority
                            )}
                          >
                            {item.priority}
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="pl-td-muted">
                          {fmtDate(item.deadline)}
                        </td>

                        {/* Image */}
                        <td>
                          {item.picture ? (
                            <img
                              src={item.picture}
                              alt="project"
                              className="pl-tbl-img"
                            />
                          ) : (
                            <div className="pl-tbl-img-empty">
                              📷
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="act-btns">

                            {/* Details */}
                            <button
                              type="button"
                              className="icon-btn icon-btn-details"
                              title="View project details"
                              aria-label="View project details"
                              onClick={() => {
                                setprojectdata(item);
                                setvisibility(true);
                              }}
                            >
                              <EyeIcon />
                            </button>

                            {/* Update */}
                            <button
                              type="button"
                              className="icon-btn icon-btn-update"
                              title="Update project"
                              aria-label="Update project"
                              onClick={() =>
                                navigate(
                                  `/update/${item._id}`
                                )
                              }
                            >
                              <EditIcon />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="icon-btn icon-btn-delete"
                              title={
                                deletingId === item._id
                                  ? "Deleting project..."
                                  : "Delete project"
                              }
                              aria-label="Delete project"
                              disabled={
                                deletingId === item._id
                              }
                              onClick={() =>
                                deletebyid(item._id)
                              }
                              style={{
                                opacity:
                                  deletingId === item._id
                                    ? 0.5
                                    : 1,
                                cursor:
                                  deletingId === item._id
                                    ? "not-allowed"
                                    : "pointer",
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

                {/* Empty */}
                {projects.length === 0 && (
                  <div className="pl-empty">
                    No projects yet.{" "}
                    <a href="/addproject">
                      Add your first one →
                    </a>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
