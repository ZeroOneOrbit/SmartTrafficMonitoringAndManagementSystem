import Camera from "../models/camera.js";

const getCamera = async (req, res) => {
  try {
    const data = await Camera.find();

    if (data.length === 0) {
      return res.status(404).json({
        message: "No cameras found",
      });
    }

    return res.status(200).json({
      message: "Cameras connected successfully",
      data: data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAreacamera = async (req , res)=>{
  try{
        

    const thanaid = req.headers.area
    console.log("thana",thanaid)
    const data = await Camera.find({
      thanaId:thanaid
    })
     if (data.length === 0) {
      console.log(data)
      return res.status(404).json({
        message: "No cameras found",
      });
    }

    return res.status(200).json({
      message: "Cameras connected successfully",
      data: data,
    })
  }
  catch(err){
    console.log(err)
    return res.status(500).json({
      message: "server Error"
    })
  }
}

export { getCamera, getAreacamera };