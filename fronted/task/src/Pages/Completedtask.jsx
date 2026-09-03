import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../Compoment/Sidebar.jsx";

function Completedtask() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [removingIds, setRemovingIds] = useState(() => new Set());

  const fetchCompleted = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Always pull from the all-tasks endpoint so every completed task
      // shows here, regardless of which project the user came from.
      const url = `${import.meta.env.VITE_BACKEND_URL}/tasks`;

      const res = await axios.get(url, {
        withCredentials: true,
        // Cache-busting: prevents the browser from serving a stale
        // 304 Not Modified response after a task's status changes.
        params: { _t: Date.now() },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const list = (res.data.tasks || []).filter((t) => {
        const status = (t.status || "").toLowerCase();
        return status === "done" || status === "completed";
      });

      setTasks(list);
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
      setError("Failed to load completed tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompleted();
  }, [fetchCompleted]);

  const handleRestore = async (taskId) => {
    setActioningId(taskId);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/status/${taskId}`,
        { status: "Todo" },
        { withCredentials: true }
      );
      toast.success("Task restored");
      setRemovingIds((prev) => new Set(prev).add(taskId));

      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }, 260);
    } catch (err) {
      console.error("Error restoring task:", err);
      toast.error("Couldn't restore task. Try again.");
    } finally {
      setActioningId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const initials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <>
      <div className="ct-layout">
        <Sidebar />
        <div className="ct-page">
          <header className="ct-header">
            <button type="button" className="ct-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="ct-header-main">
              <p className="ct-eyebrow">Project workspace</p>
              <h1 className="ct-title">Completed Tasks</h1>
            </div>
            <p className="ct-subtitle">
              {loading ? "Loading…" : `${tasks.length} task${tasks.length === 1 ? "" : "s"} completed`}
            </p>
          </header>

          {loading && (
            <div className="ct-table-wrap">
              <div className="ct-skel-table">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="ct-skel-row" aria-hidden="true">
                    <div className="ct-skel-line ct-skel-title" />
                    <div className="ct-skel-line ct-skel-short" />
                    <div className="ct-skel-line ct-skel-short" />
                    <div className="ct-skel-line ct-skel-short" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="ct-state ct-state-error" role="alert">
              <div className="ct-state-icon"><AlertTriangle size={18} /></div>
              <p className="ct-state-title">Couldn't load completed tasks</p>
              <p className="ct-state-body">{error}</p>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="ct-state">
              <div className="ct-state-icon"><CheckCircle2 size={18} /></div>
              <p className="ct-state-title">Nothing completed yet</p>
              <p className="ct-state-body">Tasks you finish will show up here.</p>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="ct-table-wrap">
              <div className="ct-table-scroll">
                <table className="ct-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Priority</th>
                      <th>Assignee</th>
                      <th>Completed on</th>
                      <th className="ct-th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => {
                      const isBusy = actioningId === t._id;
                      const isLeaving = removingIds.has(t._id);

                      return (
                        <tr
                          key={t._id}
                          className={isLeaving ? "ct-row-leaving" : "ct-row-entering"}
                        >
                          <td className="ct-td-task">
                            <span className="ct-done-badge">
                              <CheckCircle2 size={12} strokeWidth={2.5} />
                              Done
                            </span>
                            <div className="ct-task-copy">
                              <span className="ct-task-title">{t.title}</span>
                              {t.description && (
                                <span className="ct-task-desc">{t.description}</span>
                              )}
                            </div>
                          </td>

                          <td>
                            {t.priority ? (
                              <span className={`ct-priority ct-priority-${t.priority.toLowerCase()}`}>
                                {t.priority}
                              </span>
                            ) : (
                              <span className="ct-td-muted">—</span>
                            )}
                          </td>

                          <td>
                            {t.assignedTo?.fullName ? (
                              <span className="ct-assignee">
                                <span className="ct-avatar">{initials(t.assignedTo.fullName)}</span>
                                {t.assignedTo.fullName}
                              </span>
                            ) : (
                              <span className="ct-td-muted">Unassigned</span>
                            )}
                          </td>

                          <td className="ct-td-muted">{formatDate(t.updatedAt)}</td>

                          <td>
                            <div className="ct-actions">
                              <button
                                type="button"
                                className="ct-icon-btn ct-icon-btn-restore"
                                title="Restore to Todo"
                                disabled={isBusy || isLeaving}
                                onClick={() => handleRestore(t._id)}
                              >
                                {isBusy ? (
                                  <Loader2 size={17} className="ct-spin" />
                                ) : (
                                  <RotateCcw size={17} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
.ct-layout { display: flex; min-height: 100vh; background: #F5F6F3; }

.ct-page {
  --ct-ink: #171A21; --ct-muted: #676D7A; --ct-faint: #A6ABB5;
  --ct-line: #E6E7E4; --ct-surface: #FFFFFF; --ct-accent: #2F6659;
  --ct-accent-soft: #E7F0EC; --ct-danger: #B71C1C; --ct-danger-soft: #FAE1E1;
  flex: 1; min-width: 0; padding: 28px 32px 48px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ct-ink);
}

.ct-header {
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
  padding-bottom: 20px; border-bottom: 1px solid var(--ct-line); flex-wrap: wrap;
}
.ct-header-main { flex: 1; }
.ct-back {
  display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600;
  color: var(--ct-muted); background: var(--ct-surface); border: 1px solid var(--ct-line);
  border-radius: 8px; padding: 8px 12px; cursor: pointer; transition: background 0.15s ease;
}
.ct-back:hover { background: #F5F6F3; }

.ct-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ct-accent); margin: 0 0 6px;
}
.ct-title { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
.ct-subtitle { font-size: 13px; font-weight: 500; color: var(--ct-muted); margin: 0; white-space: nowrap; }

/* ── Table ─────────────────────────────────────────────────── */

.ct-table-wrap {
  background: var(--ct-surface);
  border: 1px solid var(--ct-line);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(23, 26, 33, 0.04);
}

.ct-table-scroll { overflow-x: auto; }

.ct-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.ct-table thead tr {
  background: #FAFAF8;
  border-bottom: 1px solid var(--ct-line);
}

.ct-table th {
  padding: 13px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--ct-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.ct-th-actions { text-align: right; }

.ct-table tbody tr {
  border-bottom: 1px solid #F0F1EE;
  transition: background 0.15s ease, opacity 0.28s ease, transform 0.28s ease;
}
.ct-table tbody tr:last-child { border-bottom: none; }
.ct-table tbody tr:hover { background: #FAFAF8; }

.ct-row-entering { animation: ct-row-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
.ct-row-leaving { animation: ct-row-leave 0.26s cubic-bezier(0.4, 0, 1, 1) forwards; pointer-events: none; }
@keyframes ct-row-enter { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes ct-row-leave { to { opacity: 0; transform: scale(0.98); } }

.ct-table td {
  padding: 14px 20px;
  vertical-align: middle;
  color: #374151;
}

.ct-td-task {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 260px;
}

.ct-task-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ct-task-title {
  font-weight: 650;
  color: var(--ct-muted);
  text-decoration: line-through;
  text-decoration-color: var(--ct-faint);
  font-size: 14px;
}

.ct-task-desc {
  font-size: 12.5px;
  color: var(--ct-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 360px;
}

.ct-done-badge {
  display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700;
  background: var(--ct-accent-soft); color: var(--ct-accent); padding: 3px 8px; border-radius: 5px;
  flex-shrink: 0;
  margin-top: 2px;
  white-space: nowrap;
}

.ct-priority {
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 5px; background: #F1F2F0; color: var(--ct-muted);
  display: inline-block;
}
.ct-priority-low { background: #E9F3E9; color: #2E6E3A; }
.ct-priority-medium { background: #FBF1DE; color: #8C6412; }
.ct-priority-high { background: #FBE8DC; color: #A6470F; }
.ct-priority-urgent { background: #FAE1E1; color: #B71C1C; }

.ct-assignee { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: var(--ct-muted); font-weight: 500; }
.ct-avatar {
  width: 22px; height: 22px; border-radius: 50%; background: var(--ct-ink); color: #fff;
  font-size: 9.5px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.ct-td-muted { color: var(--ct-faint); font-size: 13px; }

.ct-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.ct-icon-btn {
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
  border-radius: 10px; border: 1.5px solid transparent; cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;
}
.ct-icon-btn:active:not(:disabled) { transform: scale(0.9); }
.ct-icon-btn-restore { background: var(--ct-accent-soft); border-color: #CBE2D8; color: var(--ct-accent); }
.ct-icon-btn-restore:hover:not(:disabled) { background: var(--ct-accent); border-color: var(--ct-accent); color: #fff; }
.ct-icon-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

.ct-spin { animation: ct-spin-anim 0.8s linear infinite; }
@keyframes ct-spin-anim { to { transform: rotate(360deg); } }

/* ── States ────────────────────────────────────────────────── */

.ct-state { text-align: center; padding: 72px 24px; background: var(--ct-surface); border: 1px dashed var(--ct-line); border-radius: 12px; }
.ct-state-error { border-color: #F3CFCF; background: #FDF7F7; }
.ct-state-icon {
  width: 36px; height: 36px; border-radius: 50%; background: #F1F2F0; color: var(--ct-faint);
  display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
}
.ct-state-error .ct-state-icon { background: #FAE1E1; color: #B71C1C; }
.ct-state-title { font-size: 15px; font-weight: 650; margin: 0 0 4px; }
.ct-state-body { font-size: 13.5px; color: var(--ct-muted); margin: 0; }

/* ── Skeleton ──────────────────────────────────────────────── */

.ct-skel-table {
  background: var(--ct-surface);
  border-radius: 16px;
  padding: 8px 20px;
}
.ct-skel-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #F0F1EE;
}
.ct-skel-row:last-child { border-bottom: none; }
.ct-skel-line {
  background: linear-gradient(90deg, #ECEDEA 25%, #F5F6F3 50%, #ECEDEA 75%);
  background-size: 200% 100%; animation: ct-shimmer 1.4s ease-in-out infinite; border-radius: 5px; height: 11px;
}
.ct-skel-title { height: 15px; }
.ct-skel-short { width: 70%; }
@keyframes ct-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (prefers-reduced-motion: reduce) {
  .ct-skel-line, .ct-spin, .ct-row-entering, .ct-row-leaving { animation: none; }
}

@media (max-width: 900px) {
  .ct-page { padding: 20px 20px 40px; }
  .ct-task-desc { max-width: 220px; }
}

@media (max-width: 768px) {
  .ct-layout { flex-direction: column; }
}

@media (max-width: 600px) {
  .ct-header { flex-direction: column; align-items: flex-start; }
  .ct-td-task { min-width: 200px; }
  .ct-task-desc { display: none; }
  .ct-table th, .ct-table td { padding: 11px 14px; }
}
`;

export default Completedtask;