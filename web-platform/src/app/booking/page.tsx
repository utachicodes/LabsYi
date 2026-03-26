'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { saveBooking } from '@/lib/supabase';
import {
  Bot, ChevronLeft, ChevronRight, Calendar, Clock, Cpu,
  CheckCircle, Loader2, LogOut, ChevronDown
} from 'lucide-react';

/* ─── Robot catalogue ─── */
const ROBOTS = [
  { id: 'robot-1', name: 'SO-100',     type: 'Follower Arm',  icon: '🦾', color: 'sky'    },
  { id: 'robot-2', name: 'Koch v1.1',  type: 'Leader/Follow', icon: '🤖', color: 'violet' },
  { id: 'robot-3', name: 'Lekiwi',     type: 'Mobile Base',   icon: '🚗', color: 'emerald'},
];

/* ─── Deterministic slot availability (based on date hash) ─── */
function slotsForDate(date: Date): Array<{ id: string; hour: number; label: string; available: boolean; robot: typeof ROBOTS[0] }> {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    const available = ((seed + i * 7) % 5) !== 0;          // ~80% available, deterministic
    const robot = ROBOTS[(seed + i) % ROBOTS.length];
    return {
      id: `slot-${i}`,
      hour,
      label: `${String(hour).padStart(2, '0')}:00 – ${String(hour + 1).padStart(2, '0')}:00`,
      available,
      robot,
    };
  });
}

/* ─── Calendar helpers ─── */
function isoDate(d: Date) { return d.toISOString().split('T')[0]; }
function sameDay(a: Date, b: Date) { return isoDate(a) === isoDate(b); }

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MiniCalendar({
  value, onChange
}: { value: Date; onChange: (d: Date) => void }) {
  const [view, setView] = useState(() => {
    const d = new Date(value); d.setDate(1); return d;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

  const cells: Array<Date | null> = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      new Date(view.getFullYear(), view.getMonth(), i + 1)
    ),
  ];

  const prevMonth = () => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const nextMonth = () => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-sky-400/10 rounded transition-colors text-slate-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-white">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-sky-400/10 rounded transition-colors text-slate-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs terminal-text text-slate-600 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isPast      = d < today;
          const isSelected  = sameDay(d, value);
          const isToday     = sameDay(d, today);
          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onChange(d)}
              className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'text-white font-bold'
                  : isPast
                  ? 'text-slate-700 cursor-not-allowed'
                  : isToday
                  ? 'text-sky-400 bg-sky-400/10'
                  : 'text-slate-400 hover:bg-sky-400/10 hover:text-sky-300'
              }`}
              style={isSelected ? { background: 'linear-gradient(135deg,#0ea5e9,#a855f7)', boxShadow: '0 0 12px rgba(14,165,233,0.4)' } : {}}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function BookingPage() {
  const router            = useRouter();
  const { user, loading, logout } = useAuth({ redirectTo: '/auth/login' });

  const [selectedDate, setDate]  = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [selectedSlot, setSlot]  = useState<ReturnType<typeof slotsForDate>[0] | null>(null);
  const [confirming, setConfirm] = useState(false);
  const [done, setDone]          = useState(false);

  const slots = useMemo(() => slotsForDate(selectedDate), [selectedDate]);

  /* When date changes, clear any previously selected slot */
  const handleDateChange = (d: Date) => { setDate(d); setSlot(null); };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setConfirm(true);

    const startDt = new Date(selectedDate);
    startDt.setHours(selectedSlot.hour, 0, 0, 0);
    const endDt = new Date(startDt);
    endDt.setHours(startDt.getHours() + 1);

    await saveBooking({
      robot_id:   selectedSlot.robot.id,
      robot_name: selectedSlot.robot.name,
      date:       isoDate(selectedDate),
      slot:       selectedSlot.label,
      start_time: startDt.toISOString(),
      end_time:   endDt.toISOString(),
    });

    setDone(true);
    setConfirm(false);

    // Brief success flash then redirect
    setTimeout(() => {
      const params = new URLSearchParams({
        robot:     selectedSlot.robot.id,
        robotName: selectedSlot.robot.name,
        slot:      selectedSlot.label,
        date:      isoDate(selectedDate),
      });
      router.push(`/lab?${params.toString()}`);
    }, 1400);
  };

  /* ─── Auth loading screen ─── */
  if (loading) {
    return (
      <div className="min-h-screen gradient-cyber flex items-center justify-center">
        <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  /* ─── Success overlay ─── */
  if (done) {
    return (
      <div className="min-h-screen gradient-cyber flex items-center justify-center">
        <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />
        <div className="cyber-card rounded-2xl p-10 text-center neon-border max-w-sm w-full">
          <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4 glow-green" />
          <h2 className="text-2xl font-bold text-white mb-2">Session Booked!</h2>
          <p className="text-slate-400 text-sm mb-1">{selectedSlot?.label}</p>
          <p className="text-slate-400 text-sm mb-6">{selectedSlot?.robot.name} · {selectedDate.toDateString()}</p>
          <p className="text-xs terminal-text text-sky-400">Redirecting to your lab…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-cyber">
      <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />

      {/* ── Nav ── */}
      <nav className="relative glass-dark border-b border-sky-400/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">LabsYi</span>
          </Link>

          <div className="h-5 w-px bg-sky-400/15" />
          <Calendar className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white text-sm">Book a Session</span>

          <div className="flex-1" />

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs terminal-text text-slate-500">
                <div className="w-6 h-6 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <span>{user.name ?? user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-white/10 rounded-lg text-xs text-slate-400 hover:text-white transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs terminal-text text-sky-400 tracking-widest mb-2">STEP 2 OF 2</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Book a <span className="gradient-primary bg-clip-text text-transparent">Lab Session</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Select a date, pick an available time slot, and get exclusive access to a real robot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── Left: Calendar + Robot cards ── */}
          <div className="lg:col-span-4 space-y-4">
            {/* Calendar */}
            <div className="cyber-card rounded-xl p-5 border border-sky-400/10">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold text-white">Select Date</span>
              </div>
              <MiniCalendar value={selectedDate} onChange={handleDateChange} />
              <div className="mt-4 pt-3 border-t border-sky-400/8 text-xs terminal-text text-slate-500">
                {selectedDate.toDateString()}
              </div>
            </div>

            {/* Robot legend */}
            <div className="cyber-card rounded-xl p-5 border border-sky-400/10">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold text-white">Available Robots</span>
              </div>
              <div className="space-y-2.5">
                {ROBOTS.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/40 border border-sky-400/8">
                    <span className="text-xl">{r.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{r.name}</p>
                      <p className="text-xs terminal-text text-slate-500">{r.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-3 text-xs terminal-text">
              <div className="flex items-center gap-1.5 text-slate-500">
                <div className="w-3 h-3 rounded-sm bg-emerald-400/30 border border-emerald-400/50" />
                Available
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <div className="w-3 h-3 rounded-sm bg-slate-700" />
                Booked
              </div>
              <div className="flex items-center gap-1.5 text-sky-400">
                <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg,#0ea5e9,#a855f7)' }} />
                Selected
              </div>
            </div>
          </div>

          {/* ── Right: Time slots + summary ── */}
          <div className="lg:col-span-8 space-y-4">
            {/* Slots grid */}
            <div className="cyber-card rounded-xl p-5 border border-sky-400/10">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold text-white">
                  Time Slots — {selectedDate.toDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setSlot(slot)}
                      disabled={!slot.available}
                      className={`group relative p-4 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'border-sky-400/60 text-white'
                          : slot.available
                          ? 'border-emerald-400/15 hover:border-emerald-400/35 bg-emerald-400/3 hover:bg-emerald-400/6'
                          : 'border-slate-800 bg-slate-900/30 cursor-not-allowed opacity-40'
                      }`}
                      style={isSelected ? { background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(168,85,247,0.15))', boxShadow: '0 0 20px rgba(14,165,233,0.15)' } : {}}
                    >
                      {/* Time */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          {slot.label}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-sky-400" />}
                        {!isSelected && slot.available && (
                          <span className="text-xs terminal-text text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
                            OPEN
                          </span>
                        )}
                        {!slot.available && (
                          <span className="text-xs terminal-text text-slate-600">BOOKED</span>
                        )}
                      </div>

                      {/* Robot assignment */}
                      {slot.available && (
                        <div className="flex items-center gap-2">
                          <span className="text-base">{slot.robot.icon}</span>
                          <div>
                            <span className="text-xs font-semibold text-slate-300">{slot.robot.name}</span>
                            <span className="text-xs text-slate-600 ml-1">· {slot.robot.type}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Booking summary + confirm ── */}
            {selectedSlot ? (
              <div className="cyber-card rounded-xl p-5 border border-sky-400/25 neon-border">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400" />
                  Booking Summary
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div>
                    <p className="text-xs terminal-text text-slate-600 mb-1">DATE</p>
                    <p className="text-sm font-semibold text-white">{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs terminal-text text-slate-600 mb-1">TIME SLOT</p>
                    <p className="text-sm font-semibold text-white">{selectedSlot.label}</p>
                  </div>
                  <div>
                    <p className="text-xs terminal-text text-slate-600 mb-1">ROBOT</p>
                    <p className="text-sm font-semibold text-white">{selectedSlot.robot.icon} {selectedSlot.robot.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #a855f7)', boxShadow: '0 0 20px rgba(14,165,233,0.35)' }}
                  >
                    {confirming
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Confirming…</>
                      : <><CheckCircle className="w-4 h-4" />Confirm &amp; Enter Lab</>}
                  </button>
                  <button
                    onClick={() => setSlot(null)}
                    className="px-4 py-3 glass hover:bg-white/10 rounded-xl text-sm text-slate-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="cyber-card rounded-xl p-5 border border-sky-400/8 text-center">
                <ChevronDown className="w-5 h-5 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-600 terminal-text">Select an available time slot above to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
