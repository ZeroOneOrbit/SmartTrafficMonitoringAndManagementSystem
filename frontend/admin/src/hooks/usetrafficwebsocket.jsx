import { useEffect } from "react";

const useTrafficWebSocket = (onDataReceived) => {

    useEffect(() => {

        const websocketUrl =
            import.meta.env.VITE_WEBSOCKET_URL ||
            import.meta.env.VITE_SERVER_URL ||
            "ws://localhost:5000";

        console.log("Connecting to WebSocket URL:", websocketUrl);

        const ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
            console.log(
                "Connected to Realtime Traffic WebSocket Server",
                websocketUrl
            );
        };

        ws.onmessage = (event) => {

            const response =
                JSON.parse(event.data);

            if (
                response.type ===
                "realtime_data"
            ) {

                const realtimeData =
                    response.data;

                console.log(
                    "Received realtime camera data:",
                    realtimeData
                );

                if (Array.isArray(realtimeData)) {
                    realtimeData.forEach((camera) => {
                        if (camera && camera.cam_id) {
                            onDataReceived(camera);
                        }
                    });
                } else if (realtimeData && realtimeData.cam_id) {
                    onDataReceived(realtimeData);
                } else {
                    console.warn(
                        "Unexpected realtime_data payload:",
                        realtimeData
                    );
                }
            }
        };

        ws.onerror = (error) => {

            console.error(
                "WebSocket Error:",
                error
            );
        };

        ws.onclose = () => {

            console.log(
                "Disconnected from WebSocket Server"
            );
        };

        return () => {

            ws.close();
        };

    }, [onDataReceived]);
};

export default useTrafficWebSocket;