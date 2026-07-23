import rLDAta from "../models/realtimedata.js";
import Camera from "../models/camera.js";



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
        const thanaId = String(req.query.thanaId || "").trim();
        let query = {};

        // Realtime records store only cam_id. Resolve the cameras registered
        // to this thana first, then return live data for those camera IDs.
        if (thanaId && thanaId.toLowerCase() !== "admin") {
            const cameras = await Camera.find(
                { thanaId },
                { camid: 1, _id: 0 }
            ).lean();

            query = {
                cam_id: {
                    $in: cameras.map((camera) => camera.camid)
                }
            };
        }

        const camData = await rLDAta.find(query).sort({ _id: -1 });
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
