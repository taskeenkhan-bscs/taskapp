import React from 'react'
import {
  ListChecks,
  KanbanSquare,
  Users,
  Calendar,
  BarChart3,
  Bell,
} from 'lucide-react'

function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-sky-50 to-indigo-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">

        {/* Floating icon cards */}
        <div className="hidden sm:flex absolute top-16 left-4 lg:left-10 w-20 h-20 rounded-2xl bg-white shadow-lg items-center justify-center rotate-[-6deg]">
          <KanbanSquare className="w-9 h-9 text-orange-500" strokeWidth={1.8} />
        </div>
        <div className="hidden sm:flex absolute top-6 right-4 lg:right-10 w-20 h-20 rounded-2xl bg-white shadow-lg items-center justify-center rotate-[8deg]">
          <BarChart3 className="w-9 h-9 text-indigo-600" strokeWidth={1.8} />
        </div>
        <div className="hidden sm:flex absolute bottom-10 left-6 lg:left-16 w-20 h-20 rounded-2xl bg-white shadow-lg items-center justify-center rotate-[7deg]">
          <Users className="w-9 h-9 text-sky-500" strokeWidth={1.8} />
        </div>
        <div className="hidden sm:flex absolute bottom-4 right-6 lg:right-16 w-20 h-20 rounded-2xl bg-white shadow-lg items-center justify-center rotate-[-8deg]">
          <Bell className="w-9 h-9 text-emerald-500" strokeWidth={1.8} />
        </div>

        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Now In Public Beta
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-700 tracking-tight">
          Organize Your Work And
          <br />
          Ship Projects Faster With <span className="text-indigo-600">TaskApp.</span>
        </h1>

        {/* Paragraph */}
        <p className="mt-6 max-w-2xl mx-auto text-center text-slate-500 text-base sm:text-lg leading-relaxed">
          Plan sprints, assign tasks and track progress in one place. Bring your
          whole team together, cut down on busywork, and get more done —
          all from a single <span className="font-semibold text-slate-700">dashboard</span>.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#signup"
            className="inline-flex items-center justify-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full px-8 py-4 transition-colors shadow-sm w-full sm:w-auto"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center text-sm font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-full px-8 py-4 transition-colors w-full sm:w-auto"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Bottom feature strip */}
      <div className="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            { icon: ListChecks, label: 'Task Tracking' },
            { icon: KanbanSquare, label: 'Kanban Boards' },
            { icon: Users, label: 'Team Collaboration' },
            { icon: Calendar, label: 'Sprint Planning' },
            { icon: BarChart3, label: 'Progress Reports' },
            { icon: Bell, label: 'Smart Reminders' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-400">
              <Icon className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero