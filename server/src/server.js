
import connectDB from "./config/db.js";
import app from "./app.js";
import "dotenv/config";
import { WebSocketServer } from "ws";
import rLDAta from "./models/realtimedata.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

let lastDataHash = "";

wss.on("connection", async (ws) => {
    console.log("WebSocket client connected");

    // Immediately send the current state
    try {
        const camData = await rLDAta.find().sort({ _id: -1 }).lean();
        ws.send(JSON.stringify({ type: "realtime_data", data: camData }));
    } catch (err) {
        console.error("Error fetching initial realtime data for WS:", err);
    }

    ws.on("close", () => {
        console.log("WebSocket client disconnected");
    });
});

setInterval(async () => {
    if (wss.clients.size === 0) return;

    try {
        const camData = await rLDAta.find().sort({ _id: -1 }).lean();
        const dataString = JSON.stringify(camData);
        
        if (dataString !== lastDataHash) {
            lastDataHash = dataString;
            const message = JSON.stringify({ type: "realtime_data", data: camData });
            for (const client of wss.clients) {
                if (client.readyState === 1) { // OPEN
                    client.send(message);
                }
            }
        }
    } catch (err) {
        console.error("Error in WS broadcast loop:", err);
    }
}, 1000);





