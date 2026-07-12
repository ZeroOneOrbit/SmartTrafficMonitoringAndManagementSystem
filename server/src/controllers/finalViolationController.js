import vFinal from "../models/finalviolation.js"
const createVFinal = async (req , res )=>{
    try{
        const {
            time, 
            carType,
            violationType,
            evedience,
            fine,
            location,
            vehicleNumber,
            licenseNumber,
            officerRef

        } = req.body

        const newCase= new vFinal({
            time, 
            carType,
            violationType,
            evedience,
            fine,
            location,
            vehicleNumber,
            licenseNumber,
            officerRef,
            caseStatus: "Filled"
        })
        await newCase.save()
        
        return res.status(201).json(
            {
                message: "New Case Submitted",
                data: newCase

            }
        )
        
    }
    catch(err){
        return res.status(500).json({
            message: "server Error"
        })
    }
}

export {createVFinal}