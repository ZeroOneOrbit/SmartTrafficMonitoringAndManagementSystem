import drivers from "../models/drivers.js"

const createDriver = async (req, res)=> {
    try{
        const {
            firebaseUId, licenseNumber, vehicleNumber
        } = req.body;
        const existingDriver = await drivers.findOne(
            { firebaseUId: firebaseUId }
        )
        if (existingDriver){
            return res.status(400).json({
                message: "Driver already exists"
            })

        }
        const licensePoint= 100
        const newDriver = new drivers({
            firebaseUId, licenseNumber, vehicleNumber, licensePoint
        })
        await newDriver.save();
        return res.status(201).json({
            message: "Driver created successfully",
            driver: newDriver
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        })
    }
}


const updateDriver = async (req, res)=>{
    try{
        const {licenseNumber, vehicleNumber} = req.body;
        const updatedDriver = await drivers.findOneAndUpdate(
            {firebaseUId: req.headers.fid},
            {
                licenseNumber, vehicleNumber
            },
            {new: true}
            
        )
        if(!updatedDriver){
            
            return res.status(404).json(
                {
                    message: "Driver Not Found "
                    
                }
            )
        }


        return res.status(200).json(
            {
                message: "Driver Data Updated",
                data: updatedDriver
            }
        )
    
    }
    catch(err){
        console.error(err)
        return res.status(500).json(
            {
                message:"Server Error"

            }
        )

    }

    
}

const updateDriverPoint= async (req, res) => {
    try{
        const {value}= req.body
        const {vehicleNumber}= req.params
        const updatePoint = await drivers.findOneAndUpdate(
            {vehicleNumber},
            {
                $inc: { licensePoint:value }
            },
            {
                new:true
            }
        )

        if(!updatePoint){
            console.log(updatePoint)
            return res.status(404).json({
                message:"point not found "

            })
        }
        return res.status(200).json(
            {
                message: "point updated",
                data: updatePoint
            }
        )
    }
    catch(err){
        console.error(err)
        return res.status(500).json(
            {message: "server Error"}
        )
    }
}

const getDriverSelf=async (req, res)=>{
    try{
        const driver = await drivers.findOne(
            {firebaseUId: req.headers.fid}

        )
        if (!driver){
            return res.status(404).json({
                message: "driver not found"

            })
        }
        return res.status(200).json({
            message:"user status found ",
            data: driver

        })
    }
    catch(err){
        console.error(err)
        return res.status(500).json(
            { message: "server error"}

        )
    }
}



export {createDriver, updateDriver , updateDriverPoint, getDriverSelf}