import React, { useState } from 'react'
import { Mail, User, GraduationCap, Code2, Send, MapPin, Phone, MessageCircle, Briefcase } from 'lucide-react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)

    // Simulated send — swap this for a real API call when the backend
    // endpoint is ready (e.g. axios.post to /contact).
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    }, 600)
  }

  const details = [
    { icon: User, label: 'Developer', value: 'Taskeen Ullah' },
    { icon: Mail, label: 'Email', value: 'taskeenullah@gmail.com' },
    { icon: GraduationCap, label: 'Education', value: 'BSCS — Computer Science' },
    { icon: Code2, label: 'Stack', value: 'MERN & .NET Technologies' },
    { icon: Briefcase, label: 'Experience', value: '3+ Years — MERN & .NET' },
    { icon: MapPin, label: 'Location', value: 'Bannu, Pakistan' },
    { icon: MessageCircle, label: 'WhatsApp', value: '0308 8788989' },
    { icon: Phone, label: 'Phone', value: '0332 4759879' },
  ]

  return (
    <section className="contact">
      <style>{`
        .contact {
          width: 100%;
          background-color: #f8fafc;
          padding: 96px 0;
        }

        .contact-container {
          max-width: 1152px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .contact-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 56px;
        }

        .contact-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #eef2ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 999px;
        }

        .contact-heading {
          margin-top: 18px;
          font-size: 34px;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .contact-heading span {
          color: #4f46e5;
        }

        .contact-subtext {
          margin-top: 14px;
          font-size: 16px;
          line-height: 1.7;
          color: #64748b;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        .contact-card {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #eef2f7;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
          padding: 32px;
          transition: box-shadow 0.25s ease;
        }

        .contact-card:hover {
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
        }

        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .contact-detail-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 6px;
          margin: -6px;
          border-radius: 12px;
          transition: background-color 0.2s ease;
        }

        .contact-detail-row:hover {
          background-color: #f8fafc;
        }

        .contact-detail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 12px;
          background-color: #eef2ff;
          color: #4f46e5;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .contact-detail-row:hover .contact-detail-icon {
          background-color: #4f46e5;
          color: #ffffff;
        }

        .contact-detail-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .contact-detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-top: 2px;
          word-break: break-word;
        }

        .contact-form-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .contact-form-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 24px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .contact-input,
        .contact-textarea {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: #1e293b;
          background-color: #f8fafc;
          outline: none;
          transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }

        .contact-input:focus,
        .contact-textarea:focus {
          border-color: #4f46e5;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
        }

        .contact-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #4f46e5;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 999px;
          padding: 14px 24px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          margin-top: 4px;
        }

        .contact-submit-btn:hover:not(:disabled) {
          background-color: #4338ca;
        }

        .contact-submit-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .contact-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .contact-spinner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #ffffff;
          animation: contact-spin 0.7s linear infinite;
        }

        @keyframes contact-spin {
          to { transform: rotate(360deg); }
        }

        .contact-success {
          margin-top: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #059669;
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 10px 14px;
        }

        @media (min-width: 900px) {
          .contact-grid {
            grid-template-columns: 0.85fr 1.15fr;
            align-items: start;
          }
        }
      `}</style>

      <div className="contact-container">
        <div className="contact-header">
          <span className="contact-eyebrow">Get In Touch</span>
          <h2 className="contact-heading">
            Questions About <span>TaskApp?</span> Let's Talk
          </h2>
          <p className="contact-subtext">
            Whether it's a bug, a feature idea, or just feedback — reach out directly
            or send a message below and I'll get back to you shortly.
          </p>
        </div>

        <div className="contact-grid">

          {/* Details card */}
          <div className="contact-card">
            <div className="contact-details-list">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="contact-detail-row">
                  <span className="contact-detail-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="contact-detail-label">{label}</div>
                    <div className="contact-detail-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div className="contact-card">
            <div className="contact-form-title">Send A Message</div>
            <p className="contact-form-subtitle">
              Fill in the form and I'll reply as soon as possible.
            </p>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="contact-field-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  className="contact-input"
                />
              </div>

              <div>
                <label className="contact-field-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="contact-input"
                />
              </div>

              <div>
                <label className="contact-field-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me what's on your mind..."
                  className="contact-textarea"
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={sending}>
                {sending ? (
                  <>
                    <span className="contact-spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} strokeWidth={2.2} />
                  </>
                )}
              </button>

              {sent && (
                <div className="contact-success" role="status">
                  Thanks — your message has been noted. I'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact