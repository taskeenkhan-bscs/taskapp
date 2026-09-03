import React, { useEffect, useRef, useState } from "react";
import Taskgives from "./Taskgives.jsx"

const STATUS_COLORS = {
  active: { bg: "#dcfce7", color: "#15803d" },
  "in progress": { bg: "#dbeafe", color: "#1d4ed8" },
  "on hold": { bg: "#fef3c7", color: "#b45309" },
  blocked: { bg: "#fee2e2", color: "#dc2626" },
  done: { bg: "#f1f5f9", color: "#475569" },
  completed: { bg: "#f1f5f9", color: "#475569" },
};

const PRIORITY_COLORS = {
  high: { bg: "#fee2e2", color: "#dc2626" },
  medium: { bg: "#fef3c7", color: "#b45309" },
  low: { bg: "#f1f5f9", color: "#64748b" },
};

function getInitials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getColorFor(map, value, fallback) {
  if (!value) return fallback;
  return map[value.toLowerCase()] || fallback;
}

function Projectdetail({ project, setvisibility }) {
  const closeRef = useRef(null);


  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (!project) return;
    closeRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === "Escape") setvisibility(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [project, setvisibility]);

  if (!project) return null;

  const statusStyle = getColorFor(STATUS_COLORS, project.status, {
    bg: "#f1f5f9",
    color: "#475569",
  });
  const priorityStyle = getColorFor(PRIORITY_COLORS, project.priority, {
    bg: "#f1f5f9",
    color: "#475569",
  });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setvisibility(false);
  };

  return (
    <>
      <style>{styles}</style>

      <div className="pd-overlay" onMouseDown={handleOverlayClick}>
        <div
          className="pd-card"
          style={{ "--priority-color": priorityStyle.color }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pd-title"
        >
          <div className="pd-actions">
            <button
              onClick={() => setShowTaskForm(true)}
              className="add-task-btn"
            >
              Create Task
            </button>

            <button
              ref={closeRef}
              className="pd-close"
              onClick={() => setvisibility(false)}
              aria-label="Close project details"
            >
              ✕
            </button>

          </div>



        {showTaskForm && (
  <Taskgives
    setShowTaskForm={setShowTaskForm}
    project={project} 
  />
)}



          <div className="pd-header">
            {project.picture && (
              <img src={project.picture} alt="" className="pd-image" />
            )}

            <div className="pd-header-text">
              <h1 className="pd-title" id="pd-title">
                {project.title}
              </h1>

              <p className="pd-category">{project.category}</p>

              <div className="pd-badges">
                <span
                  className="pd-badge"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  <span
                    className="pd-dot"
                    style={{ background: statusStyle.color }}
                  />
                  {project.status}
                </span>

                {project.priority && (
                  <span
                    className="pd-badge"
                    style={{
                      background: priorityStyle.bg,
                      color: priorityStyle.color,
                    }}
                  >
                    {project.priority} priority
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pd-body">
            <div className="pd-section">
              <h3>Description</h3>
              <p>{project.description}</p>
            </div>

            <div className="pd-grid-row">
              <div className="pd-section">
                <h3>Deadline</h3>
                <p className="pd-meta-value">
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>

              {project.member && (
                <div className="pd-section">
                  <h3>Assigned member</h3>

                  <div className="pd-member">
                    <div className="pd-avatar">
                      {getInitials(project.member.fullName)}
                    </div>
                    <div className="pd-member-name">
                      {project.member.fullName}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
.pd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 16px;
  animation: pdFadeIn 0.25s ease-out;
}

@keyframes pdFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.pd-card {
  position: relative;
  width: 100%;
  max-width: 920px;
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 24px;
  border-left: 6px solid var(--priority-color, #94a3b8);
  box-shadow:
    0 40px 80px rgba(15, 23, 42, 0.28),
    0 16px 32px rgba(15, 23, 42, 0.16),
    0 0 1px rgba(15, 23, 42, 0.08);
  animation: pdModalShow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pdModalShow {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pd-card::-webkit-scrollbar {
  width: 8px;
}

.pd-card::-webkit-scrollbar-track {
  background: transparent;
}

.pd-card::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}

.pd-card::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.pd-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
  gap: 16px;
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.24);
}

.add-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.32);
}

.add-task-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.24);
}

.add-task-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.add-task-icon {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.pd-close {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: #f3f4f6;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.pd-close:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.32);
}

.pd-close:active {
  transform: rotate(90deg) scale(0.96);
}

.pd-close:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pd-header {
  padding: 36px 40px 28px;
  display: flex;
  gap: 28px;
  align-items: flex-start;
  border-bottom: 1px solid #e5e7eb;
}

.pd-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
}

.pd-header-text {
  min-width: 0;
  flex: 1;
}

.pd-title {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #111827;
}

.pd-category {
  margin: 8px 0 18px;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
}

.pd-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pd-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.pd-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.pd-body {
  padding: 36px 40px;
}

.pd-section {
  margin-bottom: 32px;
}

.pd-section:last-child {
  margin-bottom: 0;
}

.pd-section h3 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin: 0 0 14px;
  font-weight: 700;
}

.pd-section p {
  color: #374151;
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

.pd-meta-value {
  font-weight: 700;
  color: #111827;
  font-size: 16px;
}

.pd-grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.pd-grid-row .pd-section {
  margin-bottom: 0;
}

.pd-member {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 14px 18px;
  border-radius: 14px;
  transition: all 0.2s ease;
}

.pd-member:hover {
  background: #ffffff;
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.pd-member-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.pd-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.24);
}

@media (prefers-reduced-motion: reduce) {
  .pd-overlay,
  .pd-card {
    animation: none;
  }
}

@media (max-width: 768px) {
  .pd-overlay {
    padding: 12px;
  }

  .pd-card {
    max-width: 100%;
    border-left: none;
    border-top: 6px solid var(--priority-color, #94a3b8);
    border-radius: 20px 20px 20px 20px;
  }

  .pd-header {
    flex-direction: column;
    padding: 28px 28px 24px;
    text-align: center;
    align-items: center;
    gap: 20px;
  }

  .pd-image {
    width: 100px;
    height: 100px;
  }

  .pd-title {
    font-size: 26px;
  }

  .pd-badges {
    justify-content: center;
  }

  .pd-body {
    padding: 28px 24px;
  }

  .pd-actions {
    padding: 16px 20px;
  }

  .pd-grid-row {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .add-task-btn {
    font-size: 13px;
    padding: 10px 18px;
  }

  .add-task-icon {
    font-size: 16px;
  }

  .pd-close {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .pd-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .pd-card {
    max-height: 92vh;
    border-radius: 24px 24px 0 0;
  }

  .pd-header {
    padding: 24px 20px 20px;
  }

  .pd-body {
    padding: 20px;
  }

  .pd-actions {
    padding: 14px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .add-task-btn {
    width: 100%;
    justify-content: center;
  }

  .pd-section h3 {
    font-size: 11px;
  }

  .pd-title {
    font-size: 22px;
  }
}
`;

export default Projectdetail;