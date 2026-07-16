import rLDAta from "../models/realtimedata.js";



const getCamera = async (req, res) => {
    try {

        const camId = req.params.camId;

        console.log("camId:", camId);

        const cameraData = await rLDAta.findOne({
            cam_id: camId
        }).sort({ _id: -1});

        if (!cameraData) {
            return res.status(404).json({
                message: "Camera data not found"
            });
        }

        return res.status(200).json({
            message: "Camera data fetched successfully",
            data: cameraData
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllCam= async (req, res) =>{
    try{
        const camData= await rLDAta.find().sort({ _id: -1 });
        return res.status(200).json({
            message: "Camera data fetched successfully",
            data: camData
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        })
    }

}


export {

    getCamera,
    getAllCam
};