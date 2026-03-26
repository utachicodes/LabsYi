'use client';

import React, { useState, useEffect, useRef } from 'react';
import { robotAPI } from '@/lib/api/robot';
import { Download, Trash2, Pin, PinOff, Terminal, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'error' | 'warning' | 'success';
  message: string;
}

let _logId = 0;
function nextId() { return ++_logId; }

const LEVEL_META = {
  info:    { color: 'text-sky-400',     icon: <Info className="w-3 h-3 shrink-0" />,          prefix: 'INFO' },
  success: { color: 'text-emerald-400', icon: <CheckCircle className="w-3 h-3 shrink-0" />,   prefix: 'OK  ' },
  warning: { color: 'text-amber-400',   icon: <AlertTriangle className="w-3 h-3 shrink-0" />, prefix: 'WARN' },
  error:   { color: 'text-red-400',     icon: <XCircle className="w-3 h-3 shrink-0" />,       prefix: 'ERR ' },
};

const BOOT_SEQUENCE: LogEntry[] = [
  { id: nextId(), timestamp: '00:00:00', level: 'info',    message: 'LabsYi runtime v2.1.0 starting…' },
  { id: nextId(), timestamp: '00:00:00', level: 'success', message: 'WebSocket connected → ws://localhost:8000/ws/joint-data' },
  { id: nextId(), timestamp: '00:00:00', level: 'info',    message: 'Video stream initialised' },
  { id: nextId(), timestamp: '00:00:00', level: 'info',    message: 'Waiting for robot connection…' },
];

export default function LogsPanel() {
  const [logs, setLogs]           = useState<LogEntry[]>(BOOT_SEQUENCE);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter]       = useState<'all' | LogEntry['level']>('all');
  const logsEndRef                = useRef<HTMLDivElement>(null);

  const addLog = (message: string, level: LogEntry['level'] = 'info') => {
    const ts = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs((prev) => [...prev, { id: nextId(), timestamp: ts, level, message }].slice(-200));
  };

  /* Poll training logs */
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await robotAPI.getTrainingLogs();
        if (res.logs?.length) {
          res.logs.forEach((l: string) => addLog(l, 'info'));
        }
      } catch { /* silent */ }
    }, 2500);
    return () => clearInterval(id);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    if (autoScroll) logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, autoScroll]);

  const visible = filter === 'all' ? logs : logs.filter((l) => l.level === filter);

  const downloadLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${LEVEL_META[l.level].prefix}] ${l.message}`)
      .join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `robot-logs-${Date.now()}.txt` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterColors: Record<typeof filter, string> = {
    all:     'glass border-white/10 text-slate-400',
    info:    'bg-sky-400/15 border-sky-400/30 text-sky-400',
    success: 'bg-emerald-400/15 border-emerald-400/30 text-emerald-400',
    warning: 'bg-amber-400/15 border-amber-400/30 text-amber-400',
    error:   'bg-red-400/15 border-red-400/30 text-red-400',
  };

  return (
    <div className="glass-dark rounded-xl flex flex-col h-full border border-sky-400/15 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-sky-400/10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-semibold">Execution Logs</span>
          <span className="px-1.5 py-0.5 text-xs terminal-text bg-sky-400/10 border border-sky-400/20 rounded text-sky-400">
            {logs.length}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setAutoScroll((v) => !v)}
            title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
            className={`p-1.5 rounded text-xs transition-colors ${autoScroll ? 'bg-sky-400/15 text-sky-400' : 'glass text-slate-500'}`}
          >
            {autoScroll ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
          </button>
          <button onClick={downloadLogs} className="p-1.5 glass hover:bg-white/10 rounded transition-colors text-slate-400">
            <Download className="w-3 h-3" />
          </button>
          <button onClick={() => setLogs([])} className="p-1.5 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 rounded transition-colors text-red-400">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-1 px-3 py-1.5 border-b border-sky-400/8 shrink-0">
        {(['all', 'info', 'success', 'warning', 'error'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 rounded text-xs terminal-text border transition-colors ${filter === f ? filterColors[f] : 'glass border-white/5 text-slate-600 hover:text-slate-400'}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Log output ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 min-h-0 log-terminal">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-700 text-xs terminal-text py-8">
            <Terminal className="w-8 h-8 mb-2 opacity-30" />
            No log entries
          </div>
        ) : (
          visible.map((log) => {
            const meta = LEVEL_META[log.level];
            return (
              <div
                key={log.id}
                className="flex items-start gap-2 px-2 py-0.5 rounded hover:bg-white/3 group"
              >
                <span className="text-slate-700 shrink-0 group-hover:text-slate-600 transition-colors">
                  {log.timestamp}
                </span>
                <span className={`shrink-0 ${meta.color}`}>{meta.icon}</span>
                <span className={`flex-1 break-all ${meta.color}`}>{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={logsEndRef} />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-sky-400/8 shrink-0">
        <span className="text-xs terminal-text text-slate-700">{visible.length} entries</span>
        <span className="text-xs terminal-text text-slate-700">
          {logs.at(-1)?.timestamp ?? '—'}
        </span>
      </div>
    </div>
  );
}
