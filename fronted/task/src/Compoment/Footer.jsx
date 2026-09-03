import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Mail, ArrowRight, Loader2, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const NEWSLETTER_ENDPOINT = `${API_BASE_URL}/newsletter`;

// lucide-react no longer ships brand/logo icons, so these are small inline SVGs.
// Replace these hrefs with your real social profile URLs.
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...props}>
    <path d="M23 4.5c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.3 3.6a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 19.5 12.7 12.7 0 0 0 7.9 21.5c8.3 0 12.9-6.9 12.9-12.9v-.6c.9-.6 1.6-1.4 2.2-2.3z" />
  </svg>
);
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2 3.76-2 4 0 4.75 2.6 4.75 6v6.3h-4v-5.6c0-1.35-.02-3.1-1.9-3.1-1.9 0-2.2 1.5-2.2 3v5.7H9z" />
  </svg>
);
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
);
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Each item is either a real in-app route ({ to }) or an external/placeholder
// link ({ href }). Point `to` items at real routes, replace `href`
// placeholders once those pages exist.
const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Kanban Boards", href: "#" },
      { label: "Sprint Planning", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "API Docs", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

// Replace with your real profile URLs.
const SOCIALS = [
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
];

function FooterLink({ item }) {
  const className = "text-sm text-slate-400 no-underline transition-colors hover:text-indigo-400";
  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className}>
      {item.label}
    </a>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Couldn't subscribe right now. Try again later.");
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16">
        {/* Top: brand + newsletter */}
        <div className="flex flex-col gap-10 border-b border-slate-800 pb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-600">
                <CheckSquare size={20} color="#fff" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">TaskApp</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              The simplest way for teams to plan, track and ship work together.
              Built for speed, made for focus.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-indigo-600 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-96">
            <p className="mb-3 text-sm font-semibold text-white">Stay in the loop</p>
            <form onSubmit={handleSubscribe} noValidate>
              <div className="flex w-full items-center gap-2 rounded-full bg-slate-800 p-1.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-300">
                  <Mail size={16} strokeWidth={2} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 size={16} color="#fff" className="animate-spin" />
                  ) : status === "success" ? (
                    <Check size={16} color="#fff" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
              )}
              {status === "success" && (
                <p className="mt-2 text-xs text-emerald-400">Subscribed — welcome aboard.</p>
              )}
            </form>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-800 py-12 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-sm font-semibold text-white">{col.title}</p>
              <ul className="flex list-none flex-col gap-3 p-0 m-0">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 pt-8 text-center text-sm text-slate-500 lg:flex-row lg:text-left">
          <p>&copy; {year} TaskApp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-400 no-underline transition-colors hover:text-indigo-400">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-400 no-underline transition-colors hover:text-indigo-400">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-slate-400 no-underline transition-colors hover:text-indigo-400">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;