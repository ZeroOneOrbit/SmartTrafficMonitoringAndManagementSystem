import {auth} from "../config/firebase-admin.js";


const loginAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    }catch (err){
        return res.status(401).json({ message: "Invalid token" });
    }

};

export default loginAuth;
