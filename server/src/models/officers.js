import moongose from "mongoose";

const officerData = new moongose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        role:{
            type: String,
            required: true, 
        },
        phone:{
            type: String,
            required: true
        },
        specialId:{
            type: Number,
            required: true,
            unique: true
        },
        thanaId:{
            type: String,
            required: true, 
        }
    })

export default moongose.model("officer", officerData);



