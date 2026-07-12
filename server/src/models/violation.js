import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    time: {
      type: Date,
      required: true,
    },

    car_type: {
      type: String,
      required: true,
    },

    vehicle_number: {
      type: String,
      default: "N/A",
    },

    violation_type: {
      type: String,
      required: true,
    },

    evidence: {
      driveurl: {
        type: String,
        required: true,
      },
    },

    location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },

    trackid: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "violations", // Replace with your actual MongoDB collection name if different
  }
);


export default mongoose.model("violations", violationSchema);