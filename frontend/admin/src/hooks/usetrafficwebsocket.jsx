import { useEffect } from "react";

const useTrafficWebSocket = (onDataReceived) => {

    useEffect(() => {

        const ws = new WebSocket(
            `${import.meta.env.VITE_SERVER_URL}`
        );

        ws.onopen = () => {
            console.log(
                "Connected to Realtime Traffic WebSocket Server"
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

                onDataReceived(
                    realtimeData
                );
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