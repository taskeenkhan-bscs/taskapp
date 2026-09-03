import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Config — adjust to match your backend setup.
// ---------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const PROJECTS_ENDPOINT = `${API_BASE_URL}/projects`;

// This is a read-only, public-facing view. No admin/edit/delete controls
// live here on purpose — that logic belongs in a separate admin dashboard.

function resolveImage(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function getCompletion(project) {
  const raw = project.status || project.projectStatus;
  if (typeof raw === "string") {
    const normalized = raw.toLowerCase();
    if (["completed", "done", "finished"].includes(normalized)) return "completed";
    if (["in-progress", "in progress", "ongoing", "active"].includes(normalized)) return "in-progress";
  }
  if (project.completed === true || project.isCompleted === true) return "completed";
  return "in-progress";
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function daysRemaining(value) {
  if (!value) return null;
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return null;
  const diff = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const ChevronLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Skeleton card
// ---------------------------------------------------------------------------
function ProjectSkeleton() {
  return (
    <div className="w-[75%] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
      <div className="aspect-[4/5] w-full animate-pulse bg-slate-200" />
      <div className="p-4">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-3.5 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single project card — view only, minimal style.
// Single indigo accent throughout, matching the Hero section's palette.
// ---------------------------------------------------------------------------
function ProjectCard({ project }) {
  const [imgError, setImgError] = useState(false);

  const title = project.title || "Untitled project";
  const category = project.category || "General";
  const image = resolveImage(project.picture);
  const completion = getCompletion(project);
  const isCompleted = completion === "completed";
  const deadlineLabel = formatDate(project.deadline);
  const remaining = daysRemaining(project.deadline);
  const isOverdue = !isCompleted && remaining !== null && remaining < 0;

  const statusLabel = isCompleted ? "Completed" : isOverdue ? "Overdue" : "In progress";

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md">
      {/* Picture */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        {image && !imgError ? (
          <img
            src={image}
            alt={title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-medium text-slate-400">No preview</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
        <h3 className="mt-3 text-xl font-bold leading-snug text-slate-700">{title}</h3>
        <p className="mt-1.5 text-base font-medium text-slate-500">
          {category} · <span className={isOverdue ? "text-red-500" : "text-indigo-600"}>{statusLabel}</span>
        </p>
        {deadlineLabel && (
          <p className="mt-1 text-sm text-slate-400">
            {isCompleted ? `Delivered ${deadlineLabel}` : `Due ${deadlineLabel}`}
          </p>
        )}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Content only — no Navbar / Footer here. Used both on the Default (home)
// page and wrapped by the standalone /projects route page.
// ---------------------------------------------------------------------------
export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("all"); // all | completed | in-progress

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const fetchProjects = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(PROJECTS_ENDPOINT);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load projects");
      setProjects(json.data || []);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while loading projects.");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const completedCount = useMemo(
    () => projects.filter((p) => getCompletion(p) === "completed").length,
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const title = p.title || "";
      const matchesSearch = !search || title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesStatus = activeStatus === "all" || getCompletion(p) === activeStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, search, activeCategory, activeStatus]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [filtered]);

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 640) * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const showArrows = filtered.length > 0 && (canScrollLeft || canScrollRight);

  return (
    <section id="projects" className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50 to-indigo-50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header — matches Hero: badge, slate-700 heading, indigo-600 accent word */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {status === "success" && projects.length > 0
                  ? `${projects.length} Projects On Record`
                  : "Project Ledger"}
              </span>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-700 sm:text-5xl">
            Projects We've <span className="text-indigo-600">Delivered</span> And What's Still In Motion.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            {status === "success" && projects.length > 0
              ? `A running record of our work — ${completedCount} of ${projects.length} shipped, the rest in progress.`
              : "A running record of what our team has built and what's currently in motion."}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-12 flex flex-col gap-4">
          <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative flex w-full items-center gap-2 sm:w-auto">
              <div className="relative w-full sm:w-64">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects"
                  aria-label="Search projects"
                  className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition-shadow focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {showArrows && (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => scrollByAmount(-1)}
                    disabled={!canScrollLeft}
                    aria-label="Scroll projects left"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollByAmount(1)}
                    disabled={!canScrollRight}
                    aria-label="Scroll projects right"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status tabs — centered on their own row */}
          <div className="flex items-center justify-center gap-2">
            {[
              { key: "all", label: "All" },
              { key: "in-progress", label: "In Progress" },
              { key: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors ${
                  activeStatus === tab.key
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-10">
          {status === "loading" && (
            <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-red-700">Couldn't load projects</p>
              <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
              <button
                onClick={fetchProjects}
                className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Try again
              </button>
            </div>
          )}

          {status === "success" && filtered.length === 0 && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-700">No projects match your filters</p>
              <p className="mt-1 text-sm text-slate-400">
                Try a different search term, category, or status.
              </p>
            </div>
          )}

          {status === "success" && filtered.length > 0 && (
            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filtered.map((project, i) => (
                <div
                  key={project._id || project.id || i}
                  className="w-[75%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}