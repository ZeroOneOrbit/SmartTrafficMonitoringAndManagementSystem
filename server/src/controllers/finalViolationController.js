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
            officerRef,
            caseStatus,

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
            caseStatus
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


const getVFinal = async (req, res)=>{
    try{
            
        const data = await vFinal.find()
        if (!data){
            console.log(data);
                return res.status(404).json({
                    message: "Undefiend Data",
                });

            }
            return res.status(200).json({
                message: "login successful",
                vFData: data,
            });
        }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }

    

}


export {createVFinal , getVFinal}