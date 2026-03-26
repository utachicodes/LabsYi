'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy, Bot, Star, Activity, ChevronLeft, Flame,
  Target, TrendingUp, Medal
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number; name: string; score: number; sessions: number;
  accuracy: number; streak: number; badge: string; isMe?: boolean;
}

/* ─── Mock data — replace with Supabase query ─── */
const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,  name: 'Aisha K.',    score: 9420, sessions: 38, accuracy: 97, streak: 12, badge: 'gold'   },
  { rank: 2,  name: 'Marco R.',    score: 8815, sessions: 34, accuracy: 95, streak: 8,  badge: 'silver' },
  { rank: 3,  name: 'Yuki T.',     score: 8230, sessions: 31, accuracy: 93, streak: 6,  badge: 'bronze' },
  { rank: 4,  name: 'Priya M.',    score: 7650, sessions: 29, accuracy: 91, streak: 5,  badge: ''       },
  { rank: 5,  name: 'Leon B.',     score: 7120, sessions: 26, accuracy: 89, streak: 3,  badge: ''       },
  { rank: 6,  name: 'Sara W.',     score: 6880, sessions: 24, accuracy: 88, streak: 2,  badge: ''       },
  { rank: 7,  name: 'James O.',    score: 6410, sessions: 22, accuracy: 86, streak: 0,  badge: ''       },
  { rank: 8,  name: 'Nina C.',     score: 5990, sessions: 21, accuracy: 85, streak: 4,  badge: ''       },
  { rank: 9,  name: 'Arjun S.',    score: 5620, sessions: 19, accuracy: 83, streak: 1,  badge: ''       },
  { rank: 10, name: 'Clara M.',    score: 5200, sessions: 18, accuracy: 82, streak: 0,  badge: ''       },
  { rank: 11, name: 'You',         score: 1240, sessions: 5,  accuracy: 74, streak: 1,  badge: '',  isMe: true },
];

const TABS = ['All Time', 'This Week', 'Today'] as const;
type Tab = typeof TABS[number];

/* ─── Medal indicator for top 3 ─── */
function RankBadge({ rank, badge }: { rank: number; badge: string }) {
  if (badge === 'gold')   return <Medal className="w-5 h-5 text-yellow-400" />;
  if (badge === 'silver') return <Medal className="w-5 h-5 text-slate-300" />;
  if (badge === 'bronze') return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-mono text-slate-600">#{rank}</span>;
}

/* ─── Podium card ─── */
function PodiumCard({ user, highlight }: { user: typeof LEADERBOARD[0]; highlight?: boolean }) {
  const colors: Record<string, string> = {
    gold:   'from-yellow-400/20 to-yellow-600/5 border-yellow-400/30',
    silver: 'from-slate-300/15 to-slate-500/5 border-slate-400/25',
    bronze: 'from-amber-600/20 to-amber-800/5 border-amber-600/25',
  };
  const textColors: Record<string, string> = {
    gold: 'text-yellow-400', silver: 'text-slate-300', bronze: 'text-amber-500',
  };
  return (
    <div className={`relative rounded-xl border bg-gradient-to-b ${colors[user.badge]} ${highlight ? 'py-8' : 'py-6'} px-6 text-center`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Flame className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
      )}
      <div className={`text-3xl font-black mb-2 ${textColors[user.badge] || 'text-white'}`}>
        {user.badge === 'gold' ? '🥇' : user.badge === 'silver' ? '🥈' : '🥉'}
      </div>
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/30 border border-sky-400/20 flex items-center justify-center text-lg font-bold text-white">
        {user.name[0]}
      </div>
      <p className="font-semibold text-white text-sm mb-1">{user.name}</p>
      <p className={`text-xl font-black terminal-text ${textColors[user.badge]}`}>
        {user.score.toLocaleString()}
      </p>
      <p className="text-xs text-slate-600 terminal-text mt-1">{user.sessions} sessions</p>
    </div>
  );
}

/* ─── Main page ─── */
export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('All Time');

  const top3    = LEADERBOARD.filter((u) => u.rank <= 3);
  const rest    = LEADERBOARD.filter((u) => u.rank > 3);

  return (
    <div className="min-h-screen gradient-cyber">
      {/* Background grid */}
      <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />

      {/* ── Nav ── */}
      <nav className="relative glass-dark border-b border-sky-400/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">LabsYi</span>
          </Link>

          <div className="h-5 w-px bg-sky-400/15" />

          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-white text-sm">Global Leaderboard</span>

          <div className="flex-1" />

          <Link href="/lab">
            <button className="px-4 py-1.5 gradient-primary text-white rounded-lg text-xs font-semibold glow hover:opacity-90">
              Open Lab
            </button>
          </Link>
        </div>
      </nav>

      <div className="relative max-w-5xl mx-auto px-4 py-12">

        {/* ── Title ── */}
        <div className="text-center mb-12">
          <p className="text-xs terminal-text text-yellow-400 tracking-widest mb-3">TEAM 3 · SCORE SYSTEM</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Global <span className="gradient-primary bg-clip-text text-transparent">Leaderboard</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Earn points by completing robot tasks, recording quality datasets, and training accurate models.
          </p>
        </div>

        {/* ── Scoring legend ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: <Target className="w-4 h-4" />,    label: 'Task Completed', pts: '+50',  color: 'text-sky-400'     },
            { icon: <Activity className="w-4 h-4" />,  label: 'Dataset Recorded', pts: '+30', color: 'text-violet-400' },
            { icon: <TrendingUp className="w-4 h-4" />, label: 'Model Trained',  pts: '+100', color: 'text-emerald-400' },
            { icon: <Flame className="w-4 h-4" />,     label: 'Daily Streak',   pts: '×1.5', color: 'text-amber-400'  },
          ].map((item, i) => (
            <div key={i} className="cyber-card rounded-xl p-4 text-center border border-sky-400/10">
              <div className={`flex justify-center mb-2 ${item.color}`}>{item.icon}</div>
              <div className={`text-lg font-black terminal-text mb-1 ${item.color}`}>{item.pts}</div>
              <div className="text-xs text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ── Time tab filter ── */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'gradient-primary text-white glow'
                  : 'glass text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Podium ── */}
        <div className="grid grid-cols-3 gap-3 mb-8 items-end">
          {[top3[1], top3[0], top3[2]].map((u, i) => (
            <PodiumCard key={u.rank} user={u} highlight={i === 1} />
          ))}
        </div>

        {/* ── Rest of the table ── */}
        <div className="cyber-card rounded-xl overflow-hidden border border-sky-400/10">
          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-sky-400/8 text-xs terminal-text text-slate-600">
            <div className="col-span-1">RANK</div>
            <div className="col-span-4">PLAYER</div>
            <div className="col-span-2 text-right">SCORE</div>
            <div className="col-span-2 text-right">SESSIONS</div>
            <div className="col-span-2 text-right">ACCURACY</div>
            <div className="col-span-1 text-right">STREAK</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-sky-400/5">
            {rest.map((u) => (
              <div
                key={u.rank}
                className={`grid grid-cols-12 items-center px-6 py-3.5 transition-colors ${
                  u.isMe
                    ? 'bg-sky-400/5 border-l-2 border-l-sky-400'
                    : 'hover:bg-white/2'
                }`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <RankBadge rank={u.rank} badge={u.badge} />
                </div>

                {/* Player */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                    u.isMe
                      ? 'bg-sky-400/20 border-sky-400/40 text-sky-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {u.name[0]}
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${u.isMe ? 'text-sky-400' : 'text-slate-200'}`}>
                      {u.name}
                    </span>
                    {u.isMe && (
                      <span className="ml-2 text-xs terminal-text text-sky-400/60">YOU</span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 text-right">
                  <span className="font-bold terminal-text text-yellow-400">{u.score.toLocaleString()}</span>
                </div>

                {/* Sessions */}
                <div className="col-span-2 text-right">
                  <span className="text-sm terminal-text text-slate-500">{u.sessions}</span>
                </div>

                {/* Accuracy */}
                <div className="col-span-2 text-right">
                  <span className={`text-sm terminal-text ${u.accuracy >= 90 ? 'text-emerald-400' : u.accuracy >= 80 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {u.accuracy}%
                  </span>
                </div>

                {/* Streak */}
                <div className="col-span-1 text-right">
                  {u.streak > 0
                    ? <span className="text-xs terminal-text text-amber-400 flex items-center justify-end gap-0.5"><Flame className="w-3 h-3" />{u.streak}</span>
                    : <span className="text-xs terminal-text text-slate-700">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-sm mb-4 terminal-text">Start your first session to appear on the leaderboard</p>
          <Link href="/lab">
            <button className="px-8 py-3 gradient-primary text-white rounded-lg font-bold glow hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
              <Star className="w-4 h-4" />
              Start Earning Points
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
