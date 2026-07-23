import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
  {
    camid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    areaId: {
      type: String,
      required: true,
      trim: true,
    },

    cameraName: {
      type: String,
      required: true,
      trim: true,
    },

    cameraType: {
      type: String,
      enum: ["fixed", "ptz", "mobile"],
      default: "fixed",
      required: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    streamUrl: {
      type: String,
      required: true,
      trim: true,
    },

    thanaId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Camera = mongoose.model("Camera", cameraSchema, "cameras");

export default Camera;