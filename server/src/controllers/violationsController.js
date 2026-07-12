import violations from "../models/violation.js"

const getviolations = async (req , res )=>{
    try{
        const vData = await violations.find()
        if(!vData){
            return res.status(404).json(
                {
                    message: "No Traffic violations"
                }

            )
        }

        return res.status(200).json({
            message: "traffic violations found",
            data: vData

        })
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}


const deleteViolations = async (req, res)=>{
    try{
        const vDeleted= await violations.findOneAndDelete({
            id: req.headers.id
        })

        if(!vDeleted){
            return res.status(404).json({
                message: "Data not found "

            })

        }
        
        return res.status(200).json({
            message: "data deleted ",
            data: vDeleted

        })
    }
    catch(err){

        console.errror(err)
        return res.status(500).json({
            message: "server Error"
        
        })
    }
}

export {getviolations, deleteViolations}