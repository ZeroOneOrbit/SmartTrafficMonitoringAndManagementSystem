import User from "../models/User.js";
import {auth} from "../config/firebase-admin.js";


const createUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  let firebaseUser = null;

  try {
    // Create user in Firebase Authentication
    firebaseUser = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save user profile in MongoDB
    const newUser = await User.create({
      name,
      email,
      role,
      phone,
      firebaseUid: firebaseUser.uid,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: newUser,
    });

  } catch (error) {
    // Roll back Firebase user if MongoDB save fails
    if (firebaseUser) {
      try {
        await auth.deleteUser(firebaseUser.uid);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    switch (error.code) {
      case "auth/email-already-exists":
        return res.status(400).json({
          success: false,
          message: "Email is already registered.",
        });

      case "auth/invalid-password":
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });

      case "auth/invalid-email":
        return res.status(400).json({
          success: false,
          message: "Invalid email address.",
        });

      default:
        console.error(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
  }
};

export default createUser;


const getuser = async (req, res) => {
    try {
        const { password } = req.body;

        // Email দিয়ে User খুঁজে বের করো
        const user = await User.findOne({ firebaseUid: req.user.uid});

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        

  

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const allusers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateuser = async (req, res) => {
    try {
        const { name, role, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { name, role, phone },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


const createSocialUser = async (req, res) => {
  try{
    const data = req.user;

    if (!data) {
      return res.status(400).json({ message: "No user data provided" });
    }
    const {name, email, uid, phone_number} = data;

    const existingUser = await User.findOne({ firebaseUid: uid });
    
    if (existingUser) {
       return res.status(200).json({ message: "Login successful", data: existingUser });
    }

    const newUser = await User.create({
      name,
      email,
      role: "user",
      phone: phone_number || "N/A",
      firebaseUid: uid
    });

    return res.status(201).json({ message: "User created successfully", data: newUser });
  
    

  }

  
  catch (error){
      console.error(error);
    res.status(500).json({ message: "Server error" });
  }

  
}



export { createUser, getuser, allusers, updateuser, createSocialUser }; 