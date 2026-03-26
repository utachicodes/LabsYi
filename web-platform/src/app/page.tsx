'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot, Rocket, Video, Calendar, Code, Play,
  GraduationCap, Zap, Clock, Brain, Wifi, Trophy, Users,
  Cpu, Radio, Layers, Shield, ChevronRight, Activity,
  Terminal, Eye
} from 'lucide-react';

/* ─────────────────────────────── DATA ─────────────────────────────── */
const features = [
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Live Video Streaming',
    desc: 'Multi-camera HD feeds from the robot lab with sub-50ms latency.',
    color: 'text-sky-400',
    border: 'border-sky-400/20',
    bg: 'bg-sky-400/5',
    glow: 'hover:border-sky-400/40',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'AI Overlay on Video',
    desc: 'Real-time object detection and pose estimation rendered directly on the stream.',
    color: 'text-emerald-400',
    border: 'border-emerald-400/20',
    bg: 'bg-emerald-400/5',
    glow: 'hover:border-emerald-400/40',
  },
  {
    icon: <Radio className="w-6 h-6" />,
    title: 'WebSocket Real-Time Updates',
    desc: 'Joint angles, sensor data and telemetry pushed live to the browser.',
    color: 'text-violet-400',
    border: 'border-violet-400/20',
    bg: 'bg-violet-400/5',
    glow: 'hover:border-violet-400/40',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Robot 3D Viewer',
    desc: 'Interactive SVG/3D model of the arm mirroring real joint positions.',
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/5',
    glow: 'hover:border-amber-400/40',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'User Controls & Buttons',
    desc: 'Teleoperation, emergency stop, speed control and manual joint override.',
    color: 'text-rose-400',
    border: 'border-rose-400/20',
    bg: 'bg-rose-400/5',
    glow: 'hover:border-rose-400/40',
  },
  {
    icon: <Terminal className="w-6 h-6" />,
    title: 'REST API Commands',
    desc: 'FastAPI backend exposes every robot action over a clean typed REST interface.',
    color: 'text-orange-400',
    border: 'border-orange-400/20',
    bg: 'bg-orange-400/5',
    glow: 'hover:border-orange-400/40',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Session & User Management',
    desc: 'Supabase-powered auth, booking calendar and per-session access control.',
    color: 'text-sky-400',
    border: 'border-sky-400/20',
    bg: 'bg-sky-400/5',
    glow: 'hover:border-sky-400/40',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Score System & Leaderboard',
    desc: 'Earn points for successful tasks, climb the leaderboard and earn badges.',
    color: 'text-yellow-400',
    border: 'border-yellow-400/20',
    bg: 'bg-yellow-400/5',
    glow: 'hover:border-yellow-400/40',
  },
];

const leaderboardPreview = [
  { rank: 1, name: 'Aisha K.', score: 9420, sessions: 38, badge: '🥇' },
  { rank: 2, name: 'Marco R.', score: 8815, sessions: 34, badge: '🥈' },
  { rank: 3, name: 'Yuki T.', score: 8230, sessions: 31, badge: '🥉' },
  { rank: 4, name: 'Priya M.', score: 7650, sessions: 29, badge: '' },
  { rank: 5, name: 'Leon B.', score: 7120, sessions: 26, badge: '' },
];

const stats = [
  { icon: <Wifi className="w-5 h-5" />, value: '100%', label: 'Remote Access' },
  { icon: <Zap className="w-5 h-5" />, value: '<50ms', label: 'Stream Latency' },
  { icon: <Brain className="w-5 h-5" />, value: 'AI-Powered', label: 'Vision Overlay' },
  { icon: <Clock className="w-5 h-5" />, value: '24/7', label: 'Lab Access' },
];

const steps = [
  { icon: <Users className="w-5 h-5" />, title: 'Create Account', desc: 'Sign up in seconds — email, Google, or GitHub.' },
  { icon: <Calendar className="w-5 h-5" />, title: 'Book a Session', desc: 'Pick any available time slot from the calendar.' },
  { icon: <Code className="w-5 h-5" />, title: 'Write & Run Code', desc: 'Use the Monaco editor to script and execute robot tasks.' },
  { icon: <Trophy className="w-5 h-5" />, title: 'Earn Points', desc: 'Complete challenges, climb the leaderboard.' },
];

/* ─────────────────────────────── TICKER ─────────────────────────────── */
const tickerItems = [
  'LIVE VIDEO STREAMING', '///', 'AI OVERLAY', '///', 'WEBSOCKET UPDATES',
  '///', 'ROBOT 3D VIEWER', '///', 'TELEOPERATION', '///', 'LEADERBOARD',
  '///', 'LIVE VIDEO STREAMING', '///', 'AI OVERLAY', '///', 'WEBSOCKET UPDATES',
  '///', 'ROBOT 3D VIEWER', '///', 'TELEOPERATION', '///', 'LEADERBOARD', '///',
];

/* ─────────────────────────────── COMPONENT ─────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen gradient-cyber">
      {/* ── Background decoration ── */}
      <div className="fixed inset-0 cyber-grid opacity-60 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* ══════════════════════════ NAV ══════════════════════════ */}
      <nav className="relative glass-dark border-b border-sky-400/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white">Labs</span><span className="text-sky-400">Yi</span>
              </span>
              <span className="hidden sm:inline ml-2 px-2 py-0.5 text-xs bg-sky-400/10 border border-sky-400/20 rounded text-sky-400 terminal-text">
                TEAM 3
              </span>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/leaderboard" className="hover:text-white transition-colors flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Leaderboard
              </Link>
              <Link href="/booking" className="hover:text-white transition-colors">Book Lab</Link>
            </div>

            {/* CTA */}
            <div className="flex gap-2">
              <Link href="/auth/login">
                <button className="px-4 py-1.5 text-sm glass hover:bg-white/10 rounded transition-colors font-medium">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-4 py-1.5 text-sm gradient-primary text-white rounded font-semibold glow hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">

        {/* Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-sky-400/20 bg-sky-400/5 text-sky-400 text-xs terminal-text tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full dot-online animate-pulse" />
          FULL STACK ROBOTICS PLATFORM · TEAM 3
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
          <span className="text-white">Real Robots.</span>
          <br />
          <span className="gradient-primary bg-clip-text text-transparent">Real AI.</span>
          <br />
          <span className="text-slate-300 text-4xl md:text-5xl">From Anywhere.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Control physical robots remotely, overlay AI vision results live,
          train imitation-learning models in-browser, and compete on the
          global leaderboard — all without touching hardware.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link href="/auth/signup">
            <button className="group px-8 py-3.5 gradient-primary text-white rounded-lg font-bold text-base glow hover:opacity-90 transition-all flex items-center gap-2">
              Start Learning Free
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/lab">
            <button className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold text-base transition-all flex items-center gap-2">
              <Play className="w-4 h-4 text-sky-400" />
              Open Lab Demo
            </button>
          </Link>
          <Link href="/leaderboard">
            <button className="px-8 py-3.5 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20 rounded-lg font-semibold text-base text-yellow-400 transition-all flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
          </Link>
        </div>

        {/* Terminal preview card */}
        <div className="max-w-2xl mx-auto cyber-card rounded-xl overflow-hidden text-left hud-corners">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-sky-400/10 bg-black/20">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs terminal-text text-slate-500 ml-2">labsyi — robot_session_42</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full dot-online animate-pulse" />
              <span className="text-xs text-emerald-400 terminal-text">LIVE</span>
            </div>
          </div>
          {/* Terminal body */}
          <div className="p-4 space-y-1 terminal-text text-xs">
            <div><span className="text-sky-400">$</span> <span className="text-slate-300">connect --robot arm_01 --stream hd</span></div>
            <div className="text-emerald-400">✓ WebSocket connected · ws://lab.labsyi.io/ws/joint-data</div>
            <div className="text-emerald-400">✓ Video stream active · 1080p @ 30fps</div>
            <div><span className="text-sky-400">$</span> <span className="text-slate-300">teleop start --leader keyboard --follower arm_01</span></div>
            <div className="text-emerald-400">✓ Teleoperation running</div>
            <div className="text-slate-500">  J1: <span className="text-amber-400">12.4°</span>  J2: <span className="text-amber-400">-34.1°</span>  J3: <span className="text-amber-400">89.7°</span>  J4: <span className="text-amber-400">0.5°</span></div>
            <div className="text-slate-500">  AI: <span className="text-emerald-400">object_detected</span>  conf=<span className="text-sky-400">0.94</span></div>
            <div><span className="text-sky-400">$</span> <span className="animate-blink text-white">_</span></div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TICKER ══════════════════════════ */}
      <div className="relative overflow-hidden border-y border-sky-400/10 bg-sky-400/3 py-2.5">
        <div className="flex animate-ticker whitespace-nowrap">
          {tickerItems.map((item, i) => (
            <span key={i} className={`mx-4 text-xs terminal-text ${item === '///' ? 'text-sky-400/40' : 'text-slate-500'}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ STATS ══════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="cyber-card rounded-xl p-5 text-center cyber-card-hover">
              <div className="flex justify-center mb-2 text-sky-400">{s.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 terminal-text">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ FEATURES ══════════════════════════ */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-xs terminal-text text-sky-400 tracking-widest mb-3">SYSTEM ARCHITECTURE</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Eight Features,{' '}
            <span className="gradient-primary bg-clip-text text-transparent">One Platform</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Every component of the full-stack diagram — from live video to the leaderboard — is production-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative cyber-card rounded-xl p-5 border ${f.border} ${f.glow} transition-all duration-200 cursor-default`}
            >
              <div className={`w-10 h-10 rounded-lg ${f.bg} border ${f.border} flex items-center justify-center mb-4 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              {/* Index badge */}
              <div className="absolute top-4 right-4 text-xs terminal-text text-slate-600">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ LEADERBOARD PREVIEW ══════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="cyber-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-sky-400/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white">Global Leaderboard</span>
              <span className="px-2 py-0.5 text-xs bg-yellow-400/10 border border-yellow-400/20 rounded text-yellow-400 terminal-text">
                LIVE
              </span>
            </div>
            <Link href="/leaderboard">
              <button className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>

          {/* Rows */}
          <div className="divide-y divide-sky-400/5">
            {leaderboardPreview.map((u) => (
              <div key={u.rank} className="flex items-center gap-4 px-6 py-3.5 hover:bg-sky-400/3 transition-colors">
                <span className="w-6 text-center text-sm font-mono text-slate-500">
                  {u.badge || `#${u.rank}`}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/40 to-violet-500/40 flex items-center justify-center text-sm font-bold text-white border border-sky-400/20">
                  {u.name[0]}
                </div>
                <span className="flex-1 font-medium text-white text-sm">{u.name}</span>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Activity className="w-3 h-3" />
                  {u.sessions} sessions
                </div>
                <span className="font-bold text-yellow-400 terminal-text text-sm">{u.score.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ HOW IT WORKS ══════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-xs terminal-text text-sky-400 tracking-widest mb-3">GETTING STARTED</p>
          <h2 className="text-4xl font-bold text-white">
            Up and Running in{' '}
            <span className="gradient-primary bg-clip-text text-transparent">4 Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-gradient-to-r from-sky-400/30 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl cyber-card border border-sky-400/20 flex items-center justify-center text-sky-400 neon-border">
                  {s.icon}
                </div>
                <div className="text-xs terminal-text text-sky-400 mb-1">STEP {i + 1}</div>
                <h3 className="font-semibold text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="cyber-card rounded-2xl p-12 text-center neon-border relative overflow-hidden">
          {/* BG decoration */}
          <div className="absolute inset-0 cyber-grid-dense opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

          <div className="relative">
            <GraduationCap className="w-12 h-12 mx-auto text-sky-400 mb-6 animate-float" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Start Building with <span className="gradient-primary bg-clip-text text-transparent">LabsYi</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join students and researchers learning robotics remotely. No hardware required. Completely free to try.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/signup">
                <button className="px-8 py-3.5 gradient-primary text-white rounded-lg font-bold text-base glow hover:opacity-90 transition-all flex items-center gap-2 justify-center">
                  <Rocket className="w-4 h-4" />
                  Create Free Account
                </button>
              </Link>
              <Link href="/leaderboard">
                <button className="px-8 py-3.5 bg-yellow-400/8 hover:bg-yellow-400/12 border border-yellow-400/20 rounded-lg font-semibold text-base text-yellow-400 transition-all flex items-center gap-2 justify-center">
                  <Trophy className="w-4 h-4" />
                  View Leaderboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ══════════════════════════ */}
      <footer className="border-t border-sky-400/8 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">LabsYi</span>
            <span className="text-xs text-slate-600 terminal-text">· TEAM 3</span>
          </div>
          <p className="text-xs text-slate-600 terminal-text">© 2026 LabsYi · Remote Robotics Learning Platform</p>
          <div className="flex gap-4 text-xs text-slate-600">
            <Link href="/auth/login" className="hover:text-slate-400 transition-colors">Sign In</Link>
            <Link href="/booking" className="hover:text-slate-400 transition-colors">Book Lab</Link>
            <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">Leaderboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
