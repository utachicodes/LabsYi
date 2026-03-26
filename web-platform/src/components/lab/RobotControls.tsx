'use client';

import React, { useState } from 'react';
import { robotAPI } from '@/lib/api/robot';
import { useRobotData } from '@/hooks/useRobotData';
import {
  AlertOctagon, Play, Square, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Minus, Plus, Cpu, Wifi, WifiOff
} from 'lucide-react';

/* ─── Directional pad button ─── */
function DPadBtn({
  icon, label, onMouseDown, onMouseUp
}: {
  icon: React.ReactNode;
  label: string;
  onMouseDown: () => void;
  onMouseUp: () => void;
}) {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      aria-label={label}
      className="w-10 h-10 glass hover:bg-sky-400/15 border border-sky-400/15 hover:border-sky-400/40 rounded-lg flex items-center justify-center text-slate-300 hover:text-sky-400 transition-all active:scale-95 active:bg-sky-400/20"
    >
      {icon}
    </button>
  );
}

/* ─── Joint gauge ─── */
function JointGauge({ name, value }: { name: string; value: number }) {
  const pct = Math.min(100, Math.max(0, (value + 1) * 50)); // map [-1,1] → [0,100]
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs terminal-text">
        <span className="text-slate-500">{name}</span>
        <span className="text-amber-400">{typeof value === 'number' ? value.toFixed(3) : value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #38bdf8, #a78bfa)`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function RobotControls() {
  const { jointData, isConnected } = useRobotData();
  const [isRunning, setIsRunning]   = useState(false);
  const [status, setStatus]         = useState<'idle' | 'teleop' | 'stopped' | 'error'>('idle');
  const [speed, setSpeed]           = useState(50);

  /* Emergency stop */
  const handleEmergencyStop = async () => {
    try {
      await Promise.all([
        robotAPI.stopTeleoperation(),
        robotAPI.stopRecording(),
        robotAPI.stopTraining(),
        robotAPI.stopReplay(),
      ]);
      setIsRunning(false);
      setStatus('stopped');
    } catch { /* silent */ }
  };

  /* Start teleoperation */
  const handleStartTeleop = async () => {
    try {
      const configs = await robotAPI.getConfigs();
      if (configs.leader_configs?.length && configs.follower_configs?.length) {
        const res = await robotAPI.startTeleoperation({
          leader_config: configs.leader_configs[0],
          follower_config: configs.follower_configs[0],
        });
        if (res.status === 'success') { setIsRunning(true); setStatus('teleop'); }
      }
    } catch { setStatus('error'); }
  };

  const handleStop = async () => {
    try { await robotAPI.stopTeleoperation(); setIsRunning(false); setStatus('idle'); } catch { /* silent */ }
  };

  /* D-Pad handlers (placeholder — wire to your robot motion API) */
  const move = (dir: string) => () => console.log('move', dir, speed);
  const stop = () => console.log('move stop');

  const statusColors: Record<typeof status, string> = {
    idle:    'text-slate-500',
    teleop:  'text-emerald-400',
    stopped: 'text-amber-400',
    error:   'text-red-400',
  };
  const statusDots: Record<typeof status, string> = {
    idle:    'dot-offline',
    teleop:  'dot-online',
    stopped: 'dot-warning',
    error:   'dot-offline',
  };

  return (
    <div className="glass-dark rounded-xl flex flex-col h-full border border-sky-400/15 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-sky-400/10 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-semibold">Robot Controls</span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected
            ? <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            : <WifiOff className="w-3.5 h-3.5 text-slate-500" />}
          <div className={`w-2 h-2 rounded-full ${statusDots[status]} ${status === 'teleop' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs terminal-text ${statusColors[status]}`}>{status.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* ── Emergency stop ── */}
        <button
          onClick={handleEmergencyStop}
          className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 active:scale-98"
          style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 20px rgba(220,38,38,0.4)' }}
        >
          <AlertOctagon className="w-5 h-5" />
          EMERGENCY STOP
        </button>

        {/* ── Teleop start/stop ── */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleStartTeleop}
            disabled={isRunning}
            className="py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={isRunning ? {} : { background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}
          >
            <Play className="w-3.5 h-3.5" />
            Start Teleop
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 glass hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-slate-400"
          >
            <Square className="w-3.5 h-3.5" />
            Stop
          </button>
        </div>

        {/* ── D-pad ── */}
        <div>
          <p className="text-xs terminal-text text-slate-600 mb-2">DIRECTIONAL CONTROL</p>
          <div className="flex flex-col items-center gap-1">
            <DPadBtn icon={<ChevronUp className="w-4 h-4" />} label="Forward" onMouseDown={move('forward')} onMouseUp={stop} />
            <div className="flex gap-1">
              <DPadBtn icon={<ChevronLeft className="w-4 h-4" />} label="Left" onMouseDown={move('left')} onMouseUp={stop} />
              <div className="w-10 h-10 rounded-lg border border-sky-400/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-sky-400/30" />
              </div>
              <DPadBtn icon={<ChevronRight className="w-4 h-4" />} label="Right" onMouseDown={move('right')} onMouseUp={stop} />
            </div>
            <DPadBtn icon={<ChevronDown className="w-4 h-4" />} label="Backward" onMouseDown={move('backward')} onMouseUp={stop} />
          </div>
        </div>

        {/* ── Speed control ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs terminal-text text-slate-600">SPEED</p>
            <span className="text-xs terminal-text text-sky-400 font-bold">{speed}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeed((v) => Math.max(10, v - 10))}
              className="w-7 h-7 glass hover:bg-white/10 rounded flex items-center justify-center text-slate-400"
            >
              <Minus className="w-3 h-3" />
            </button>
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 relative">
              <div
                className="h-full rounded-full"
                style={{ width: `${speed}%`, background: 'linear-gradient(90deg, #38bdf8, #a78bfa)' }}
              />
            </div>
            <button
              onClick={() => setSpeed((v) => Math.min(100, v + 10))}
              className="w-7 h-7 glass hover:bg-white/10 rounded flex items-center justify-center text-slate-400"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ── Joint positions ── */}
        {jointData && Object.keys(jointData.joints || {}).length > 0 && (
          <div>
            <p className="text-xs terminal-text text-slate-600 mb-2">JOINT POSITIONS</p>
            <div className="space-y-2">
              {Object.entries(jointData.joints).map(([name, val]) => (
                <JointGauge key={name} name={name} value={val as number} />
              ))}
            </div>
          </div>
        )}

        {/* ── No data placeholder ── */}
        {(!jointData || Object.keys(jointData?.joints ?? {}).length === 0) && (
          <div className="py-4 text-center text-xs terminal-text text-slate-600">
            No joint data — start teleoperation to see live positions
          </div>
        )}
      </div>
    </div>
  );
}
