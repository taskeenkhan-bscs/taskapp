import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const roleRoutes = {
    admin: "/home",
    employee: "/tasklist",
    manager: "/tasklist",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        form,
        { withCredentials: true }
      );

      if (!res.data.success) {
        setError(res.data.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token); // ← Electron flow ke liye add kiya

      const role = res.data.user.role;
      navigate(roleRoutes[role] || "/home");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Ambient background dots, matches landing page texture */}
      <div className="bg-dot bg-dot-1" />
      <div className="bg-dot bg-dot-2" />
      <div className="bg-dot bg-dot-3" />
      <div className="bg-dot bg-dot-4" />

      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <button
          type="button"
          className="close-btn"
          aria-label="Close and go home"
          onClick={() => navigate("/")}
        >
          ✕
        </button>

        <div className="badge">
          <span className="badge-dot" />
          WELCOME BACK
        </div>

        <h2>Sign In To Continue</h2>
        <p className="subtitle">
          Log in to keep managing your tasks and projects.
        </p>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <label className="field-label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label className="field-label" htmlFor="password">
          Password
        </label>
        <div className="password-wrap">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <label className="field-label" htmlFor="role">
          Login as
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="spinner-wrap">
              <span className="spinner" />
              Logging In...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <div className="divider" />

        <p className="register-text">Don't have an account?</p>

        <button
          type="button"
          className="register-btn"
          onClick={() => navigate("/reg")}
        >
          Create New Account
        </button>
      </form>

      <style>{`
        :root {
          --ink-900: #172a2e;
          --ink-700: #2d4a4f;
          --teal-700: #1f4b4f;
          --indigo-600: #6366f1;
          --indigo-50: #eef0ff;
          --bg-100: #eef2f7;
          --bg-50: #f7f9fc;
          --border: #d8dee6;
          --danger-50: #fef2f2;
          --danger-600: #dc2626;
        }

        *{
          box-sizing:border-box;
        }

        .login-container{
          position: relative;
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background: radial-gradient(circle at 20% 20%, var(--bg-50), var(--bg-100));
          padding:20px;
          overflow: hidden;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        }

        .bg-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(45, 74, 79, 0.15);
        }
        .bg-dot-1 { top: 12%; left: 10%; }
        .bg-dot-2 { top: 75%; left: 15%; }
        .bg-dot-3 { top: 20%; right: 12%; }
        .bg-dot-4 { top: 80%; right: 18%; }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: #f9fafb;
          color: var(--ink-900);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
          z-index: 5;
        }
        .close-btn:hover {
          background: #f3f4f6;
          transform: scale(1.05);
        }
        .close-btn:focus-visible {
          outline: 2px solid var(--indigo-600);
          outline-offset: 2px;
        }

        .login-card{
          position: relative;
          z-index: 10;
          width:100%;
          max-width:440px;
          background:#ffffff;
          padding:40px;
          border-radius:20px;
          box-shadow: 0 20px 45px rgba(23, 42, 46, 0.12);
          display:flex;
          flex-direction:column;
          gap:6px;
          border: 1px solid var(--border);
        }

        .badge {
          align-self: center;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--indigo-50);
          color: var(--indigo-600);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--indigo-600);
        }

        .login-card h2{
          text-align:center;
          color: var(--teal-700);
          font-size:26px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .subtitle{
          text-align:center;
          color:#6b7280;
          font-size: 13.5px;
          margin-bottom:16px;
        }

        .error-box {
          background: var(--danger-50);
          color: var(--danger-600);
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 8px;
          border: 1px solid rgba(220,38,38,0.2);
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-700);
          margin: 8px 0 2px;
        }

        .login-card input,
        .login-card select{
          padding:13px 14px;
          border:1px solid var(--border);
          border-radius:10px;
          outline:none;
          font-size: 14px;
          transition: border-color .2s, box-shadow .2s;
          width: 100%;
          background: #fff;
        }

        .login-card input:focus,
        .login-card select:focus{
          border-color: var(--indigo-600);
          box-shadow: 0 0 0 4px rgba(99,102,241,.15);
        }

        .password-wrap {
          position: relative;
          display: flex;
        }
        .password-wrap input { padding-right: 42px; }
        .toggle-visibility {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 15px;
          padding: 6px;
          line-height: 1;
        }

        .submit-btn{
          margin-top: 18px;
          padding:14px;
          border:none;
          border-radius: 999px;
          cursor:pointer;
          font-size:15px;
          font-weight:700;
          background: var(--ink-900);
          color:white;
          transition: background .2s, transform .1s;
        }
        .submit-btn:hover:not(:disabled){
          background:#0f2124;
        }
        .submit-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .submit-btn:disabled{
          opacity:.65;
          cursor:not-allowed;
        }

        .spinner-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider{
          height:1px;
          background: var(--border);
          margin-top:20px;
        }

        .register-text{
          text-align:center;
          color:#6b7280;
          font-size: 13px;
          margin-top: 14px;
        }

        .register-btn{
          background:transparent;
          border: none;
          color: var(--indigo-600);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          padding: 6px;
        }
        .register-btn:hover{
          text-decoration:underline;
        }

        @media(max-width:480px){
          .login-card{
            padding:28px 22px;
          }
          .login-card h2{
            font-size:22px;
          }
          .close-btn {
            top: 12px;
            right: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;