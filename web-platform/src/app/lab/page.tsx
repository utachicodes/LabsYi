'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import CodeEditor from '@/components/lab/CodeEditor';
import RobotControls from '@/components/lab/RobotControls';
import LogsPanel from '@/components/lab/LogsPanel';
import VideoStream from '@/components/lab/VideoStream';
import Robot3DViewer from '@/components/lab/Robot3DViewer';
import {
  Save, Zap, Loader2, Bot, Code2, Layers, Clock,
  Trophy, Wifi, WifiOff, ChevronLeft, Star, LogOut, Cpu
} from 'lucide-react';

/* ─── Session timer (counts up from 0) ─── */
function useTimer() {
  const [s, setS] = useState(0);
  useEffect(() => { const id = setInterval(() => setS((v) => v + 1), 1000); return () => clearInterval(id); }, []);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

/* ─── Score state ─── */
function useScore(initial = 1240) {
  const [score, setScore] = useState(initial);
  return { score, addPoints: (n: number) => setScore((v) => v + n) };
}

type CenterTab = 'code' | '3d';

/* ─── Inner component (needs useSearchParams) ─── */
function LabInner() {
  const { user, loading, logout } = useAuth({ redirectTo: '/auth/login' });
  const searchParams = useSearchParams();

  // Booking context from URL params (set by booking page)
  const robotName = searchParams.get('robotName') ?? 'SO-100';
  const slot      = searchParams.get('slot')      ?? '—';

  const [code, setCode]             = useState('# LabsYi Robot Script\n# Robot: ' + robotName + '\n\nimport time\n\ndef main():\n    print("Connecting to ' + robotName + '...")\n    # Your robot code here\n    pass\n\nif __name__ == "__main__":\n    main()\n');
  const [isExecuting, setExecuting] = useState(false);
  const [centerTab, setCenterTab]   = useState<CenterTab>('code');
  const [wsConnected]               = useState(false);
  const timer                       = useTimer();
  const { score, addPoints }        = useScore();

  const handleExecuteCode = async () => {
    if (!code.trim()) return;
    setExecuting(true);
    try {
      console.log('Executing code for', robotName, '…', code.length, 'chars');
      await new Promise((r) => setTimeout(r, 900));
      addPoints(50);
    } catch {
      console.error('Execution error');
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: `robot-${robotName}-${Date.now()}.py` }).click();
    URL.revokeObjectURL(url);
  };

  /* Auth loading */
  if (loading) {
    return (
      <div className="min-h-screen gradient-cyber flex items-center justify-center">
        <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
          <p className="text-xs terminal-text text-slate-500">Loading session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-cyber flex flex-col" style={{ height: '100dvh' }}>
      <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />

      {/* ═══════════════════════ TOP BAR ═══════════════════════ */}
      <header className="relative glass-dark border-b border-sky-400/10 shrink-0 z-20">
        <div className="px-3 h-12 flex items-center gap-2 overflow-x-auto">

          {/* Logo / back to booking */}
          <Link href="/booking" className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>

          <div className="h-5 w-px bg-sky-400/15 shrink-0" />

          {/* Robot badge */}
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-sky-400/8 border border-sky-400/15 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-semibold text-sky-400 terminal-text">{robotName}</span>
          </div>

          {/* Slot */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-xs terminal-text text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{slot}</span>
          </div>

          <div className="h-5 w-px bg-sky-400/15 shrink-0" />

          {/* Session timer */}
          <div className="flex items-center gap-1 text-xs terminal-text shrink-0">
            <Clock className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 font-mono">{timer}</span>
          </div>

          {/* WS connection */}
          <div className="hidden md:flex items-center gap-1 text-xs terminal-text shrink-0">
            {wsConnected
              ? <><Wifi className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">LIVE</span></>
              : <><WifiOff className="w-3 h-3 text-slate-600" /><span className="text-slate-600">OFFLINE</span></>}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-0" />

          {/* Score */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400/8 border border-yellow-400/15 rounded-lg shrink-0">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400 terminal-text">{score.toLocaleString()}</span>
          </div>

          <Link href="/leaderboard" className="shrink-0">
            <button className="flex items-center gap-1 px-2.5 py-1 glass hover:bg-white/10 rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden lg:inline">Board</span>
            </button>
          </Link>

          <div className="h-5 w-px bg-sky-400/15 shrink-0" />

          {/* User + actions */}
          {user && (
            <div className="flex items-center gap-1.5 shrink-0 text-xs terminal-text text-slate-500">
              <div className="w-5 h-5 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                {(user.name ?? user.email)[0].toUpperCase()}
              </div>
              <span className="hidden lg:inline max-w-24 truncate">{user.name ?? user.email}</span>
            </div>
          )}

          <button
            onClick={handleSaveCode}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 glass hover:bg-white/10 rounded-lg text-xs text-slate-400 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleExecuteCode}
            disabled={isExecuting}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs text-white disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#a855f7)', boxShadow: '0 0 12px rgba(14,165,233,0.35)' }}
          >
            {isExecuting
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span className="hidden sm:inline">Running…</span></>
              : <><Zap className="w-3.5 h-3.5" /><span className="hidden sm:inline">Execute</span></>}
          </button>

          <button
            onClick={logout}
            className="shrink-0 p-1.5 glass hover:bg-red-400/10 hover:border-red-400/20 rounded-lg transition-colors text-slate-500 hover:text-red-400"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ═══════════════════════ MAIN GRID ═══════════════════════ */}
      <div className="relative flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2">

        {/* ── Left: Video streams ── */}
        <div className="lg:col-span-3 flex flex-col gap-2 min-h-0">
          <div className="flex-1 min-h-0">
            <VideoStream cameraLabel="Camera 1 — Main" showAiOverlay={true} />
          </div>
          <div className="flex-1 min-h-0">
            <VideoStream cameraLabel="Camera 2 — Arm" showAiOverlay={false} />
          </div>
        </div>

        {/* ── Center: Code / 3D viewer ── */}
        <div className="lg:col-span-5 flex flex-col min-h-0 glass-dark rounded-xl border border-sky-400/15 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center border-b border-sky-400/10 shrink-0 px-2 pt-1 gap-1 bg-black/20">
            <button
              onClick={() => setCenterTab('code')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all ${
                centerTab === 'code'
                  ? 'bg-sky-400/10 border border-sky-400/20 border-b-0 text-sky-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code Editor
            </button>
            <button
              onClick={() => setCenterTab('3d')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all ${
                centerTab === '3d'
                  ? 'bg-amber-400/10 border border-amber-400/20 border-b-0 text-amber-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Robot 3D — {robotName}
            </button>

            {centerTab === 'code' && (
              <div className="ml-auto pr-1">
                <select className="text-xs glass rounded px-2 py-1 text-slate-400 border-0 bg-transparent cursor-pointer outline-none">
                  <option>Python</option>
                  <option>C++</option>
                  <option>JavaScript</option>
                </select>
              </div>
            )}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {centerTab === 'code' && (
              <CodeEditor value={code} onChange={(v) => setCode(v || '')} />
            )}
            {centerTab === '3d' && (
              <div className="h-full p-2">
                <Robot3DViewer />
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Controls + Logs ── */}
        <div className="lg:col-span-4 flex flex-col gap-2 min-h-0">
          <div className="flex-none" style={{ height: '46%' }}>
            <RobotControls />
          </div>
          <div className="flex-1 min-h-0">
            <LogsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page wrapper (Suspense required for useSearchParams) ─── */
export default function LabPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-cyber flex items-center justify-center">
        <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    }>
      <LabInner />
    </Suspense>
  );
}
