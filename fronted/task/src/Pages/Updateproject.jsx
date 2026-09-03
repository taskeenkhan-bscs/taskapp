import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Compoment/Sidebar.jsx";

function Projectupdate() {
  const navigate = useNavigate();
  const params = useParams();
  const fileInputRef = useRef(null);

  const [proj, setProj] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    deadline: "",
  });

  const [existingPicture, setExistingPicture] = useState(""); // raw path from server
  const [pictureFile, setPictureFile] = useState(null);       // new file, if chosen
  const [previewUrl, setPreviewUrl] = useState("");           // object URL for the newly chosen file
  const [imgFailed, setImgFailed] = useState(false);          // true if <img> failed to load

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [updateError, setUpdateError] = useState("");         // surfaces backend/auth failures

  // ---- build a safe, correct image URL no matter how the backend stored the path ----
  function buildImageUrl(picturePath) {
    if (!picturePath) return "";
    if (/^https?:\/\//i.test(picturePath)) return picturePath;

    const backend = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    let cleanPath = picturePath.replace(/\\/g, "/");
    cleanPath = cleanPath.replace(/^\/+/, "");
    return `${backend}/${cleanPath}`;
  }

  async function GetSingleProject() {
    try {
      setFetching(true);
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/projects/modernproject`,
        { _id: params.id }
      );

      if (res.data.success && res.data.project) {
        let p = res.data.project;
        setProj({
          title: p.title || "",
          description: p.description || "",
          category: p.category || "",
          priority: p.priority || "Medium",
          deadline: p.deadline ? p.deadline.substring(0, 10) : "",
        });
        setExistingPicture(p.picture || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  }

  function validate() {
    const e = {};
    if (!proj.title.trim()) e.title = "Required";
    if (!proj.category.trim()) e.category = "Required";
    if (!proj.priority.trim()) e.priority = "Required";
    return e;
  }

  function handlePictureChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, picture: "Only JPG, PNG, or WEBP allowed" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, picture: "Max file size is 5MB" });
      return;
    }

    setErrors({ ...errors, picture: undefined });
    setPictureFile(file);
    setImgFailed(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function Update() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setUpdateError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("_id", params.id);
      formData.append("title", proj.title);
      formData.append("description", proj.description);
      formData.append("category", proj.category);
      formData.append("priority", proj.priority);
      formData.append("deadline", proj.deadline);

      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/projects/updateproject`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // 👈 REQUIRED — Adminmiddleware needs the auth cookie
        }
      );

      if (res.data.success === true) {
        navigate("/projectlist");
      } else {
        setUpdateError(res.data.message || "Update failed");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setUpdateError(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to update project. Please make sure you're logged in as admin."
      );
    } finally {
      setLoading(false);
    }
  }

  function field(key, value) {
    setProj({ ...proj, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  }

  function focusIn(e) {
    e.currentTarget.style.borderColor = "#0D9488";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)";
    e.currentTarget.style.background = "#fff";
  }
  function focusOut(e, key) {
    e.currentTarget.style.borderColor = errors[key] ? "#fca5a5" : "#e2e8f0";
    e.currentTarget.style.boxShadow = "none";
  }

  const inputStyle = (key) => ({
    ...styles.input,
    ...(errors[key] ? styles.inputError : {}),
  });

  useEffect(() => {
    GetSingleProject();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const existingImageUrl = buildImageUrl(existingPicture);
  const displayImage = previewUrl || (!imgFailed ? existingImageUrl : "");

  return (
    <div style={styles.layout}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.cardWrap}>
          <div style={styles.card}>
            {/* Badge */}
            <div style={styles.badgeRow}>
              <span style={styles.badge}>PROJECT MANAGEMENT</span>
            </div>

            {/* Title */}
            <h1 style={styles.title}>Update Project</h1>
            <p style={styles.subtitle}>Edit this project's details and picture.</p>

            {/* Circular picture */}
            <div style={styles.photoWrap}>
              <div
                style={styles.photoCircle}
                onClick={() => fileInputRef.current?.click()}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Project"
                    style={styles.photoImg}
                    onError={() => {
                      console.log("Image failed to load. Tried URL:", displayImage);
                      setImgFailed(true);
                    }}
                  />
                ) : (
                  <span style={styles.noPhotoText}>No image</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={styles.editBadge}
                aria-label="Change picture"
              >
                ✏️
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handlePictureChange}
                style={{ display: "none" }}
              />
            </div>
            <p style={styles.photoHint}>Click the photo to change it</p>
            {errors.picture && <p style={styles.errorMsgCenter}>⚠ {errors.picture}</p>}
            {imgFailed && !previewUrl && (
              <p style={styles.warnTextCenter}>
                ⚠ Couldn't load the saved image. Check VITE_BACKEND_URL and that
                /uploads is served statically on the backend.
              </p>
            )}

            {updateError && (
              <p style={styles.errorMsgCenter}>⚠ {updateError}</p>
            )}

            {fetching ? (
              <div style={styles.loadingWrap}>
                <div style={styles.spinner} />
                <p style={styles.loadingText}>Loading project data...</p>
              </div>
            ) : (
              <>
                {/* IDENTITY section */}
                <p style={styles.sectionLabel}>DETAILS</p>
                <div style={styles.divider} />

                <div style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      placeholder="e.g. Portfolio Website"
                      style={inputStyle("title")}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, "title")}
                      onChange={(e) => field("title", e.target.value)}
                    />
                    {errors.title && <p style={styles.errorMsg}>⚠ {errors.title}</p>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Category</label>
                    <select
                      value={proj.category}
                      style={inputStyle("category")}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, "category")}
                      onChange={(e) => field("category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="App">App</option>
                      <option value="Web">Web</option>
                      <option value="Game">Game</option>
                      <option value="Desktop">Desktop</option>
                      <option value="AI">AI</option>
                    </select>
                    {errors.category && <p style={styles.errorMsg}>⚠ {errors.category}</p>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Priority</label>
                    <select
                      value={proj.priority}
                      style={inputStyle("priority")}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, "priority")}
                      onChange={(e) => field("priority", e.target.value)}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {errors.priority && <p style={styles.errorMsg}>⚠ {errors.priority}</p>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Deadline</label>
                    <input
                      type="date"
                      value={proj.deadline}
                      style={inputStyle("deadline")}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, "deadline")}
                      onChange={(e) => field("deadline", e.target.value)}
                    />
                    {errors.deadline && <p style={styles.errorMsg}>⚠ {errors.deadline}</p>}
                  </div>

                  <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      value={proj.description}
                      placeholder="Describe your project..."
                      rows={4}
                      style={{
                        ...inputStyle("description"),
                        resize: "vertical",
                        minHeight: "110px",
                        lineHeight: "1.6",
                      }}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, "description")}
                      onChange={(e) => field("description", e.target.value)}
                    />
                    {errors.description && (
                      <p style={styles.errorMsg}>⚠ {errors.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={Update}
                  disabled={loading}
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.75 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = "#0B7A70";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #0D9488, #0B7A70)";
                  }}
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#F3F5F8", fontFamily: "'Inter', -apple-system, sans-serif" },
  main: { flex: 1, padding: "40px", overflowY: "auto", display: "flex", justifyContent: "center" },
  cardWrap: { width: "100%", maxWidth: "760px" },
  card: { background: "#ffffff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0", padding: "40px 48px 48px", textAlign: "center" },

  badgeRow: { display: "flex", justifyContent: "center", marginBottom: "16px" },
  badge: { background: "#E6FBF8", color: "#0D9488", fontSize: "12px", fontWeight: "700", letterSpacing: "0.6px", padding: "6px 16px", borderRadius: "999px" },

  title: { margin: "0 0 8px", fontFamily: "'Sora', 'Inter', sans-serif", fontSize: "30px", fontWeight: "700", color: "#0F172A" },
  subtitle: { margin: "0 0 28px", fontSize: "15px", color: "#64748B" },

  photoWrap: { position: "relative", width: "140px", height: "140px", margin: "0 auto 12px" },
  photoCircle: { width: "140px", height: "140px", borderRadius: "50%", overflow: "hidden", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "3px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" },
  photoImg: { width: "100%", height: "100%", objectFit: "cover" },
  noPhotoText: { color: "#94a3b8", fontSize: "12px" },
  editBadge: { position: "absolute", bottom: "2px", right: "2px", width: "36px", height: "36px", borderRadius: "50%", background: "#0D9488", color: "#fff", border: "3px solid #fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  photoHint: { margin: "0 0 28px", fontSize: "13px", color: "#0D9488", fontWeight: "600" },

  errorMsgCenter: { margin: "0 0 16px", fontSize: "12px", color: "#ef4444", textAlign: "center" },
  warnTextCenter: { margin: "0 0 16px", fontSize: "12px", color: "#d97706", textAlign: "center", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" },

  sectionLabel: { textAlign: "left", margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.6px" },
  divider: { height: "1px", background: "#f1f5f9", marginBottom: "20px" },

  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "32px 0" },
  spinner: { width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTop: "3px solid #0D9488", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  loadingText: { color: "#94a3b8", fontSize: "14px", margin: 0 },

  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px", textAlign: "left", marginBottom: "28px" },
  fieldGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "7px", letterSpacing: "0.2px" },
  input: { padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#0F172A", outline: "none", transition: "all 0.15s ease", background: "#f8fafc", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', -apple-system, sans-serif" },
  inputError: { borderColor: "#fca5a5", background: "#fff5f5" },
  errorMsg: { margin: "6px 0 0", fontSize: "11px", color: "#ef4444" },

  submitBtn: { width: "100%", padding: "14px 28px", background: "linear-gradient(135deg, #0D9488, #0B7A70)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "background 0.2s ease" },
};

export default Projectupdate;