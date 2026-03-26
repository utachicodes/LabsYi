// React hook for consuming real-time robot data via WebSocket
'use client';

import { useEffect, useState, useCallback } from 'react';
import { wsManager, JointData } from '@/lib/websocket';

export function useRobotData() {
    const [jointData, setJointData] = useState<JointData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to WebSocket
        wsManager.connect();

        // Subscribe to joint data updates
        const unsubscribe = wsManager.subscribe((data: JointData) => {
            setJointData(data);
        });

        // Check connection status
        const checkConnection = setInterval(() => {
            setIsConnected(wsManager.isConnected());
        }, 1000);

        // Cleanup
        return () => {
            unsubscribe();
            clearInterval(checkConnection);
            // Don't disconnect here - allow it to persist across component remounts
        };
    }, []);

    const sendMessage = useCallback((data: Record<string, unknown>) => {
        wsManager.send(data);
    }, []);

    return {
        jointData,
        isConnected,
        sendMessage,
    };
}
