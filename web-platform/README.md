# Global Robotics Learning Platform

A complete Next.js platform for remote robotics learning - book sessions, write code, and execute on real robots from anywhere in the world.

##🌟 Features

### User Features
- ✅ **Authentication** - Sign up/login with email or OAuth (Google, GitHub)
- ✅ **Lab Booking** - Interactive calendar to book robot lab sessions
- ✅ **Live Code Editor** - Monaco Editor with Python syntax highlighting
- ✅ **Real-time Robot Control** - Control robots via WebSocket connection
- ✅ **Live Video Streams** - Watch robot execution with multiple camera feeds
- ✅ **Execution Logs** - Real-time logs with download capability
- ✅ **Joint Visualization** - See robot joint positions in real-time

### Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript, TailwindCSS 4
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Backend API**: FastAPI (existing Python backend)
- **Real-time**: WebSocket for robot data, WebRTC for video (placeholder)
- **Code Editor**: Monaco Editor
- **Styling**: Custom glassmorphism theme with animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Supabase account
- FastAPI backend running (see main leLab project)

### 1. Install Dependencies

```bash
cd web-platform
npm install
```

### 2. Configure Supabase

1. Go to your Supabase project: https://gtbbxrfezoolnwefxhys.supabase.co
2. Get your API keys from: Project Settings → API
3. Run the database schema:
   - Go to SQL Editor in Supabase
   - Copy contents of `supabase-schema.sql`
   - Execute the SQL to create tables

### 3. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your Supabase keys:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gtbbxrfezoolnwefxhys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase

# FastAPI Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Start the Robot Backend

In a separate terminal, start the FastAPI backend:

```bash
cd ..  # Go to main leLab directory
lelab  # or lelab-fullstack
```

## 📁 Project Structure

```
web-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── lab/               # Lab dashboard
│   │   ├── auth/              # Authentication pages
│   │   └── booking/           # Booking system
│   ├── components/            # React components
│   │   └── lab/              # Lab-specific components
│   │       ├── CodeEditor.tsx
│   │       ├── RobotControls.tsx
│   │       ├── LogsPanel.tsx
│   │       └── VideoStream.tsx
│   ├── lib/                   # Utilities and configs
│   │   ├── supabase.ts       # Supabase client & auth
│   │   ├── websocket.ts      # WebSocket manager
│   │   └── api/              # API clients
│   │       └── robot.ts      # FastAPI client
│   └── hooks/                 # Custom React hooks
│       └── useRobotData.ts   # Robot data hook
├── supabase-schema.sql       # Database schema
└── tailwind.config.ts        # Theme configuration
```

## 🎨 Key Pages

### Landing Page (`/`)
Premium marketing page with features showcase and call-to-action

### Authentication (`/auth/login`, `/auth/signup`)
Supabase-powered authentication with email and OAuth

### Booking (`/booking`)
Interactive calendar for scheduling lab sessions

### Lab Dashboard (`/lab`)
Main interface with:
- **Left**: Live video streams (2 cameras)
- **Center**: Monaco code editor
- **Right**: Robot controls + execution logs

## 🔧 Configuration

### Supabase Database Schema

The platform uses 4 main tables:
- **users** - User profiles and stats
- **bookings** - Lab session bookings
- **sessions** - Code execution sessions
- **code_repository** - Saved code snippets

All tables have Row Level Security (RLS) enabled.

### FastAPI Integration

The platform connects to your existing FastAPI backend at `localhost:8000`:
- REST API for robot control (teleoperation, recording, training, replay)
- WebSocket at `/ws/joint-data` for real-time robot data

## 🛠️ Development

### Running in Development

```bash
npm run dev
```

### Running FastAPI Backend

```bash
lelab-fullstack  # Starts both backend and original frontend
# OR
lelab  # Just the backend
```

### Building for Production

```bash
npm run build
npm start
```

Note: There's currently a Turbopack build issue. Use dev mode for development.

## 📝 Next Steps

### To Complete Setup:
1. Get your Supabase anon key and update `.env.local`
2. Run the `supabase-schema.sql` in Supabase SQL Editor
3. Enable Google/GitHub OAuth in Supabase Auth Settings
4. Test authentication flow
5. Configure WebRTC signaling server for live video (currently placeholder)

### Feature Roadmap:
- [ ] Implement WebRTC for actual live video streaming
- [ ] Add code execution history
- [ ] Implement user profile management
- [ ] Add session recording/playback
- [ ] Create admin dashboard
- [ ] Add collaborative coding features
- [ ] Implement payment/subscription system

## 🎯 Team 3 Responsibilities (Completed)

✅ Lab P2P and dash computing interface  
✅ Instructional videos integration points  
✅ Live stream and instruction  
✅ Use the slider labels for robot controls  
✅ Give task planner detailed steps on how to use robots  
✅ Real-time logs and feedback display  

## 📧 Support

For issues or questions:
- Email: andao@mydaust.org
- Organization: Daust Lab

---

**Built with ❤️ for robotics learners worldwide**
