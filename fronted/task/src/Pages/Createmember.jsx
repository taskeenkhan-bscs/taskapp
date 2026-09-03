import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";

// Inline default avatar (no external network dependency, no broken-image flash)
const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r="48" fill="#E2E8F0"/>
      <circle cx="48" cy="38" r="18" fill="#94A3B8"/>
      <path d="M14 88c4-20 20-30 34-30s30 10 34 30" fill="#94A3B8"/>
    </svg>
  `);

function CreateMember() {
  // FIX: useNavigate() ko navigate naam diya hai
  const navigate = useNavigate();

  const [member, setMember] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    role: "",
    profilePicture: "",
  });

  // temporary blob URL for the selected file
  const [previewUrl, setPreviewUrl] = useState(null);

  // idle | loading | success | error
  const [status, setStatus] = useState({
    state: "idle",
    message: "",
  });

  const handleChange = (e) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      state: "loading",
      message: "",
    });

    try {
      const formData = new FormData();

      formData.append("fullName", member.fullName);
      formData.append("email", member.email);
      formData.append("phoneNo", member.phoneNo);
      formData.append("role", member.role);

      if (member.profilePicture) {
        formData.append("profilePicture", member.profilePicture);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/members/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", res.data);

      // SUCCESS => Navigate to Membershowpage
      if (res.data.success === true) {
        setStatus({
          state: "success",
          message: "Member created successfully.",
        });

        // Clear form
        setMember({
          fullName: "",
          email: "",
          phoneNo: "",
          role: "",
          profilePicture: "",
        });

        // Navigate after successful creation
        navigate("/Membershowpage");
      } else {
        setStatus({
          state: "error",
          message:
            res.data.message || "Member creation failed.",
        });
      }
    } catch (error) {
      console.log("Create member error:", error);

      setStatus({
        state: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  // create a preview URL whenever a file is picked, and revoke the old one
  useEffect(() => {
    if (member.profilePicture instanceof File) {
      const url = URL.createObjectURL(member.profilePicture);

      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(null);
  }, [member.profilePicture]);

  // clear a success banner automatically after a few seconds
  useEffect(() => {
    if (status.state === "success") {
      const t = setTimeout(
        () => setStatus({ state: "idle", message: "" }),
        3500
      );

      return () => clearTimeout(t);
    }
  }, [status.state]);

  const avatarSrc =
    member.profilePicture instanceof File
      ? previewUrl
      : DEFAULT_AVATAR;

  // Tumhari remaining JSX yahan same rahegi
  // ...

  return (
    <div className="layout">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="main">
        <div className="card">
          <div className="card-header">
            <span className="eyebrow">Team Management</span>
            <h1>Create Member</h1>
            <p className="subtitle">Add a new member and set their role and photo.</p>
          </div>

          <form onSubmit={handleSubmit} className="form" noValidate>
            {/* Avatar */}
            <div className="avatar-section">
              <label htmlFor="profilePicInput" className="avatar-wrap">
                <img src={avatarSrc} alt="Profile" className="avatar-img" />
                <span className="avatar-badge" aria-hidden="true">✎</span>
              </label>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setMember({ ...member, profilePicture: e.target.files[0] })
                }
                className="visually-hidden"
              />
              <span className="avatar-hint">Click to add a photo</span>
            </div>

            {/* Identity */}
            <div className="section">
              <span className="section-label">Identity</span>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={member.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="role">Role</label>
                  <select id="role" name="role" value={member.role} onChange={handleChange}>
                    <option value="">Select role</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Tester">Tester</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="section">
              <span className="section-label">Contact</span>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="jane@company.com"
                    value={member.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="phoneNo">Phone number</label>
                  <input
                    id="phoneNo"
                    type="text"
                    name="phoneNo"
                    placeholder="+92 300 1234567"
                    value={member.phoneNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {status.state === "success" && (
              <div className="banner banner-success" role="status">
                {status.message}
              </div>
            )}
            {status.state === "error" && (
              <div className="banner banner-error" role="alert">
                {status.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={status.state === "loading"}>
              {status.state === "loading" ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Creating member…
                </>
              ) : (
                "Create member"
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
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

        .layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', -apple-system, sans-serif;
          color: var(--text);
        }

        .sidebar {
          width: 250px;
          background: #0F172A;
          color: white;
          min-height: 100vh;
          flex-shrink: 0;
        }

        .main {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 56px 24px;
        }

        .card {
          width: 100%;
          max-width: 560px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06);
          padding: 36px 40px 40px;
        }

        .card-header {
          margin-bottom: 28px;
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

        .card-header h1 {
          font-family: 'Sora', 'Inter', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
        }

        .subtitle {
          margin-top: 6px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .avatar-wrap {
          position: relative;
          width: 96px;
          height: 96px;
          display: inline-block;
          cursor: pointer;
          border-radius: 50%;
          transition: transform 0.15s ease;
        }

        .avatar-wrap:hover { transform: scale(1.03); }

        .avatar-img {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--primary-soft);
          display: block;
        }

        .avatar-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          border: 2px solid var(--surface);
        }

        .avatar-hint {
          font-size: 12px;
          color: var(--text-muted);
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
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

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }

        .field input,
        .field select {
          padding: 11px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: var(--surface-alt);
          color: var(--text);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        .field input::placeholder { color: #A0AEC0; }

        .field input:focus,
        .field select:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--surface);
          box-shadow: 0 0 0 3px var(--primary-soft);
        }

        .banner {
          font-size: 13px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
        }

        .banner-success {
          background: var(--primary-soft);
          color: var(--primary-dark);
          border: 1px solid #99E6DC;
        }

        .banner-error {
          background: var(--danger-soft);
          color: var(--danger);
          border: 1px solid #FCA5A5;
        }

        .submit-btn {
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

        @media (max-width: 560px) {
          .main { padding: 24px 16px; }
          .card { padding: 28px 20px 32px; }
          .field-grid { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .avatar-wrap, .submit-btn, .spinner { transition: none; animation: none; }
        }
      `}</style>
    </div>
  );
}

export default CreateMember;