const officerCreator = (req, res, next)=>{
    const role = req.headers.role;
    const permitedRoles = ["admin", "superadmin", "officerInCharge"];
    if (!permitedRoles.includes(role)) {
        return res.status(403).json({
            message: "You do not have permission to create an officer"

        })
    }
    next();
}

export default officerCreator;
