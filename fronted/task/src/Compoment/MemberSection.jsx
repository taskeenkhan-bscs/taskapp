import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Config — adjust these two constants to match your backend setup.
// ---------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const MEMBERS_ENDPOINT = `${API_BASE_URL}/members`;

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function resolveImage(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

// ---------------------------------------------------------------------------
// Icons (inline SVG — zero extra dependencies)
// ---------------------------------------------------------------------------
const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
  </svg>
);
const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.5 1 4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.7 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.1-1.2.2-1.8.1a4 4 0 0 0 3.7 2.7A8 8 0 0 1 2 17.9a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.4-1.3 2-2.1Z" />
  </svg>
);
const ChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Skeleton card shown while loading
// ---------------------------------------------------------------------------
function MemberSkeleton() {
  return (
    <div className="flex w-full shrink-0 flex-col items-center rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
      <div className="aspect-square w-full animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="mt-1.5 h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single member card — picture on top, details centered below.
// Single indigo accent throughout, matching the Hero section's palette.
// ---------------------------------------------------------------------------
function MemberCard({ member }) {
  const [imgError, setImgError] = useState(false);
  const name = member.name || member.fullName || "Unnamed Member";
  const role = member.role || member.designation || member.position || "Team Member";
  const department = member.department || member.category || null;
  const bio = member.bio || member.description || null;
  const image = resolveImage(member.profilePicture);

  const socials = [
    member.linkedin && { icon: LinkedInIcon, href: member.linkedin, label: "LinkedIn" },
    member.github && { icon: GitHubIcon, href: member.github, label: "GitHub" },
    member.twitter && { icon: TwitterIcon, href: member.twitter, label: "Twitter" },
  ].filter(Boolean);

  return (
    <article className="group flex h-full flex-col items-center rounded-lg border border-slate-100 bg-white p-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md">
      {/* Picture — square, slight radius, on top */}
      <div className="w-full overflow-hidden rounded-md ring-1 ring-indigo-100">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgError(true)}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-slate-50">
            <span className="text-lg font-bold text-slate-300">{initials(name)}</span>
          </div>
        )}
      </div>

      {/* Category dot + label */}
      <div className="mt-1.5 flex items-center justify-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
        <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-indigo-600">
          {department || role}
        </span>
      </div>

      {/* Details */}
      <h3 className="mt-1.5 w-full truncate text-base font-bold text-slate-700">{name}</h3>
      <p className="mt-0.5 w-full truncate text-sm font-medium text-slate-500">{role}</p>
      {bio && (
        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-slate-400">{bio}</p>
      )}

      {/* Contact / socials */}
      {socials.length > 0 && (
        <div className="mt-1.5 flex items-center justify-center gap-1 border-t border-slate-100 pt-1.5">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-slate-900 hover:text-white"
            >
              <Icon className="h-2.5 w-2.5" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Content only — no Navbar / Footer here. Used both on the Default (home)
// page and wrapped by the standalone /member route page.
// ---------------------------------------------------------------------------
export default function MemberSection() {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const trackRef = useRef(null);

  const fetchMembers = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(MEMBERS_ENDPOINT);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load members");
      setMembers(json.data || []);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while loading the team.");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Responsive visible-card count — 4 per row from small-tablet width up.
  useEffect(() => {
    const computeVisible = () => {
      const w = window.innerWidth;
      if (w < 480) return 1;
      if (w < 768) return 2;
      if (w < 1024) return 3;
      return 4;
    };
    const onResize = () => setVisibleCount(computeVisible());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const departments = useMemo(() => {
    const set = new Set(members.map((m) => m.department || m.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const name = m.name || m.fullName || "";
      const role = m.role || m.designation || "";
      const dept = m.department || m.category || "";
      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        role.toLowerCase().includes(search.toLowerCase());
      const matchesDept = activeDept === "All" || dept === activeDept;
      return matchesSearch && matchesDept;
    });
  }, [members, search, activeDept]);

  const maxIndex = Math.max(0, filtered.length - visibleCount);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const canGoLeft = index > 0;
  const canGoRight = index < maxIndex;

  const goLeft = () => setIndex((i) => Math.max(0, i - 1));
  const goRight = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const trackStyle = {
    transform: `translateX(-${index * (100 / visibleCount)}%)`,
  };

  return (
    <section id="members" className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50 to-indigo-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header — matches Hero: badge, slate-700 heading, indigo-600 accent word */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                The Team
              </span>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-700 sm:text-5xl">
            Meet The People Powering <span className="text-indigo-600">SSI Bannu.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            From mentors to mentees, every member here brings a skill set and a story.
            Get to know the team behind the courses and the roadmaps.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setActiveDept(dept);
                  setIndex(0);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeDept === dept
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIndex(0);
              }}
              placeholder="Search by name or role"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition-shadow focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Section header with arrows */}
        {status === "success" && filtered.length > 0 && (
          <div className="mt-10 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {activeDept === "All" ? "All Members" : activeDept}
              <span className="ml-2 text-slate-300">· {filtered.length}</span>
            </h2>
            {filtered.length > visibleCount && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goLeft}
                  disabled={!canGoLeft}
                  aria-label="Previous members"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goRight}
                  disabled={!canGoRight}
                  aria-label="Next members"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative mt-5">
          {status === "loading" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MemberSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-red-700">Couldn't load the team</p>
              <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
              <button
                onClick={fetchMembers}
                className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Try again
              </button>
            </div>
          )}

          {status === "success" && filtered.length === 0 && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-700">No members match your search</p>
              <p className="mt-1 text-sm text-slate-400">
                Try a different name, role, or department filter.
              </p>
            </div>
          )}

          {status === "success" && filtered.length > 0 && (
            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex gap-3 transition-transform duration-300 ease-out"
                style={trackStyle}
              >
                {filtered.map((member) => (
                  <div
                    key={member._id || member.id}
                    className="shrink-0"
                    style={{ width: `calc(${100 / visibleCount}% - ${(3 * (visibleCount - 1)) / visibleCount}px)` }}
                  >
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Position indicator dots */}
          {status === "success" && filtered.length > visibleCount && (
            <div className="mt-6 flex items-center justify-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to position ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-slate-900" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}