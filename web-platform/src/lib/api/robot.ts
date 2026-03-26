// API client for the FastAPI robot backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TeleoperateRequest {
    leader_config: string;
    follower_config: string;
    leader_port?: string;
    follower_port?: string;
}

export interface RecordingRequest {
    leader_config: string;
    follower_config: string;
    dataset_name: string;
    num_episodes: number;
    leader_port?: string;
    follower_port?: string;
}

export interface TrainingRequest {
    dataset_repo_id: string;
    policy_name: string;
    output_dir?: string;
}

export interface ReplayRequest {
    robot_config: string;
    policy_path: string;
    robot_port?: string;
}

class RobotAPI {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Health check
    async healthCheck() {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.json();
    }

    // Teleoperation endpoints
    async startTeleoperation(data: TeleoperateRequest) {
        const response = await fetch(`${this.baseUrl}/move-arm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async stopTeleoperation() {
        const response = await fetch(`${this.baseUrl}/stop-teleoperation`, {
            method: 'POST',
        });
        return response.json();
    }

    async getTeleoperationStatus() {
        const response = await fetch(`${this.baseUrl}/teleoperation-status`);
        return response.json();
    }

    async getJointPositions() {
        const response = await fetch(`${this.baseUrl}/joint-positions`);
        return response.json();
    }

    // Recording endpoints
    async startRecording(data: RecordingRequest) {
        const response = await fetch(`${this.baseUrl}/start-recording`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async stopRecording() {
        const response = await fetch(`${this.baseUrl}/stop-recording`, {
            method: 'POST',
        });
        return response.json();
    }

    async getRecordingStatus() {
        const response = await fetch(`${this.baseUrl}/recording-status`);
        return response.json();
    }

    async exitEarly() {
        const response = await fetch(`${this.baseUrl}/recording-exit-early`, {
            method: 'POST',
        });
        return response.json();
    }

    async rerecordEpisode() {
        const response = await fetch(`${this.baseUrl}/recording-rerecord-episode`, {
            method: 'POST',
        });
        return response.json();
    }

    // Training endpoints
    async startTraining(data: TrainingRequest) {
        const response = await fetch(`${this.baseUrl}/start-training`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async stopTraining() {
        const response = await fetch(`${this.baseUrl}/stop-training`, {
            method: 'POST',
        });
        return response.json();
    }

    async getTrainingStatus() {
        const response = await fetch(`${this.baseUrl}/training-status`);
        return response.json();
    }

    async getTrainingLogs() {
        const response = await fetch(`${this.baseUrl}/training-logs`);
        return response.json();
    }

    // Replay endpoints
    async startReplay(data: ReplayRequest) {
        const response = await fetch(`${this.baseUrl}/start-replay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async stopReplay() {
        const response = await fetch(`${this.baseUrl}/stop-replay`, {
            method: 'POST',
        });
        return response.json();
    }

    async getReplayStatus() {
        const response = await fetch(`${this.baseUrl}/replay-status`);
        return response.json();
    }

    async getReplayLogs() {
        const response = await fetch(`${this.baseUrl}/replay-logs`);
        return response.json();
    }

    // Configuration endpoints
    async getConfigs() {
        const response = await fetch(`${this.baseUrl}/get-configs`);
        return response.json();
    }

    async getAvailablePorts() {
        const response = await fetch(`${this.baseUrl}/available-ports`);
        return response.json();
    }

    async getAvailableCameras() {
        const response = await fetch(`${this.baseUrl}/available-cameras`);
        return response.json();
    }

    // Calibration endpoints
    async startCalibration(data: { device_type: string; config_name: string }) {
        const response = await fetch(`${this.baseUrl}/start-calibration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async stopCalibration() {
        const response = await fetch(`${this.baseUrl}/stop-calibration`, {
            method: 'POST',
        });
        return response.json();
    }

    async getCalibrationStatus() {
        const response = await fetch(`${this.baseUrl}/calibration-status`);
        return response.json();
    }
}

export const robotAPI = new RobotAPI();
