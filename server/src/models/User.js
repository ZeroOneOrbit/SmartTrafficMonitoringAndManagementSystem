import mongoose from "mongoose";

const userData = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            required: true,

        }, 
        phone: {
            type: String,
            required: true
        },
        firebaseUid: {
            type: String,
            required: true,
            unique: true
        }
    }
);

export default mongoose.model("user", userData);