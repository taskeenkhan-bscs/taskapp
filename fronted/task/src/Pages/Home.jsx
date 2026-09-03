import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";

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
    --amber: #D97706;
    --amber-soft: #FFFBEB;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash { display: flex; min-height: 100vh; background: var(--bg); font-family: 'Inter', -apple-system, sans-serif; color: var(--text); }
  .main { flex: 1; padding: 40px; overflow-y: auto; min-width: 0; }

  .topbar { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .topbar h1 { font-family: 'Sora', 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: var(--text); }
  .topbar p  { font-size: 13px; color: var(--text-muted); margin-top: 3px; }

  .add-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
    background: var(--primary); color: #fff; border: none; cursor: pointer;
    text-decoration: none; transition: background .15s;
  }
  .add-btn:hover { background: var(--primary-dark); }

  /* ── Stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }
  .stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
  .stat-value { font-size: 28px; font-weight: 700; color: var(--text); }
  .stat-sub   { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

  .stat-card.teal   .stat-value { color: var(--primary); }
  .stat-card.green  .stat-value { color: #3B6D11; }
  .stat-card.amber  .stat-value { color: #854F0B; }
  .stat-card.purple .stat-value { color: #534AB7; }
  .stat-card.red    .stat-value { color: var(--danger); }

  .row-title {
    display: flex; align-items: baseline; justify-content: space-between;
    margin: 28px 0 12px;
  }
  .section-title { font-family: 'Sora', 'Inter', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); }
  .section-link { font-size: 12px; font-weight: 600; color: var(--primary); text-decoration: none; }
  .section-link:hover { text-decoration: underline; }

  /* ── Two-column widgets ── */
  .widget-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 16px;
    margin-bottom: 8px;
  }
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px 20px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  /* Project progress */
  .progress-row { padding: 10px 0; border-bottom: 1px solid var(--surface-alt); }
  .progress-row:last-child { border-bottom: none; }
  .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; gap: 8px; }
  .progress-name { font-size: 13px; font-weight: 600; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .progress-pct { font-size: 12px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }
  .progress-track { height: 7px; border-radius: 999px; background: var(--surface-alt); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px; background: var(--primary); transition: width .4s ease; }
  .progress-fill.low  { background: var(--danger); }
  .progress-fill.mid  { background: var(--amber); }
  .progress-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

  /* Due this week */
  .due-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--surface-alt);
  }
  .due-row:last-child { border-bottom: none; }
  .due-left { min-width: 0; }
  .due-title { font-size: 13px; font-weight: 600; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .due-proj { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .due-date { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }
  .due-date.soon    { background: var(--amber-soft); color: var(--amber); }
  .due-date.today   { background: var(--danger-soft); color: var(--danger); }
  .due-date.later   { background: var(--surface-alt); color: var(--text-muted); }

  /* Recent activity */
  .activity-list { display: flex; flex-direction: column; }
  .activity-row { display: flex; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--surface-alt); }
  .activity-row:last-child { border-bottom: none; }
  .activity-dot {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .activity-dot.done  { background: var(--primary); }
  .activity-dot.moved { background: #64748B; }
  .activity-text { font-size: 13px; color: var(--text); line-height: 1.4; }
  .activity-text b { font-weight: 700; }
  .activity-time { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .empty-mini { font-size: 12.5px; color: var(--text-muted); padding: 14px 2px; }

  /* ── Filters ── */
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
  .filters input,
  .filters select {
    font-size: 13px; padding: 9px 12px;
    border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface-alt); color: var(--text); outline: none;
    font-family: inherit;
    transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
  }
  .filters input  { min-width: 200px; flex: 1; }
  .filters select { min-width: 140px; }
  .filters input:focus,
  .filters select:focus {
    border-color: var(--primary);
    background: var(--surface);
    box-shadow: 0 0 0 3px var(--primary-soft);
  }

  /* ── Table ── */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04); }
  .tbl-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }

  thead tr { background: var(--surface-alt); border-bottom: 1px solid var(--border); }
  th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }

  tbody tr { border-bottom: 1px solid var(--surface-alt); transition: background .12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface-alt); }
  td { padding: 12px 16px; vertical-align: middle; color: #374151; }
  .td-title { font-weight: 600; color: var(--text); }
  .td-muted { color: var(--text-muted); }

  /* Badges */
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; border: 1px solid; }
  .b-high     { background: var(--danger-soft); color: var(--danger); border-color: #fecaca; }
  .b-medium   { background: #fffbeb; color: #92400e; border-color: #fde68a; }
  .b-low      { background: var(--primary-soft); color: var(--primary-dark); border-color: #99E6DC; }

  /* Action buttons */
  .act-btns { display: flex; gap: 6px; }
  .act-btns button { border: none; padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; color: #fff; transition: opacity .2s; }
  .del-btn { background: var(--danger); }
  .del-btn:hover { opacity: .85; }
  .upd-btn { background: var(--primary); }
  .upd-btn:hover { opacity: .85; }

  .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); font-size: 14px; }

  @media (max-width: 900px) {
    .widget-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .dash { flex-direction: column; }
    .main { padding: 20px; }
    table { min-width: 600px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .add-btn, .act-btns button, .filters input, .filters select, .progress-fill { transition: none; }
  }
`;

function priorityClass(p) {
  return p === "High" ? "badge b-high" : p === "Medium" ? "badge b-medium" : "badge b-low";
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// short, human "2h ago" / "3d ago" style relative time for the activity feed
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDate(dateStr);
}

// resolves whichever shape the task's project reference comes back as
function taskProjectId(t) {
  if (!t.project) return null;
  return typeof t.project === "string" ? t.project : t.project._id;
}

export default function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [priorityF, setPriorityF] = useState("");

  // fetch projects + members + tasks together, keeps every widget on this
  // page fully dynamic — nothing here relies on a page refresh to stay accurate
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pRes, mRes, tRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/members/`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks`, { withCredentials: true }),
      ]);
      setProjects(pRes.data.data || []);
      setMembers(mRes.data.data || mRes.data.members || []);
      setTasks(tRes.data.tasks || tRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/projects/delete`, { id });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  }

  const filtered = projects.filter((p) => {
    const matchQ = !search || (p.title || "").toLowerCase().includes(search.toLowerCase());
    const matchSt = !statusF || p.status === statusF;
    const matchPr = !priorityF || p.priority === priorityF;
    return matchQ && matchSt && matchPr;
  });

  // ── Project counts (unchanged) ──
  const total = projects.length;
  const done = projects.filter((p) => p.status === "Completed").length;
  const progress = projects.filter((p) => p.status === "In Progress").length;
  const pending = projects.filter((p) => p.status === "Pending").length;
  const totalMembers = members.length;

  // ── Task-level stats ──
  const now = new Date();
  const taskTotal = tasks.length;
  const taskDone = tasks.filter((t) => (t.status || "").toLowerCase() === "done").length;
  const taskInProgress = tasks.filter((t) => (t.status || "").toLowerCase() === "in progress").length;
  const taskOverdue = tasks.filter(
    (t) => t.deadline && (t.status || "").toLowerCase() !== "done" && new Date(t.deadline) < now
  ).length;

  // ── Project progress bars: % of each project's tasks marked Done ──
  const projectProgress = projects
    .map((p) => {
      const projTasks = tasks.filter((t) => taskProjectId(t) === p._id);
      const doneCount = projTasks.filter((t) => (t.status || "").toLowerCase() === "done").length;
      const pct = projTasks.length ? Math.round((doneCount / projTasks.length) * 100) : 0;
      return { ...p, taskCount: projTasks.length, doneCount, pct };
    })
    .filter((p) => p.taskCount > 0)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  // ── Tasks due within the next 7 days, not yet done, soonest first ──
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = tasks
    .filter((t) => {
      if (!t.deadline || (t.status || "").toLowerCase() === "done") return false;
      const d = new Date(t.deadline);
      return d <= weekFromNow;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 6);

  function dueBadgeClass(deadline) {
    const d = new Date(deadline);
    const diffDays = Math.ceil((d - now) / (24 * 60 * 60 * 1000));
    if (diffDays < 0) return "today"; // already overdue — flag same as "today"
    if (diffDays === 0) return "today";
    if (diffDays <= 2) return "soon";
    return "later";
  }
  function dueLabel(deadline) {
    const d = new Date(deadline);
    const diffDays = Math.ceil((d - now) / (24 * 60 * 60 * 1000));
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return fmtDate(deadline);
  }

  // ── Recent activity: most recently touched tasks, newest first ──
  const recentActivity = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 6);

  return (
    <>
      <style>{styles}</style>

      <div className="dash">
        <Sidebar />

        <div className="main">
          {/* Top bar */}
          <div className="topbar">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back, Admin</p>
            </div>
            <a href="/addproject" className="add-btn">+ Add project</a>
          </div>

          {/* Project + member stats */}
          <div className="stats-grid">
            <div className="stat-card teal">
              <div className="stat-label">Total projects</div>
              <div className="stat-value">{loading ? "—" : total}</div>
              <div className="stat-sub">All projects</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Completed</div>
              <div className="stat-value">{loading ? "—" : done}</div>
              <div className="stat-sub">Finished</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-label">In progress</div>
              <div className="stat-value">{loading ? "—" : progress}</div>
              <div className="stat-sub">Active now</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{loading ? "—" : pending}</div>
              <div className="stat-sub">Not started</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Total members</div>
              <div className="stat-value">{loading ? "—" : totalMembers}</div>
              <div className="stat-sub">Registered</div>
            </div>
          </div>

          {/* Task stats */}
          <div className="row-title">
            <div className="section-title">Tasks overview</div>
            <a href="/tasklist" className="section-link">View all tasks →</a>
          </div>
          <div className="stats-grid">
            <div className="stat-card teal">
              <div className="stat-label">Total tasks</div>
              <div className="stat-value">{loading ? "—" : taskTotal}</div>
              <div className="stat-sub">Across all projects</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Done</div>
              <div className="stat-value">{loading ? "—" : taskDone}</div>
              <div className="stat-sub">Completed</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-label">In progress</div>
              <div className="stat-value">{loading ? "—" : taskInProgress}</div>
              <div className="stat-sub">Being worked on</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">Overdue</div>
              <div className="stat-value">{loading ? "—" : taskOverdue}</div>
              <div className="stat-sub">Past deadline</div>
            </div>
          </div>

          {/* Project progress + Due this week */}
          <div className="widget-grid">
            <div className="panel">
              <div className="section-title" style={{ marginBottom: 4 }}>Project progress</div>
              {loading ? (
                <div className="empty-mini">Loading…</div>
              ) : projectProgress.length === 0 ? (
                <div className="empty-mini">No projects with tasks yet.</div>
              ) : (
                projectProgress.map((p) => {
                  const barClass = p.pct >= 70 ? "" : p.pct >= 35 ? "mid" : "low";
                  return (
                    <div className="progress-row" key={p._id}>
                      <div className="progress-top">
                        <span className="progress-name">{p.title}</span>
                        <span className="progress-pct">{p.pct}%</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className={`progress-fill ${barClass}`}
                          style={{ width: `${p.pct}%` }}
                        />
                      </div>
                      <div className="progress-meta">{p.doneCount} of {p.taskCount} tasks done</div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="panel">
              <div className="section-title" style={{ marginBottom: 4 }}>Due this week</div>
              {loading ? (
                <div className="empty-mini">Loading…</div>
              ) : dueThisWeek.length === 0 ? (
                <div className="empty-mini">Nothing due in the next 7 days 🎉</div>
              ) : (
                dueThisWeek.map((t) => (
                  <div className="due-row" key={t._id}>
                    <div className="due-left">
                      <div className="due-title">{t.title}</div>
                      {t.project?.title && <div className="due-proj">{t.project.title}</div>}
                    </div>
                    <span className={`due-date ${dueBadgeClass(t.deadline)}`}>{dueLabel(t.deadline)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="row-title">
            <div className="section-title">Recent activity</div>
          </div>
          <div className="panel" style={{ marginBottom: 28 }}>
            {loading ? (
              <div className="empty-mini">Loading…</div>
            ) : recentActivity.length === 0 ? (
              <div className="empty-mini">No task activity yet.</div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((t) => {
                  const isDone = (t.status || "").toLowerCase() === "done";
                  const who = t.assignedTo?.fullName || "Someone";
                  return (
                    <div className="activity-row" key={t._id}>
                      <div className={`activity-dot ${isDone ? "done" : "moved"}`}>
                        {isDone ? "✓" : "•"}
                      </div>
                      <div>
                        <div className="activity-text">
                          <b>{who}</b>{" "}
                          {isDone ? "completed" : `moved to ${t.status || "Todo"}`}{" "}
                          "{t.title}"
                        </div>
                        <div className="activity-time">{timeAgo(t.updatedAt || t.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="section-title" style={{ marginBottom: 12 }}>Projects</div>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
              <option value="">All statuses</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Pending</option>
            </select>
            <select value={priorityF} onChange={(e) => setPriorityF(e.target.value)}>
              <option value="">All priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <div className="tbl-scroll">
              {loading ? (
                <div className="empty-state">Loading…</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      {["#", "Title", "Category", "Priority", "Deadline", "Actions"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">No projects match your filters.</td>
                      </tr>
                    ) : (
                      filtered.map((item, index) => (
                        <tr key={item._id}>
                          <td className="td-muted">{index + 1}</td>
                          <td className="td-title">{item.title}</td>
                          <td className="td-muted">{item.category || "—"}</td>
                          <td><span className={priorityClass(item.priority)}>{item.priority}</span></td>
                          <td className="td-muted">{fmtDate(item.deadline)}</td>
                          <td>
                            <div className="act-btns">
                              <button className="del-btn" onClick={() => deleteProject(item._id)}>Delete</button>
                              <button className="upd-btn" onClick={() => navigate(`/update/${item._id}`)}>Update</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}