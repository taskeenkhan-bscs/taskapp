import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, AlertTriangle, Check } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../Compoment/Sidebar.jsx";

const REMOVE_ANIM_MS = 320; // must match .tl-card-leaving animation duration in CSS

function Tasklist({ projectId: projectIdProp, onStats }) {
  const { projectId: projectIdParam } = useParams();
  const projectId = projectIdProp || projectIdParam;
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const [removingIds, setRemovingIds] = useState(() => new Set());
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const completedTimerRef = useRef(null);

  const isCompleted = (t) => t.status === "Completed";

  const computeStats = (list) => {
    if (!onStats) return;
    const now = new Date();
    const counts = list.reduce(
      (acc, t) => {
        const done = isCompleted(t);
        if (done) acc.done++;
        if (t.status === "In Progress" || t.status === "Started") acc.inProgress++;
        if (t.deadline && !done && new Date(t.deadline) < now) {
          acc.overdue++;
        }
        return acc;
      },
      { done: 0, inProgress: 0, overdue: 0 }
    );
    onStats({ total: list.length, ...counts });
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const url = projectId
        ? `${import.meta.env.VITE_BACKEND_URL}/tasks/${projectId}`
        : `${import.meta.env.VITE_BACKEND_URL}/tasks`;

      const res = await axios.get(url, { withCredentials: true });
      // Only show not-yet-completed tasks in the active list
      const list = (res.data.tasks || []).filter((t) => !isCompleted(t));
      setTasks(list);
      computeStats(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
      if (onStats) onStats({ total: 0, done: 0, inProgress: 0, overdue: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    return () => clearTimeout(completedTimerRef.current);
  }, []);

  // ── Mark task as complete: patch "status" to "Completed", animate out,
  //    remove from list, then navigate to the Completed Tasks page ──
  const handleComplete = async (taskId) => {
    setActioningId(taskId);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/status/${taskId}`,
        { status: "Completed" },
        { withCredentials: true }
      );

      // DEBUG: check this log after clicking complete — confirm the backend
      // actually returned the task with status: "Completed". If this log
      // doesn't show that, the problem is backend-side.
      console.log("Complete task response:", res.data);

      toast.success("Task marked as complete");

      setJustCompletedId(taskId);
      setRemovingIds((prev) => new Set(prev).add(taskId));
      clearTimeout(completedTimerRef.current);

      completedTimerRef.current = setTimeout(() => {
        setJustCompletedId(null);
        setTasks((prev) => {
          const next = prev.filter((t) => t._id !== taskId);
          computeStats(next);
          return next;
        });
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        // Navigate to the Completed Tasks page, which will fetch fresh
        // data (including this task) from the backend on mount.
        navigate(projectId ? `/completedtask/${projectId}` : "/completedtask");
      }, REMOVE_ANIM_MS);
    } catch (err) {
      // Log the FULL error so you can see the real backend response
      // (status code, message, validation errors) instead of guessing.
      console.error("Error completing task:", err);
      console.error("Backend response:", err.response?.data);
      console.error("Status code:", err.response?.status);

      const backendMsg = err.response?.data?.message;
      toast.error(backendMsg || "Couldn't update task. Try again.");
    } finally {
      setActioningId(null);
    }
  };

  // ── Reject / Delete task ───────────────────────────────────────
  const askReject = (taskId, taskTitle) => {
    setConfirmTarget({ id: taskId, title: taskTitle });
  };

  const cancelReject = () => setConfirmTarget(null);

  const confirmReject = async () => {
    if (!confirmTarget) return;
    const { id: taskId } = confirmTarget;
    setConfirmTarget(null);
    setActioningId(taskId);

    setRemovingIds((prev) => new Set(prev).add(taskId));

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
        withCredentials: true,
      });

      setTimeout(() => {
        setTasks((prev) => {
          const next = prev.filter((t) => t._id !== taskId);
          computeStats(next);
          return next;
        });
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }, REMOVE_ANIM_MS);

      toast.success("Task rejected");
    } catch (err) {
      console.error("Error rejecting task:", err);
      toast.error("Couldn't delete task. Try again.");
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    } finally {
      setActioningId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dateStr, done) => {
    if (!dateStr || done) return false;
    return new Date(dateStr) < new Date();
  };

  const initials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const statusRailKey = (status) => {
    switch (status) {
      case "Completed":
        return "done";
      case "In Progress":
        return "progress";
      case "Started":
        return "started";
      default:
        return "pending";
    }
  };

  return (
    <>
      <div className="tl-layout">
        <Sidebar />
        <div className="tl-page">
          <header className="tl-header">
            <div>
              <p className="tl-eyebrow">Project workspace</p>
              <h1 className="tl-title">Tasks</h1>
            </div>
            <p className="tl-subtitle">
              {loading
                ? "Loading your work…"
                : `${tasks.length} task${tasks.length === 1 ? "" : "s"} total`}
            </p>
          </header>

          {loading && (
            <div className="tl-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="tl-card tl-skeleton" aria-hidden="true">
                  <div className="tl-skel-line tl-skel-title" />
                  <div className="tl-skel-line tl-skel-text" />
                  <div className="tl-skel-line tl-skel-text tl-skel-short" />
                  <div className="tl-skel-footer">
                    <div className="tl-skel-pill" />
                    <div className="tl-skel-pill" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="tl-state tl-state-error" role="alert">
              <div className="tl-state-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
              </div>
              <p className="tl-state-title">Couldn't load tasks</p>
              <p className="tl-state-body">{error}</p>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="tl-state">
              <div className="tl-state-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <path d="M9 12h6" />
                </svg>
              </div>
              <p className="tl-state-title">No tasks yet</p>
              <p className="tl-state-body">Tasks you create will show up here.</p>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="tl-grid">
              {tasks.map((t, idx) => {
                const done = isCompleted(t);
                const overdue = isOverdue(t.deadline, done);
                const isBusy = actioningId === t._id;
                const isLeaving = removingIds.has(t._id);
                const isJustCompleted = justCompletedId === t._id;
                const railKey = statusRailKey(t.status);
                const statusLabel = t.status || "Pending";

                const cardClass = [
                  "tl-card",
                  `tl-rail-${railKey}`,
                  isLeaving ? "tl-card-leaving" : "tl-card-entering",
                  isJustCompleted ? "tl-card-flash" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <article
                    key={t._id}
                    className={cardClass}
                    style={{ animationDelay: isLeaving ? "0ms" : `${Math.min(idx, 8) * 35}ms` }}
                  >
                    {isJustCompleted && (
                      <div className="tl-flash-badge" aria-hidden="true">
                        <Check size={15} strokeWidth={3} />
                        Completed
                      </div>
                    )}

                    <div className="tl-card-top">
                      <span className={`tl-priority tl-priority-${(t.priority || "medium").toLowerCase()}`}>
                        {t.priority}
                      </span>
                      <span className={`tl-status tl-status-${railKey}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <h2 className={`tl-card-title ${done ? "tl-card-title-done" : ""}`}>
                      {t.title}
                    </h2>

                    {t.description && <p className="tl-card-desc">{t.description}</p>}

                    <div className="tl-card-footer">
                      <div className="tl-meta-row">
                        {t.deadline ? (
                          <span className={`tl-deadline ${overdue ? "tl-deadline-overdue" : ""}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            {formatDate(t.deadline)}
                            {overdue && (
                              <span className="tl-overdue-tag">
                                <span className="tl-overdue-dot" />
                                Overdue
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="tl-deadline tl-deadline-none">No deadline</span>
                        )}

                        {t.assignedTo?.fullName && (
                          <span className="tl-assignee">
                            <span className="tl-avatar">{initials(t.assignedTo.fullName)}</span>
                            {t.assignedTo.fullName}
                          </span>
                        )}
                      </div>

                      <div className="tl-actions-row">
                        {t.createdAt && (
                          <span className="tl-created">Created {formatDate(t.createdAt)}</span>
                        )}

                        <div className="tl-actions">
                          <button
                            type="button"
                            className={`tl-icon-btn tl-icon-btn-complete ${done ? "tl-icon-btn-done" : ""}`}
                            title={done ? "Already completed" : "Mark as complete"}
                            disabled={isBusy || done || isLeaving}
                            onClick={() => handleComplete(t._id)}
                          >
                            {isBusy ? (
                              <Loader2 size={24} className="tl-spin" />
                            ) : (
                              <CheckCircle2 size={24} strokeWidth={2.25} />
                            )}
                          </button>

                          {/* <button
                            type="button"
                            className="tl-icon-btn tl-icon-btn-reject"
                            title="Reject / delete task"
                            disabled={isBusy || isLeaving}
                            onClick={() => askReject(t._id, t.title)}
                          >
                            {isBusy ? (
                              <Loader2 size={24} className="tl-spin" />
                            ) : (
                              <XCircle size={24} strokeWidth={2.25} />
                            )}
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {confirmTarget && (
        <div
          className="tl-modal-overlay"
          role="presentation"
          onClick={cancelReject}
        >
          <div
            className="tl-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="tl-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tl-modal-icon">
              <AlertTriangle size={18} />
            </div>
            <h3 id="tl-modal-title" className="tl-modal-title">Reject this task?</h3>
            <p className="tl-modal-body">
              "{confirmTarget.title || "This task"}" will be permanently deleted. This can't be undone.
            </p>
            <div className="tl-modal-actions">
              <button type="button" className="tl-btn tl-btn-ghost" onClick={cancelReject}>
                Cancel
              </button>
              <button type="button" className="tl-btn tl-btn-danger" onClick={confirmReject}>
                Delete task
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{styles}</style>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

.tl-layout {
  display: flex;
  min-height: 100vh;
  background: #F5F6F3;
}

.tl-page {
  --tl-ink: #171A21;
  --tl-muted: #676D7A;
  --tl-faint: #A6ABB5;
  --tl-line: #E6E7E4;
  --tl-surface: #FFFFFF;
  --tl-bg: #F5F6F3;
  --tl-accent: #2F6659;
  --tl-accent-soft: #E7F0EC;
  --tl-danger: #B71C1C;
  --tl-danger-soft: #FAE1E1;
  --tl-progress: #B5651D;
  --tl-progress-soft: #FBEEDD;
  --tl-started: #1D5FA6;
  --tl-started-soft: #E4EEFA;

  flex: 1;
  min-width: 0;
  padding: 28px 32px 48px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--tl-ink);
}

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--tl-line);
  flex-wrap: wrap;
}

.tl-eyebrow {
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tl-accent);
  margin: 0 0 6px;
}

.tl-title {
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--tl-ink);
  margin: 0;
}

.tl-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: var(--tl-muted);
  margin: 0;
  white-space: nowrap;
}

/* 3 cards per row on desktop, with bigger cards */
.tl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.tl-card {
  position: relative;
  background: var(--tl-surface);
  border: 1px solid var(--tl-line);
  border-radius: 16px;
  padding: 28px 28px 24px 30px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.tl-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: var(--tl-faint);
}

.tl-rail-pending::before { background: #A6ABB5; }
.tl-rail-started::before { background: var(--tl-started); }
.tl-rail-progress::before { background: var(--tl-progress); }
.tl-rail-done::before { background: var(--tl-accent); }

.tl-card:hover {
  border-color: #D6D8D3;
  box-shadow: 0 10px 28px rgba(23, 26, 33, 0.08);
  transform: translateY(-2px);
}

.tl-card-entering {
  animation: tl-card-enter 0.34s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.tl-card-leaving {
  animation: tl-card-leave 0.32s cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}

@keyframes tl-card-enter {
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes tl-card-leave {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.92) translateY(2px); }
}

.tl-card-flash {
  animation: tl-card-flash-ring 1.1s ease;
}

@keyframes tl-card-flash-ring {
  0% { box-shadow: 0 0 0 0 rgba(47, 102, 89, 0.35); }
  35% { box-shadow: 0 0 0 6px rgba(47, 102, 89, 0.12); }
  100% { box-shadow: 0 0 0 0 rgba(47, 102, 89, 0); }
}

.tl-flash-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--tl-accent);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 5px 10px 5px 7px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(47, 102, 89, 0.28);
  animation: tl-badge-pop 1.1s ease forwards;
  z-index: 2;
}

@keyframes tl-badge-pop {
  0% { opacity: 0; transform: scale(0.7) translateY(-4px); }
  15% { opacity: 1; transform: scale(1) translateY(0); }
  75% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.95) translateY(-2px); }
}

.tl-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tl-priority {
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
}

.tl-priority-low { background: #E9F3E9; color: #2E6E3A; }
.tl-priority-medium { background: #FBF1DE; color: #8C6412; }
.tl-priority-high { background: #FBE8DC; color: #A6470F; }
.tl-priority-urgent { background: #FAE1E1; color: #B71C1C; }

.tl-status {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.tl-status-pending { background: #F1F2F0; color: #565B65; border-color: #E4E5E1; }
.tl-status-started { background: var(--tl-started-soft); color: var(--tl-started); border-color: #CBDFF4; }
.tl-status-progress { background: var(--tl-progress-soft); color: var(--tl-progress); border-color: #F2DBBD; }
.tl-status-done { background: var(--tl-accent-soft); color: var(--tl-accent); border-color: #D5E6DE; }

.tl-card-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--tl-ink);
  margin: 0;
  line-height: 1.35;
  transition: color 0.25s ease;
}

.tl-card-title-done {
  color: var(--tl-muted);
  text-decoration: line-through;
  text-decoration-color: var(--tl-faint);
  text-decoration-thickness: 1.5px;
}

.tl-card-desc {
  font-size: 14px;
  color: var(--tl-muted);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tl-card-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #F0F1EE;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tl-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.tl-deadline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: var(--tl-muted);
  font-weight: 500;
}

.tl-deadline svg { flex-shrink: 0; color: var(--tl-faint); }
.tl-deadline-none { color: var(--tl-faint); font-style: italic; }
.tl-deadline-overdue { color: #B71C1C; }
.tl-deadline-overdue svg { color: #B71C1C; }

.tl-overdue-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #FAE1E1;
  color: #B71C1C;
  padding: 2px 8px 2px 7px;
  border-radius: 4px;
  margin-left: 2px;
}

.tl-overdue-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #B71C1C;
  animation: tl-pulse 1.6s ease-in-out infinite;
}

.tl-assignee {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  color: var(--tl-muted);
  font-weight: 500;
}

.tl-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--tl-ink);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tl-created {
  font-size: 12px;
  color: var(--tl-faint);
}

.tl-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tl-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.tl-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease,
    transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tl-icon-btn:active:not(:disabled) { transform: scale(0.9); }

.tl-icon-btn-complete {
  background: var(--tl-accent-soft);
  border-color: #CBE2D8;
  color: var(--tl-accent);
}
.tl-icon-btn-complete:hover:not(:disabled) {
  background: var(--tl-accent);
  border-color: var(--tl-accent);
  color: #fff;
  box-shadow: 0 6px 16px rgba(47, 102, 89, 0.32);
  transform: translateY(-2px);
}

.tl-icon-btn-done {
  background: var(--tl-accent);
  border-color: var(--tl-accent);
  color: #fff;
}

.tl-icon-btn-reject {
  background: var(--tl-danger-soft);
  border-color: #F4D4D4;
  color: var(--tl-danger);
}
.tl-icon-btn-reject:hover:not(:disabled) {
  background: var(--tl-danger);
  border-color: var(--tl-danger);
  color: #fff;
  box-shadow: 0 6px 16px rgba(183, 28, 28, 0.32);
  transform: translateY(-2px);
}

.tl-icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tl-spin {
  animation: tl-spin-anim 0.8s linear infinite;
}

@keyframes tl-spin-anim {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tl-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(23, 26, 33, 0.44);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
  animation: tl-overlay-in 0.18s ease;
}

@keyframes tl-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tl-modal {
  width: 100%;
  max-width: 360px;
  background: var(--tl-surface);
  border-radius: 14px;
  padding: 22px 22px 18px;
  box-shadow: 0 24px 60px rgba(23, 26, 33, 0.28);
  animation: tl-modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: "Inter", sans-serif;
}

@keyframes tl-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.tl-modal-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--tl-danger-soft);
  color: var(--tl-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.tl-modal-title {
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--tl-ink);
  margin: 0 0 6px;
}

.tl-modal-body {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--tl-muted);
  margin: 0 0 18px;
}

.tl-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.tl-btn {
  font-family: "Inter", sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 15px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}

.tl-btn:active { transform: scale(0.97); }

.tl-btn-ghost {
  background: var(--tl-surface);
  border-color: var(--tl-line);
  color: var(--tl-muted);
}
.tl-btn-ghost:hover { background: #F5F6F3; }

.tl-btn-danger {
  background: var(--tl-danger);
  color: #fff;
}
.tl-btn-danger:hover { background: #9C1818; }

.tl-state {
  text-align: center;
  padding: 72px 24px;
  background: var(--tl-surface);
  border: 1px dashed var(--tl-line);
  border-radius: 12px;
}

.tl-state-error { border-color: #F3CFCF; background: #FDF7F7; }

.tl-state-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F1F2F0;
  color: var(--tl-faint);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.tl-state-error .tl-state-icon { background: #FAE1E1; color: #B71C1C; }

.tl-state-title {
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: 15px;
  font-weight: 650;
  color: var(--tl-ink);
  margin: 0 0 4px;
}

.tl-state-body {
  font-size: 13.5px;
  color: var(--tl-muted);
  margin: 0;
}

.tl-skeleton { cursor: default; }
.tl-skeleton::before { background: var(--tl-line); }
.tl-skeleton:hover { transform: none; box-shadow: none; border-color: var(--tl-line); }

.tl-skel-line {
  background: linear-gradient(90deg, #ECEDEA 25%, #F5F6F3 50%, #ECEDEA 75%);
  background-size: 200% 100%;
  animation: tl-shimmer 1.4s ease-in-out infinite;
  border-radius: 5px;
  height: 12px;
}

.tl-skel-title { height: 17px; width: 70%; margin-bottom: 2px; }
.tl-skel-text { width: 100%; }
.tl-skel-short { width: 55%; }

.tl-skel-footer {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 14px;
  border-top: 1px solid #F0F1EE;
}

.tl-skel-pill {
  height: 24px;
  width: 78px;
  border-radius: 6px;
  background: linear-gradient(90deg, #ECEDEA 25%, #F5F6F3 50%, #ECEDEA 75%);
  background-size: 200% 100%;
  animation: tl-shimmer 1.4s ease-in-out infinite;
}

@keyframes tl-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes tl-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@media (prefers-reduced-motion: reduce) {
  .tl-skel-line, .tl-skel-pill, .tl-overdue-dot, .tl-spin,
  .tl-card-entering, .tl-card-leaving, .tl-card-flash, .tl-flash-badge,
  .tl-modal, .tl-modal-overlay {
    animation: none;
  }
  .tl-card { transition: none; }
}

@media (max-width: 1200px) {
  .tl-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .tl-page { padding: 20px 20px 40px; }
}

@media (max-width: 768px) {
  .tl-layout { flex-direction: column; }
}

@media (max-width: 600px) {
  .tl-grid { grid-template-columns: 1fr; }
  .tl-header { flex-direction: column; align-items: flex-start; gap: 6px; }
  .tl-title { font-size: 22px; }
  .tl-actions-row { flex-wrap: wrap; }
}
`;

export default Tasklist;