import mongoose from "mongoose";

const rLData = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        cam_id: {
            type: String,
            required: true,
            index: true
        },

        emergency_mode: {
            type: Boolean,
            default: false
        },

        last_updated: {
            type: Date,
            required: true
        },

        light_status: {
            type: String,
            enum: ["red", "green"],
            required: true
        },

        live_count: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },

        stream_url: {
            type: String,
            default: ""
        },

        total: {
            type: Number,
            required: true,
            min: 0
        }
    }
);

export default mongoose.model(
    "RealtimeData",
    rLData,
    "realtime_data"
);