import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Compoment/Sidebar.jsx";

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

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .ap-page {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text);
  }

  .ap-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 56px 24px;
    overflow-y: auto;
  }

  .form-box {
    width: 100%;
    max-width: 560px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06);
    padding: 36px 40px 40px;
  }

  .form-header {
    margin-bottom: 20px;
    text-align: center;
  }

  .eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--primary);
    background: var(--primary-soft);
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 12px;
  }

  .form-header h2 {
    font-family: 'Sora', 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
  }

  .form-header p {
    margin-top: 6px;
    font-size: 14px;
    color: var(--text-muted);
  }

  /* ── Circular photo upload (top of form) ── */
  .photo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
  }

  .photo-circle-wrap {
    position: relative;
    width: 128px;
    height: 128px;
  }

  .photo-circle {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background: var(--primary-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .photo-circle:hover { transform: scale(1.02); }

  .photo-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-circle .placeholder-icon {
    width: 52px;
    height: 52px;
    color: #94A3B8;
  }

  .photo-edit-badge {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    border: 3px solid var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
  }

  .photo-caption {
    margin-top: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary);
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field + .field { margin-top: 14px; }

  .field label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }

  .field input,
  .field textarea,
  .field select {
    width: 100%;
    padding: 11px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    background: var(--surface-alt);
    color: var(--text);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }

  .field input::placeholder,
  .field textarea::placeholder { color: #A0AEC0; }

  .field textarea {
    height: 96px;
    resize: none;
  }

  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    border-color: var(--primary);
    background: var(--surface);
    box-shadow: 0 0 0 3px var(--primary-soft);
  }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .field-error {
    font-size: 11px;
    color: var(--danger);
    text-align: center;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .banner {
    font-size: 13px;
    font-weight: 500;
    padding: 10px 14px;
    border-radius: 8px;
    text-align: center;
  }

  .success-msg {
    background: var(--primary-soft);
    color: var(--primary-dark);
    border: 1px solid #99E6DC;
  }

  .error-msg {
    background: var(--danger-soft);
    color: var(--danger);
    border: 1px solid #FCA5A5;
  }

  .submit-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .submit-btn:hover:not(:disabled) { background: var(--primary-dark); }

  .submit-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .ap-page { flex-direction: column; }
    .ap-content { padding: 24px 16px; }
    .form-box { padding: 28px 20px 32px; }
    .field-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .photo-circle, .submit-btn, .spinner { transition: none; animation: none; }
  }
`;

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function ImagePlaceholderIcon() {
  return (
    <svg
      className="placeholder-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default function AddProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    deadline: "",
    picture: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccess] = useState("");
  const [errorMsg, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  // create a preview URL whenever a project image is picked, revoke the old one
  useEffect(() => {
    if (formData.picture instanceof File) {
      const url = URL.createObjectURL(formData.picture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [formData.picture]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePictureChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, picture: "Only JPG, PNG, or WEBP allowed" }));
      return;
    }
    if (file.size > MAX_SIZE) {
      setFieldErrors((prev) => ({ ...prev, picture: "Max file size is 5MB" }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, picture: undefined }));
    setFormData((prev) => ({ ...prev, picture: file }));
  }

  async function handleSubmit() {
    if (!formData.title || !formData.category || !formData.priority) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/projects/createform`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success === true) {
        setSuccess("Project added successfully!");
        navigate("/projectlist");
      } else {
        setError(res.data.message || "Failed to add project. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="ap-page">
        <Sidebar />

        <div className="ap-content">
          <div className="form-box">
            <div className="form-header">
              <span className="eyebrow">Projects</span>
              <h2>Add Project</h2>
              <p>Set the details and classification for a new project.</p>
            </div>

            {/* Circular photo upload */}
            <div className="photo-section">
              <div className="photo-circle-wrap">
                <div
                  className="photo-circle"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Project" />
                  ) : (
                    <ImagePlaceholderIcon />
                  )}
                </div>
                <div
                  className="photo-edit-badge"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label="Add project photo"
                >
                  ✏️
                </div>
                <input
                  ref={fileInputRef}
                  id="pictureInput"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePictureChange}
                  className="visually-hidden"
                />
              </div>
              <span className="photo-caption">
                {formData.picture ? "Click to change photo" : "Click to add a photo"}
              </span>
              {fieldErrors.picture && (
                <span className="field-error">⚠ {fieldErrors.picture}</span>
              )}
            </div>

            <div className="form-body">
              {successMsg && <div className="banner success-msg">✓ {successMsg}</div>}
              {errorMsg && <div className="banner error-msg">⚠ {errorMsg}</div>}

              <div className="section">
                <span className="section-label">Details</span>

                <div className="field">
                  <label htmlFor="title">Title *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Project title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Project description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="section">
                <span className="section-label">Classification</span>

                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="category">Category *</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange}>
                      <option value="">Select category</option>
                      <option value="App">App</option>
                      <option value="Web">Web</option>
                      <option value="Game">Game</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="priority">Priority *</label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                      <option value="">Select priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="field" style={{ marginTop: "14px" }}>
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Adding project…
                  </>
                ) : (
                  "Add project"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}