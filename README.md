# LabsYi - Remote Robotics Learning Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Code Style](https://img.shields.io/badge/code%20style-black-000000.svg)

A comprehensive web-based platform for remote robotics training and control, built on top of LeRobot. LabsYi enables students and researchers to interact with robotic systems remotely through an intuitive interface.

## About

LabsYi provides a modern, accessible web interface for controlling and programming robots remotely. The platform is designed to facilitate robotics education and research by removing physical hardware barriers and enabling collaborative learning experiences.

### Key Features

**Robot Control**
- Real-time robot control through an intuitive web interface
- Support for multiple robot configurations
- Live telemetry and sensor feedback
- Emergency stop and safety controls

**Data Recording**
- Record and save robot trajectories
- Automated dataset management
- Support for various data formats
- Episode tagging and organization

**Model Training**
- Train imitation learning models directly from the web interface
- Real-time training progress monitoring
- Hyperparameter configuration
- Model versioning and management

**Live Video Streaming**
- Multiple camera views
- Low-latency video streaming
- Adjustable quality settings
- Recording and playback capabilities

**User Management**
- Secure authentication and authorization
- Role-based access control
- Session management
- Multi-user support

## Technology Stack

- **Frontend**: Next.js 16.1.6 with React
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Backend**: Python FastAPI
- **Robotics**: LeRobot framework
- **WebSockets**: Real-time bidirectional communication

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 18.17 or higher
- NPM or Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/daust-lab/LabsYi.git
cd LabsYi
```

2. Install frontend dependencies:
```bash
cd web-platform
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python main.py
```

2. Start the frontend development server:
```bash
cd web-platform
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
LabsYi/
├── web-platform/          # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API clients
│   │   └── styles/       # Global styles
│   └── public/           # Static assets
│
├── backend/              # Python FastAPI backend
│   ├── api/             # API endpoints
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
│
└── docs/                # Documentation
```

## Features in Development

**Advanced Training**
- Reinforcement learning integration
- Curriculum learning support
- Multi-task learning capabilities

**Enhanced Visualization**
- 3D robot visualization
- Trajectory planning tools
- Performance analytics dashboard

**Collaboration Tools**
- Shared robot access scheduling
- Real-time collaboration features
- Code sharing and versioning

**Extended Hardware Support**
- Support for additional robot platforms
- Custom sensor integration
- Peripheral device management

## Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built on top of the LeRobot framework
- Inspired by the need for accessible robotics education
- Thanks to all contributors and the open-source community

## Support

For questions, issues, or feature requests, please open an issue on GitHub or contact our support team.

## Roadmap

**Q1 2024**
- Multi-robot orchestration
- Advanced data visualization

**Q2 2024**
- Mobile app development
- Cloud deployment options

**Q3 2024**
- AI-assisted robot programming
- Extended simulation capabilities

---

Made with passion for robotics education and research.

A modern web-based interface for controlling and monitoring robots using the [LeRobot](https://github.com/huggingface/lerobot) framework. This application provides an intuitive dashboard for robot teleoperation, data recording, and calibration management.

## 🤖 About

LeLab bridges the gap between LeRobot's powerful robotics capabilities and user-friendly web interfaces. It offers:

- **Real-time robot control** through an intuitive web dashboard
- **Dataset recording** for training machine learning models
- **Live teleoperation** with WebSocket-based real-time feedback
- **Configuration management** for leader/follower robot setups
- **Joint position monitoring** and visualization

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI        │    │   LeRobot       │
│   (React/TS)    │◄──►│   Backend        │◄──►│   Framework     │
│                 │    │                  │    │                 │
│   • Dashboard   │    │   • REST APIs    │    │   • Robot       │
│   • Controls    │    │   • WebSockets   │    │     Control     │
│   • Monitoring  │    │   • Recording    │    │   • Sensors     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## ✨ Features

### 🎮 Robot Control

- **Teleoperation**: Direct robot arm control through web interface
- **Joint monitoring**: Real-time joint position feedback via WebSocket
- **Safety controls**: Start/stop teleoperation with status monitoring

### 📹 Data Recording

- **Dataset creation**: Record episodes for training ML models
- **Session management**: Start, stop, and manage recording sessions
- **Episode controls**: Skip to next episode or re-record current one
- **Real-time status**: Monitor recording progress and status

### ⚙️ Configuration

- **Config management**: Handle leader and follower robot configurations
- **Calibration support**: Load and manage calibration settings
- **Health monitoring**: System health checks and diagnostics

### 🌐 Web Interface

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Real-time updates**: WebSocket integration for live data
- **Responsive design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+ (for frontend development)
- LeRobot framework installed and configured
- Compatible robot hardware

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd leLab
   ```

2. **Install the Python backend**

   ```bash
   # If installing in virtual environment
   python -m venv .venv
   source .venv/bin/activate
   # If installing globally
   # Note: Git-LFS required: brew install git-lfs
   pip install -e .
   ```

### Running the Application

After installation, you can use the `lelab` command-line tools:

```bash
# Start only the backend server (default)
lelab

# Start both backend and frontend servers
lelab-fullstack

# Start only the frontend development server
lelab-frontend
```

**Command Options:**

- `lelab` - Starts only the FastAPI backend server on `http://localhost:8000`
- `lelab-fullstack` - Starts both FastAPI backend (port 8000) and Vite frontend (port 8080) with auto-browser opening
- `lelab-frontend` - Starts only the frontend development server with auto-browser opening

**Frontend Repository:**

The frontend is automatically cloned from [leLab-space](https://github.com/jurmy24/leLab-space.git) when you run `lelab-frontend` or `lelab-fullstack`. The system will:

1. Check if the frontend already exists in the parent directory
2. Clone the repository if it doesn't exist
3. Install dependencies with `npm install`
4. Start the development server and auto-open your browser

### Key Endpoints

- `POST /move-arm` - Start robot teleoperation
- `POST /stop-teleoperation` - Stop current teleoperation
- `GET /joint-positions` - Get current joint positions
- `POST /start-recording` - Begin dataset recording
- `POST /stop-recording` - End recording session
- `GET /get-configs` - Retrieve available configurations
- `WS /ws/joint-data` - WebSocket for real-time joint data

## 🏗️ Project Structure

```
leLab/
├── app/                      # FastAPI backend
│   ├── main.py              # Main FastAPI application
│   ├── recording.py         # Dataset recording logic
│   ├── teleoperating.py     # Robot teleoperation logic
│   ├── calibrating.py       # Robot calibration logic
│   ├── training.py          # ML training logic
│   ├── config.py            # Configuration management
│   ├── scripts/             # Command-line scripts
│   │   ├── backend.py       # Backend-only startup
│   │   ├── frontend.py      # Frontend-only startup
│   │   └── fullstack.py     # Full-stack startup
│   └── static/              # Static web files
├── ../leLab-space/   # React frontend (auto-cloned)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── contexts/        # React contexts
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── pyproject.toml           # Python project configuration
└── README.md               # This file
```

## 🔧 Development

### Backend Development

```bash
# Install in editable mode
pip install -e .

# Run backend only with auto-reload
lelab
```

### Frontend Development

```bash
# Automatically clones, installs deps, and starts dev server
lelab-frontend
```

### Full-Stack Development

```bash
# Start both backend and frontend with auto-reload
lelab-fullstack
```

**Development Notes:**

- The frontend repository is automatically managed (cloned/updated)
- Both commands auto-open your browser to the appropriate URL
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:8080` with API proxying

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [LeRobot](https://github.com/huggingface/lerobot) - The underlying robotics framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework for building APIs
- [React](https://reactjs.org/) - Frontend user interface library

---

**Note**: Make sure your LeRobot environment is properly configured and your robot hardware is connected before running the application.
