import mongoose from "mongoose";


const vFinal = new mongoose.Schema(
    {
        time:{
            type: String,
            require: true
        },
        carType: {
            type: String,
            require: true
        },
        violationType: {
            type: String,
            require: true
        },
        evedience: {
            driveURI:{
                type: String,
                require: true
            }
        },
        fine: {
            status:{
                type: String,
            }, 
            fee: {
                type: String,
            }

        },
        location: {
            type: String,
            require: true
        },
        vehicleNumber: {
            type: String, 
            require: true
        },
        licenseNumber: {
            type: String,
            require: true
        },
        officerRef: {
            name: {
                type: String,
                require: true
            },
            rank: {
                type: String,
                require: true
            },
            area: {
                type: String,
                require: true
            }

        },
        caseStatus: {
            type:String,
            require: true
        }



    }
)

export default mongoose.model("Cases", vFinal)