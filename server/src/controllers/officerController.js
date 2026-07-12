import officer from "../models/officers.js";


const createOfficer = async (req, res) => {
    try {
        const {name, email, role, phone, specialId, zone} = req.body;

        const exitingOfficer = await officer.findOne({
            email: email,
        })
        if (exitingOfficer) {
            return res.status(400).json({
                message: "Officer already exists",
            });
        }


        const exitingSpecialId = await officer.findOne({
            specialId: specialId,
        })

        if (exitingSpecialId) {
            return res.status(400).json({
                message: "Special ID already exists",
            });
        }

        

        const newOfficer = new officer({
            name, 
            email,
            role,
            phone,
            specialId,
            zone
        });
        
        await newOfficer.save();
        return res.status(201).json({
            message: "Officer created successfully",
            officer: newOfficer,
        });


    
    }
    catch(err){
        console.error(err);

        return res.status(500).json({
            message: "Server error",
        });
    }
}

const updateOfficer = async (req, res) => {
    try{
        const {name, phone, email} = req.body;
        const updatedOfficer = await officer.findOneAndUpdate(
            {specialId: req.headers.specialid},
            {name, phone, email},
            {new: true}
        );
        if(!updatedOfficer){
            return res.status(404).json({
                message: "Officer not found",
            });
        }
        return res.status(200).json({
            message: "Officer updated successfully",
            officer: updatedOfficer,
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

const updateOfficerByAdmin = async (req, res) => {
    try{
        const {role, zone, specialId} = req.body;
        const updatedOfficer = await officer.findOneAndUpdate(
            {email: req.params.id},
            {role, zone, specialId},
            {new: true}
        );
        if(!updatedOfficer){
            return res.status(404).json({
                message: "Officer not found",
            });
        }
        return res.status(200).json({
            message: "Officer updated successfully",
            officer: updatedOfficer,
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

const getOfficerSelf = async (req, res) => {
    try{
        const officerData = await officer.findOne({
            specialId: req.headers.specialid
           
        })
        console.log(officerData);
        if (!officerData){
        console.log(officerData);
            return res.status(404).json({
                message: "Officer not found",
            });

        }
        return res.status(200).json({
            message: "login successful",
            officer: officerData,
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

const getOfficers = async (req, res) => {
    try{
        const officers = await officer.find();
        return res.status(200).json({
            message: "Officers fetched successfully",
            officers: officers,
        });
        if(!officers){
            return res.status(404).json({
                message: "No officers found",
            });
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}


const deleteOfficer = async (req, res) => {
    try{
        const deletedOfficer = await officer.findOneAndDelete({
            email: req.params.id,
        });
        if(!deletedOfficer){
            return res.status(404).json({
                message: "Officer not found",
            });
        }
        return res.status(200).json({
            message: "Officer deleted successfully",
            officer: deletedOfficer,
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}


export {createOfficer, updateOfficer, updateOfficerByAdmin, getOfficerSelf, getOfficers, deleteOfficer};
