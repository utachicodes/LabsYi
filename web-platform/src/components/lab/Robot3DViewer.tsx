'use client';

import React, { useMemo } from 'react';
import { useRobotData } from '@/hooks/useRobotData';
import { Activity, Cpu } from 'lucide-react';

/* ─── geometry helpers ─── */
interface Point { x: number; y: number; }

function polar(origin: Point, angleDeg: number, length: number): Point {
  const rad = (angleDeg - 90) * (Math.PI / 180);   // -90 so 0° = straight up
  return {
    x: origin.x + Math.cos(rad) * length,
    y: origin.y + Math.sin(rad) * length,
  };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/* ─── Joint label overlay ─── */
function JointLabel({ cx, cy, label, angle }: { cx: number; cy: number; label: string; angle: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#0d1a2e" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={cx + 12} y={cy - 6} fontSize={8} fill="#38bdf8" fontFamily="monospace">
        {label}
      </text>
      <text x={cx + 12} y={cy + 4} fontSize={8} fill="#fbbf24" fontFamily="monospace">
        {angle.toFixed(1)}°
      </text>
    </g>
  );
}

/* ─── Single arm link ─── */
function ArmLink({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      {/* Shadow/glow line */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(56,189,248,0.15)" strokeWidth={12} strokeLinecap="round" />
      {/* Main link */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e3a5f" strokeWidth={8} strokeLinecap="round" />
      {/* Highlight */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
    </>
  );
}

/* ─── Gripper ─── */
function Gripper({ origin, angleDeg }: { origin: Point; angleDeg: number }) {
  const tip = polar(origin, angleDeg, 18);
  const l1 = polar(tip, angleDeg - 35, 14);
  const l2 = polar(tip, angleDeg + 35, 14);
  return (
    <g>
      <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke="#38bdf8" strokeWidth={2} opacity={0.8} />
      <line x1={tip.x} y1={tip.y} x2={l1.x} y2={l1.y} stroke="#34d399" strokeWidth={2} strokeLinecap="round" />
      <line x1={tip.x} y1={tip.y} x2={l2.x} y2={l2.y} stroke="#34d399" strokeWidth={2} strokeLinecap="round" />
      <circle cx={tip.x} cy={tip.y} r={4} fill="#0d1a2e" stroke="#34d399" strokeWidth={1.5} />
    </g>
  );
}

/* ─── Main component ─── */
export default function Robot3DViewer() {
  const { jointData, isConnected } = useRobotData();

  // Extract joint angles from WebSocket data (fallback to idle defaults)
  const joints = useMemo(() => {
    const raw = jointData?.joints ?? {};
    const vals = Object.values(raw).map(Number);
    // Map to 4 display joints; scale to reasonable degree ranges
    const get = (i: number, lo: number, hi: number, def: number) =>
      vals[i] !== undefined ? clamp(vals[i] * (hi - lo) + lo, lo, hi) : def;
    return {
      j1: get(0, -80, 80, 0),      // shoulder pan
      j2: get(1, -20, 140, 65),    // shoulder lift
      j3: get(2, -150, 10, -90),   // elbow
      j4: get(3, -120, 120, 20),   // wrist
    };
  }, [jointData]);

  // Forward kinematics in SVG space
  const BASE: Point = { x: 200, y: 360 };
  const L1 = 100, L2 = 80, L3 = 60;

  const absJ1 = joints.j1;
  const absJ2 = absJ1 + joints.j2;
  const absJ3 = absJ2 + joints.j3;
  const absJ4 = absJ3 + joints.j4;

  const elbow  = polar(BASE, absJ1, L1);
  const wrist  = polar(elbow, absJ2, L2);
  const tip    = polar(wrist, absJ3, L3);

  return (
    <div className="glass-dark rounded-xl flex flex-col h-full border border-sky-400/15 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-sky-400/10">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-semibold">Robot 3D Viewer</span>
          <span className="text-xs terminal-text text-slate-500">— side profile</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span className={`text-xs terminal-text ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isConnected ? 'LIVE' : 'STATIC'}
          </span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'dot-online animate-pulse' : 'dot-offline'}`} />
        </div>
      </div>

      {/* SVG viewport */}
      <div className="flex-1 relative p-2">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{ maxHeight: '100%' }}
        >
          {/* ── Grid ── */}
          <defs>
            <pattern id="grid3d" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="baseGlow" cx="50%" cy="80%" r="30%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect width="400" height="400" fill="url(#grid3d)" />
          {/* Floor line */}
          <line x1="40" y1="375" x2="360" y2="375" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />

          {/* ── Base platform ── */}
          <rect x={130} y={363} width={140} height={12} rx={3} fill="#0d1a2e" stroke="#38bdf8" strokeWidth={1} opacity={0.8} />
          <rect x={155} y={355} width={90} height={10} rx={2} fill="#112238" stroke="#38bdf8" strokeWidth={1} />
          <ellipse cx={200} cy={355} rx={30} ry={6} fill="url(#baseGlow)" />

          {/* ── Robot arm links ── */}
          <ArmLink x1={BASE.x} y1={BASE.y} x2={elbow.x} y2={elbow.y} />
          <ArmLink x1={elbow.x} y1={elbow.y} x2={wrist.x} y2={wrist.y} />
          <ArmLink x1={wrist.x} y1={wrist.y} x2={tip.x} y2={tip.y} />

          {/* ── Joints ── */}
          <JointLabel cx={BASE.x} cy={BASE.y} label="J1" angle={joints.j1} />
          <JointLabel cx={elbow.x} cy={elbow.y} label="J2" angle={joints.j2} />
          <JointLabel cx={wrist.x} cy={wrist.y} label="J3" angle={joints.j3} />

          {/* ── Gripper ── */}
          <Gripper origin={tip} angleDeg={absJ4} />

          {/* ── End effector dot ── */}
          <circle cx={tip.x} cy={tip.y} r={5} fill="#0d1a2e" stroke="#fbbf24" strokeWidth={1.5} filter="url(#glow)" />

          {/* ── Reach indicator (faint arc) ── */}
          <circle
            cx={BASE.x} cy={BASE.y}
            r={L1 + L2 + L3 - 10}
            fill="none"
            stroke="rgba(56,189,248,0.06)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />

          {/* ── Axis labels ── */}
          <text x={15} y={375} fontSize={8} fill="rgba(56,189,248,0.3)" fontFamily="monospace">Z</text>
          <text x={370} y={375} fontSize={8} fill="rgba(56,189,248,0.3)" fontFamily="monospace">X</text>
          <line x1={20} y1={370} x2={20} y2={40} stroke="rgba(56,189,248,0.12)" strokeWidth={0.5} />
          <line x1={20} y1={370} x2={380} y2={370} stroke="rgba(56,189,248,0.12)" strokeWidth={0.5} />
        </svg>
      </div>

      {/* Joint data readout strip */}
      <div className="grid grid-cols-4 border-t border-sky-400/10 divide-x divide-sky-400/10">
        {[
          { label: 'J1', value: joints.j1 },
          { label: 'J2', value: joints.j2 },
          { label: 'J3', value: joints.j3 },
          { label: 'J4', value: joints.j4 },
        ].map((j) => (
          <div key={j.label} className="px-2 py-1.5 text-center">
            <div className="text-xs terminal-text text-slate-500">{j.label}</div>
            <div className="text-xs terminal-text text-amber-400 font-bold">{j.value.toFixed(1)}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
