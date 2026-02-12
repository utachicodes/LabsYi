// Landing Page - Premium Design
'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Rocket, Video, Globe, Calendar, Code, Play, BarChart, GraduationCap, Zap, Clock, Brain, Wifi } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900" />

        <nav className="relative glass-dark border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Bot className="w-8 h-8 text-primary-500" />
                <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                  LabsYi
                </span>
              </div>
              <div className="flex gap-4">
                <Link href="/auth/login">
                  <button className="px-4 py-2 glass hover:bg-white/20 rounded-lg transition-colors font-semibold">
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-6 py-2 gradient-primary text-white rounded-lg font-bold glow transform hover:scale-105 transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            <span className="text-white">
              Learn Robotics from Anywhere
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Remote access to real robots. Record data. Train AI models.
            Build the future of robotics without hardware barriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="px-8 py-4 gradient-primary text-white rounded-lg font-bold text-lg glow transform hover:scale-105 transition-all">
                Start Learning
              </button>
            </Link>
            <Link href="/lab">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold text-lg transition-all">
                Watch Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-dark p-6 rounded-lg text-center border border-white/10 hover:border-primary-500/50 transition-all"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Everything You Need to <span className="gradient-primary bg-clip-text text-transparent">Master Robotics</span>
        </h2>
        <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-20">
          Our platform provides three core capabilities to accelerate your robotics learning journey
        </p>

        {/* Control Pillar */}
        <div className="mb-24">
          <div className="glass-dark rounded-2xl p-12 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-10 h-10 text-primary-500" />
                  <h3 className="text-3xl font-bold">Control Real Robots Remotely</h3>
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Take command of physical robots from anywhere in the world. Our real-time teleoperation
                  interface gives you complete control with zero-lag responsiveness.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-2">
                    <Video className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Live video streaming from multiple camera angles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Wifi className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Emergency stop and comprehensive safety controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Support for various robot platforms and configurations</span>
                  </li>
                </ul>
              </div>
              <div className="glass rounded-xl p-8 text-center">
                <Play className="w-24 h-24 mx-auto text-primary-500 mb-4" />
                <p className="text-gray-400">Real-time Control Interface</p>
              </div>
            </div>
          </div>
        </div>

        {/* Record Pillar */}
        <div className="mb-24">
          <div className="glass-dark rounded-2xl p-12 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 glass rounded-xl p-8 text-center">
                <BarChart className="w-24 h-24 mx-auto text-primary-500 mb-4" />
                <p className="text-gray-400">Data Recording Dashboard</p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-10 h-10 text-primary-500" />
                  <h3 className="text-3xl font-bold">Record High-Quality Training Data</h3>
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Capture comprehensive training datasets with automated episode recording.
                  Multi-modal data from sensors, cameras, and actions in industry-standard formats.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Automated episode recording and dataset management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Multi-modal data capture (video, sensors, actions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Export in standard formats for analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Train Pillar */}
        <div>
          <div className="glass-dark rounded-2xl p-12 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-10 h-10 text-primary-500" />
                  <h3 className="text-3xl font-bold">Train AI Models in Your Browser</h3>
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Build and train imitation learning models directly in your browser.
                  Monitor training progress in real-time and deploy models instantly to robots.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Imitation learning from human demonstrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Real-time training progress monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Rocket className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span>Instant deployment to physical robots</span>
                  </li>
                </ul>
              </div>
              <div className="glass rounded-xl p-8 text-center">
                <GraduationCap className="w-24 h-24 mx-auto text-primary-500 mb-4" />
                <p className="text-gray-400">AI Training Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-gray-900/50 to-transparent rounded-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          How It <span className="gradient-primary bg-clip-text text-transparent">Works</span>
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16">Get started in four simple steps</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 glass-dark rounded-full flex items-center justify-center text-2xl font-bold gradient-primary bg-clip-text text-transparent border-2 border-primary-500/30">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-dark rounded-2xl p-12 md:p-16 text-center glow border border-white/10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Building with <span className="gradient-primary bg-clip-text text-transparent">LabsYi</span>
          </h2>
          <p className="text-gray-300 mb-10 text-xl max-w-2xl mx-auto">
            Join students and researchers learning robotics remotely. No hardware required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="px-10 py-4 gradient-primary text-white rounded-lg font-bold text-lg glow transform hover:scale-105 transition-all">
                Create Free Account
              </button>
            </Link>
            <Link href="/lab">
              <button className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold text-lg transition-all">
                View Documentation
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-dark border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2026 LabsYi. Built for robotics learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const stats = [
  {
    icon: <Wifi className="w-10 h-10 text-primary-500" />,
    value: '100%',
    label: 'Remote Access',
  },
  {
    icon: <Zap className="w-10 h-10 text-primary-500" />,
    value: 'Real-time',
    label: 'Control',
  },
  {
    icon: <Brain className="w-10 h-10 text-primary-500" />,
    value: 'AI Training',
    label: 'In Browser',
  },
  {
    icon: <Clock className="w-10 h-10 text-primary-500" />,
    value: '24/7',
    label: 'Available',
  },
];

const steps = [
  {
    title: 'Create Account',
    description: 'Sign up in seconds with email or Google',
  },
  {
    title: 'Book Session',
    description: 'Choose your time slot from the calendar',
  },
  {
    title: 'Write Code',
    description: 'Use our powerful editor to write robot code',
  },
  {
    title: 'Watch Live',
    description: 'See your code execute on real robots',
  },
];
