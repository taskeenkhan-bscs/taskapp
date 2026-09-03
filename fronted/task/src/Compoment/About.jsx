import React from 'react'
import { CheckCircle2, Target, Users2, Rocket } from 'lucide-react'
import taskeen from '../assets/picturefolder/taskeen.jpeg'

function About() {
  const stats = [
    { value: '12K+', label: 'Teams Onboarded' },
    { value: '2.4M', label: 'Tasks Completed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'Average Rating' },
  ]

  const points = [
    {
      icon: Target,
      title: 'Built For Focus',
      text: 'A clean, distraction-free workspace so your team spends time doing the work, not managing the tool.',
    },
    {
      icon: Users2,
      title: 'Made For Teams',
      text: 'Assign owners, leave comments, and track who is doing what — all in real time, across every project.',
    },
    {
      icon: Rocket,
      title: 'Ships Fast',
      text: 'Boards, sprints and reports load instantly, so nothing slows your team down when deadlines are close.',
    },
  ]

  return (
    <section className="about">
      <style>{`
        .about {
          width: 100%;
          background-color: #ffffff;
          padding: 96px 0;
        }

        .about-container {
          max-width: 1152px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          align-items: center;
        }

        .about-image-wrap {
          display: flex;
          justify-content: center;
        }

        .about-image-inner {
          position: relative;
          width: 100%;
          max-width: 420px;
        }

        .about-image-card {
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 5;
          border-radius: 5%;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
          border: 6px solid #ffffff;
          outline: 1px solid #eef2f7;
        }

        .about-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .about-image-inner:hover .about-image-card img {
          transform: scale(1.04);
        }

        .about-badge {
          position: absolute;
          bottom: 4px;
          right: -12px;
          max-width: calc(100% - 24px);
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #eef2f7;
        }

        .about-badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #eef2ff;
          color: #4f46e5;
          flex-shrink: 0;
        }

        .about-badge-value {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .about-badge-label {
          font-size: 12px;
          color: #64748b;
        }

        .about-eyebrow {
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

        .about-heading {
          margin-top: 20px;
          font-size: 34px;
          line-height: 1.25;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
        }

        .about-heading span {
          color: #4f46e5;
        }

        .about-text {
          margin-top: 18px;
          font-size: 16px;
          line-height: 1.7;
          color: #64748b;
        }

        .about-points {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .about-point {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 8px;
          margin: -8px;
          border-radius: 14px;
          transition: background-color 0.2s ease;
        }

        .about-point:hover {
          background-color: #f8fafc;
        }

        .about-point-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 12px;
          background-color: #eef2ff;
          color: #4f46e5;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .about-point:hover .about-point-icon {
          background-color: #4f46e5;
          color: #ffffff;
        }

        .about-point-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .about-point-text {
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
        }

        .about-stats {
          margin-top: 72px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          padding-top: 56px;
          border-top: 1px solid #e2e8f0;
        }

        .about-stat {
          position: relative;
          padding-left: 0;
        }

        .about-stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }

        .about-stat-label {
          margin-top: 6px;
          font-size: 14px;
          color: #64748b;
        }

        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 640px) {
          .about-stats {
            grid-template-columns: repeat(4, 1fr);
          }

          .about-stat:not(:first-child) {
            padding-left: 24px;
            border-left: 1px solid #e2e8f0;
          }
        }

        @media (max-width: 479px) {
          .about-badge {
            right: 0;
            padding: 12px 16px;
            gap: 10px;
          }

          .about-badge-value {
            font-size: 16px;
          }

          .about-heading {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="about-container">
        <div className="about-grid">

          {/* Image */}
          <div className="about-image-wrap">
            <div className="about-image-inner">
              <div className="about-image-card">
                <img src={taskeen} alt="Team using TaskApp to plan and track their work" />
              </div>
              <div className="about-badge">
                <span className="about-badge-icon" aria-hidden="true">
                  <CheckCircle2 size={20} strokeWidth={2.2} />
                </span>
                <div>
                  <div className="about-badge-value">6+ Years</div>
                  <div className="about-badge-label">Helping Teams Ship</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="about-eyebrow">About TaskApp</span>
            <h2 className="about-heading">
              We Help Teams Turn Busy Work Into <span>Real Progress</span>
            </h2>
            <p className="about-text">
              TaskApp started as a simple to-do list for a small design team tired of
              losing track of who owned what. Today it's a full workspace used by teams
              of every size to plan sprints, organize projects and keep everyone moving
              in the same direction — without the clutter of tools built for everything
              except getting work done.
            </p>

            <div className="about-points">
              {points.map(({ icon: Icon, title, text }) => (
                <div key={title} className="about-point">
                  <span className="about-point-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div>
                    <div className="about-point-title">{title}</div>
                    <p className="about-point-text">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="about-stat">
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About