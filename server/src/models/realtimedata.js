import mongoose from "mongoose";

const rLData = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true

        },
        last_updated: {
            type: String,
            required: true
        },
        live_count: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true 
        },
        location: {
            type: String,
            required: true
        },
        light_status: {
            type: String,
            enum: ["red", "green"],
            required: true
        }
    }
)


export default mongoose.model("RealtimeData", rLData, "realtime_data");
