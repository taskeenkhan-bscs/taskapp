import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckSquare, Menu, X } from 'lucide-react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Every link is now a real route — each page (Home, About, Contact,
  // Projects, Members) renders its own Navbar + content + Footer, so a
  // click always opens something and only the current route is active.
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Projects', path: '/projects' },
    { label: 'Members', path: '/member' },
  ]

  const handleNavClick = (path) => {
    setIsOpen(false)
    navigate(path)
  }

  const isActive = (path) => location.pathname === path

  // Close mobile menu automatically whenever the route changes
  // (e.g. back/forward navigation, or a link clicked elsewhere).
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Lock background scroll while the mobile menu is open, and allow
  // closing it with the Escape key — small touches that make the menu
  // feel like a real app instead of a demo.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className="w-full bg-slate-50 px-4 sm:px-6 pt-5 sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto bg-white rounded-full shadow-[0_2px_20px_rgba(15,23,42,0.08)] border border-slate-100">
        <div className="flex items-center justify-between h-16 px-3 sm:px-4">

          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 shrink-0 pl-1"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100">
              <CheckSquare className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              TaskApp
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.path)}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`relative text-sm font-semibold tracking-wide uppercase transition-colors pb-1 ${
                  isActive(link.path)
                    ? 'text-indigo-600 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-indigo-600'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Login / Register — desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavClick('/login')}
              className="inline-flex items-center text-sm font-semibold tracking-wide text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-full px-5 py-3 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/reg')}
              className="inline-flex items-center text-sm font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 rounded-full px-5 py-3 transition-colors"
            >
              Register
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden max-w-5xl mx-auto overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(15,23,42,0.08)] border border-slate-100 px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link.path)}
              aria-current={isActive(link.path) ? 'page' : undefined}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive(link.path)
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleNavClick('/login')}
              className="flex-1 text-center text-sm font-semibold uppercase tracking-wide text-slate-900 bg-transparent border border-slate-900 hover:bg-slate-100 rounded-full px-4 py-3 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/reg')}
              className="flex-1 text-center text-sm font-semibold uppercase tracking-wide text-white bg-slate-900 hover:bg-slate-800 rounded-full px-4 py-3 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar