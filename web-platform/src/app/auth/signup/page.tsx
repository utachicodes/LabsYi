'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUp, signInWithGoogle, signInWithGithub } from '@/lib/supabase';
import { Bot, UserPlus, Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';

function SignupForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const next         = searchParams.get('next') ?? '/booking';
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.name,
      );

      if (signUpError) {
        setError(typeof signUpError === 'object' && 'message' in signUpError ? String((signUpError as { message: string }).message) : 'Sign-up failed.');
        return;
      }

      if (data?.user) {
        // Supabase may require email confirmation — check
        const u = data.user as { id: string; confirmed_at?: string; email_confirmed_at?: string };
        const needsConfirm = !u.confirmed_at && !u.email_confirmed_at;
        if (needsConfirm && u.id !== 'demo') {
          setSuccess('Account created! Check your email to confirm before signing in.');
        } else {
          router.push(next);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-cyber flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-40 pointer-events-none" />
      <div className="fixed top-0 right-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Back */}
        <Link href="/" className="flex items-center gap-1 mb-6 text-xs terminal-text text-slate-600 hover:text-slate-400 transition-colors">
          <ChevronLeft className="w-3 h-3" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">Labs</span><span className="text-sky-400">Yi</span>
          </span>
        </div>

        {/* Card */}
        <div className="cyber-card rounded-2xl p-8 neon-border">
          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-500 text-sm mb-6">Start your robotics learning journey</p>

          {/* Error / success banners */}
          {error && (
            <div className="mb-5 px-3 py-2.5 rounded-lg bg-red-400/10 border border-red-400/25 text-sm text-red-400 terminal-text">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-3 py-2.5 rounded-lg bg-emerald-400/10 border border-emerald-400/25 text-sm text-emerald-400 terminal-text">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 terminal-text">FULL NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={set('name')}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-sky-400/15 hover:border-sky-400/30 focus:border-sky-400/50 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition-colors"
                placeholder="Alex Johnson"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 terminal-text">EMAIL</label>
              <input
                type="email"
                value={formData.email}
                onChange={set('email')}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-sky-400/15 hover:border-sky-400/30 focus:border-sky-400/50 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 terminal-text">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={formData.password}
                  onChange={set('password')}
                  className="w-full px-4 py-2.5 pr-10 bg-slate-900/60 border border-sky-400/15 hover:border-sky-400/30 focus:border-sky-400/50 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition-colors"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 terminal-text">CONFIRM PASSWORD</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={formData.confirm}
                onChange={set('confirm')}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-sky-400/15 hover:border-sky-400/30 focus:border-sky-400/50 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-sky-400" />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-sky-400 hover:text-sky-300">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-sky-400 hover:text-sky-300">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full py-2.5 rounded-lg font-bold text-sm text-white disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #a855f7)', boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</>
                : <><UserPlus className="w-4 h-4" />Create Account</>}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-sky-400/10" />
            <span className="text-xs text-slate-600 terminal-text">or sign up with</span>
            <div className="flex-1 h-px bg-sky-400/10" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => signInWithGoogle()}
              className="py-2.5 glass hover:bg-white/10 border border-white/8 hover:border-sky-400/25 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all"
            >
              Google
            </button>
            <button
              onClick={() => signInWithGithub()}
              className="py-2.5 glass hover:bg-white/10 border border-white/8 hover:border-sky-400/25 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all"
            >
              GitHub
            </button>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Already have an account?{' '}
            <Link
              href={`/auth/login${next !== '/booking' ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-cyber flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
