import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const priorityMap = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusMap = {
  pending: "Pending",
  started: "Started",
  inprogress: "In Progress",
  completed: "Completed",
};

function Taskgives({ setShowTaskForm, project, onTaskCreate = () => {} }) {
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    deadline: "",
    assignedTo: "",
  });

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    try {
      setMembersLoading(true);
      setMembersError(false);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/members/`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setMembers(res.data.data || res.data.members || []);
      } else {
        setMembersError(true);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembersError(true);
    } finally {
      setMembersLoading(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      setShowTaskForm(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!task.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (task.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (task.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!task.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!task.status) {
      newErrors.status = "Status is required";
    }

    if (task.deadline && new Date(task.deadline) < new Date()) {
      newErrors.deadline = "Deadline cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!project?._id) {
      setErrors({ submit: "Project id is missing — cannot create a task." });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      const taskData = {
        title: task.title.trim(),
        description: task.description.trim(),
        priority: priorityMap[task.priority] || task.priority,
        status: statusMap[task.status] || task.status,
        deadline: task.deadline || null,
        projectId: project._id,
        assignedTo: task.assignedTo || null,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/add`,
        taskData
      );

      onTaskCreate(res.data.task);
      setShowTaskForm(false);
      navigate(`/tasklist/${project._id}`);
    } catch (error) {
      console.error("Error creating task:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to create task. Please try again.";
      setErrors((prev) => ({ ...prev, submit: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!project) return null;

  return (
    <>
      <div className="tc-overlay" onMouseDown={handleOverlayClick}>
        <div className="tc-modal" role="dialog" aria-modal="true">
          <div className="tc-header">
            <h2 className="tc-title">Create new task</h2>
            <button
              className="tc-close"
              onClick={() => setShowTaskForm(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="tc-project-info">
            <span className="tc-project-label">Project</span>
            <span className="tc-project-name">{project.title}</span>
          </div>

          <form onSubmit={handleSubmit} className="tc-form">
            {/* Title */}
            <div className="tc-input-group">
              <label htmlFor="task-title" className="tc-label">
                Task Title <span className="tc-required">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                placeholder="e.g., Design login flow"
                className={`tc-input ${errors.title ? "tc-error" : ""}`}
              />
              {errors.title && <span className="tc-error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="tc-input-group">
              <label htmlFor="task-description" className="tc-label">
                Description
              </label>
              <textarea
                id="task-description"
                name="description"
                value={task.description}
                onChange={handleChange}
                placeholder="Add details about this task..."
                className="tc-textarea"
              />
            </div>

            {/* Priority, Status & Assign To */}
            <div className="tc-row tc-row-3">
              <div className="tc-input-group">
                <label htmlFor="task-priority" className="tc-label">
                  Priority <span className="tc-required">*</span>
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className={`tc-select ${errors.priority ? "tc-error" : ""}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <span className="tc-error-msg">{errors.priority}</span>
                )}
              </div>

              <div className="tc-input-group">
                <label htmlFor="task-status" className="tc-label">
                  Status <span className="tc-required">*</span>
                </label>
                <select
                  id="task-status"
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className={`tc-select ${errors.status ? "tc-error" : ""}`}
                >
                  <option value="pending">Pending</option>
                  <option value="started">Started</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <span className="tc-error-msg">{errors.status}</span>
                )}
              </div>

              <div className="tc-input-group">
                <label htmlFor="task-assign" className="tc-label">
                  Assign to
                </label>
                <select
                  id="task-assign"
                  name="assignedTo"
                  value={task.assignedTo}
                  onChange={handleChange}
                  className="tc-select"
                  disabled={membersLoading}
                >
                  <option value="">
                    {membersLoading ? "Loading members…" : "Unassigned"}
                  </option>
                  {!membersLoading &&
                    !membersError &&
                    members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.fullName}
                      </option>
                    ))}
                </select>
                {membersError && (
                  <span className="tc-error-msg">
                    Couldn't load members.{" "}
                    <button
                      type="button"
                      onClick={getMembers}
                      className="tc-inline-retry"
                    >
                      Retry
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="tc-input-group">
              <label htmlFor="task-deadline" className="tc-label">
                Deadline
              </label>
              <input
                id="task-deadline"
                type="date"
                name="deadline"
                value={task.deadline}
                onChange={handleChange}
                className={`tc-input ${errors.deadline ? "tc-error" : ""}`}
              />
              {errors.deadline && (
                <span className="tc-error-msg">{errors.deadline}</span>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && <div className="tc-submit-error">{errors.submit}</div>}

            {/* Actions */}
            <div className="tc-actions">
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="tc-btn tc-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="tc-btn tc-btn-primary"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
.tc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: 16px;
  animation: tcOverlayFade 0.25s ease-out;
}

@keyframes tcOverlayFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tc-modal {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow:
    0 40px 80px rgba(15, 23, 42, 0.28),
    0 16px 32px rgba(15, 23, 42, 0.16);
  animation: tcModalSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes tcModalSlide {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.tc-modal::-webkit-scrollbar { width: 8px; }
.tc-modal::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 8px; }

.tc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
}

.tc-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #111827;
}

.tc-close {
  width: 40px;
  height: 40px;
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
  flex-shrink: 0;
}

.tc-close:hover { background: #ef4444; color: white; transform: rotate(90deg); }
.tc-close:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

.tc-project-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
  margin: 0;
}

.tc-project-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  font-weight: 700;
}

.tc-project-name { font-size: 15px; font-weight: 600; color: #1d4ed8; }

.tc-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 32px;
}

.tc-input-group { display: flex; flex-direction: column; gap: 8px; }

.tc-label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #374151;
}

.tc-required { color: #dc2626; }

.tc-input, .tc-select, .tc-textarea {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  background: #ffffff;
  transition: all 0.2s ease;
}

.tc-input:focus, .tc-select:focus, .tc-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #ffffff;
}

.tc-input.tc-error, .tc-select.tc-error, .tc-textarea.tc-error { border-color: #dc2626; }
.tc-input.tc-error:focus, .tc-select.tc-error:focus, .tc-textarea.tc-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.tc-input::placeholder { color: #9ca3af; }

.tc-textarea { min-height: 140px; resize: vertical; line-height: 1.6; }

.tc-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7280' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.tc-select:disabled { cursor: not-allowed; opacity: 0.7; }

.tc-error-msg { font-size: 12px; color: #dc2626; font-weight: 600; }

.tc-inline-retry {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  text-decoration: underline;
}

.tc-submit-error {
  padding: 12px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 13px;
  color: #dc2626;
  font-weight: 600;
}

.tc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.tc-row-3 { grid-template-columns: 1fr 1fr 1fr; }

.tc-actions { display: flex; gap: 12px; margin-top: 8px; }

.tc-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  flex: 1;
  text-align: center;
}

.tc-btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.24);
}

.tc-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.32);
}

.tc-btn-primary:active:not(:disabled) { transform: translateY(0); }
.tc-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.tc-btn-secondary { background: #f3f4f6; color: #111827; border: 1px solid #e5e7eb; }
.tc-btn-secondary:hover { background: #e5e7eb; border-color: #d1d5db; }
.tc-btn-secondary:active { background: #d1d5db; }

@media (prefers-reduced-motion: reduce) {
  .tc-overlay, .tc-modal { animation: none; }
}

@media (max-width: 640px) {
  .tc-modal { max-width: 100%; border-radius: 20px; }
  .tc-header { padding: 20px; }
  .tc-form { padding: 20px; gap: 16px; }
  .tc-project-info { padding: 12px 20px; }
  .tc-row, .tc-row-3 { grid-template-columns: 1fr; gap: 12px; }
  .tc-title { font-size: 19px; }
  .tc-actions { flex-direction: column; }
}

@media (max-width: 480px) {
  .tc-overlay { padding: 0; align-items: flex-end; }
  .tc-modal { max-height: 92vh; border-radius: 20px 20px 0 0; }
  .tc-header { padding: 18px 16px; }
  .tc-form { padding: 16px; }
  .tc-title { font-size: 18px; }
  .tc-close { width: 36px; height: 36px; font-size: 16px; }
}
`;

export default Taskgives;