import rLDAta from "../models/realtimedata.js"

const getData = async (req , res) =>{
    try{
        const date= req.query.date
        console.log("date",date)
        const live_data = await rLDAta.findOne(
            {
                date
            }
        )
        
        if (!live_data){
            return res.status(404).json(
                {
                    message: "No Data found "

                }
            )

        }
        console.log(live_data)
        return res.status(200).json({
            message: "Data fetched ",
            data:  live_data 
        })
    }
    catch(err){
        return res.status(500).json(
            {
                message: "server error"
            }
        )
    }
}


export {getData}