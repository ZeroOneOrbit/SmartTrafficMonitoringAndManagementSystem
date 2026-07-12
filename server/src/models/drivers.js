import mongoose from "mongoose";

const driverData = new mongoose.Schema(
    {   
        firebaseUId:{
            type: String,
            required: true,
            unique: true
        },
        licenseNumber:{
            type: String,
            required: true,
            unique: true
        },
        vehicleNumber:{
            type: String,
            required: true,
            unique: true
        },
        licensePoint:{
            type: Number,
            required: true
        }

    })

export default mongoose.model("driver", driverData);
       