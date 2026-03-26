'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Maximize2, Minimize2, Camera, Circle, Eye, EyeOff, Wifi } from 'lucide-react';

interface AiBox {
  id: number;
  label: string;
  conf: number;
  x: number; y: number; w: number; h: number;
  color: string;
}

interface VideoStreamProps {
  streamUrl?: string;
  cameraLabel?: string;
  showAiOverlay?: boolean;
}

/* Demo AI detections – in production these come from the backend */
const DEMO_BOXES: AiBox[] = [
  { id: 1, label: 'robot_arm', conf: 0.97, x: 15, y: 20, w: 35, h: 55, color: '#38bdf8' },
  { id: 2, label: 'object',    conf: 0.83, x: 60, y: 40, w: 20, h: 20, color: '#34d399' },
  { id: 3, label: 'hand',      conf: 0.91, x: 55, y: 15, w: 18, h: 22, color: '#fbbf24' },
];

export default function VideoStream({ streamUrl, cameraLabel = 'Lab Camera', showAiOverlay: initAi = true }: VideoStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiEnabled, setAiEnabled]       = useState(initAi);
  const [aiBoxes, setAiBoxes]           = useState<AiBox[]>(DEMO_BOXES);
  const [frameCount, setFrameCount]     = useState(0);
  const [recording, setRecording]       = useState(false);

  /* Simulate boxes drifting slightly */
  useEffect(() => {
    if (!aiEnabled) return;
    const id = setInterval(() => {
      setFrameCount((n) => n + 1);
      setAiBoxes((prev) =>
        prev.map((b) => ({
          ...b,
          x: clamp(b.x + (Math.random() - 0.5) * 0.6, 5, 80),
          y: clamp(b.y + (Math.random() - 0.5) * 0.4, 5, 75),
          conf: clamp(b.conf + (Math.random() - 0.5) * 0.01, 0.7, 0.99),
        }))
      );
    }, 600);
    return () => clearInterval(id);
  }, [aiEnabled]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div ref={containerRef} className="glass-dark rounded-xl flex flex-col h-full border border-sky-400/15 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-sky-400/10 shrink-0">
        <div className="flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200">{cameraLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* AI toggle */}
          <button
            onClick={() => setAiEnabled((v) => !v)}
            title="Toggle AI overlay"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-all ${
              aiEnabled
                ? 'bg-emerald-400/15 border border-emerald-400/30 text-emerald-400'
                : 'glass text-slate-500 border border-white/10'
            }`}
          >
            {aiEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            AI
          </button>
          {/* Live badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/15 border border-red-400/30 rounded text-xs font-bold text-red-400">
            <Circle className="w-2 h-2 fill-red-400 animate-pulse" />
            LIVE
          </div>
          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1 glass rounded hover:bg-white/15 transition-colors text-slate-400"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Video area ── */}
      <div className="flex-1 relative bg-black overflow-hidden min-h-0">
        {/* Placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Wifi className="w-10 h-10 mx-auto text-sky-400/30 mb-2" />
            <p className="text-xs text-slate-600 terminal-text">Waiting for stream…</p>
            <p className="text-xs text-slate-700 terminal-text">Connect robot to start</p>
          </div>
        </div>

        {/* Subtle CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Scan line */}
        <div className="video-scanline" />

        {/* Actual video element */}
        <video
          ref={videoRef}
          src={streamUrl}
          className="absolute inset-0 w-full h-full object-contain"
          autoPlay
          playsInline
          muted
        />

        {/* ── AI overlay boxes ── */}
        {aiEnabled && aiBoxes.map((box) => (
          <div
            key={box.id}
            className="absolute"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
              border: `1.5px solid ${box.color}`,
              boxShadow: `0 0 8px ${box.color}55`,
              transition: 'all 0.5s ease',
            }}
          >
            {/* Label */}
            <div
              className="absolute text-black font-bold"
              style={{
                top: '-18px',
                left: '-1px',
                background: box.color,
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '2px',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
              }}
            >
              {box.label} {(box.conf * 100).toFixed(0)}%
            </div>
            {/* Corner ticks */}
            <div className="absolute top-0 left-0 w-2 h-2" style={{ borderTop: `2px solid ${box.color}`, borderLeft: `2px solid ${box.color}` }} />
            <div className="absolute top-0 right-0 w-2 h-2" style={{ borderTop: `2px solid ${box.color}`, borderRight: `2px solid ${box.color}` }} />
            <div className="absolute bottom-0 left-0 w-2 h-2" style={{ borderBottom: `2px solid ${box.color}`, borderLeft: `2px solid ${box.color}` }} />
            <div className="absolute bottom-0 right-0 w-2 h-2" style={{ borderBottom: `2px solid ${box.color}`, borderRight: `2px solid ${box.color}` }} />
          </div>
        ))}

        {/* AI info panel (top-left when enabled) */}
        {aiEnabled && (
          <div className="absolute bottom-2 left-2 space-y-0.5">
            {aiBoxes.map((b) => (
              <div key={b.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: b.color }} />
                <span className="text-xs terminal-text" style={{ color: b.color }}>{b.label}</span>
                <span className="text-xs terminal-text text-slate-400">{(b.conf * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Frame counter */}
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded text-xs terminal-text text-slate-500" style={{ background: 'rgba(0,0,0,0.5)' }}>
            {String(frameCount).padStart(5, '0')}
          </span>
        </div>

        {/* Recording indicator */}
        {recording && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.8)' }}>
            <Circle className="w-2 h-2 fill-white animate-pulse" />
            <span className="text-xs font-bold text-white">REC</span>
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-sky-400/10 shrink-0">
        <div className="flex gap-1.5">
          <button className="px-2 py-1 glass hover:bg-white/10 rounded text-xs text-slate-400 transition-colors flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Snapshot
          </button>
          <button
            onClick={() => setRecording((v) => !v)}
            className={`px-2 py-1 rounded text-xs transition-all flex items-center gap-1 ${
              recording
                ? 'bg-red-500/20 border border-red-400/30 text-red-400'
                : 'glass hover:bg-white/10 text-slate-400'
            }`}
          >
            <Circle className={`w-3 h-3 ${recording ? 'fill-red-400' : ''}`} />
            {recording ? 'Stop' : 'Record'}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs terminal-text text-slate-600">
          <span>1080p</span>
          <span>·</span>
          <span>30fps</span>
          {aiEnabled && (
            <>
              <span>·</span>
              <span className="text-emerald-400">AI ON</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
