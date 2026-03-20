const mongoose =require("mongoose")

const userSchema = new mongoose.Schema({
     username: {
        type: String,
        unique : [true,"username already exist"],
        required: [true,"username required"] 
     },
     email :{
        type : String,
        unique : [true,"email already exist"],
        required: [true,"email required"] 
     },
     pass: {
        type: String,
        required : [true, "Password required"]
     },
     bio: String,
     profile_image : {
        type:String,
        default: "https://ik.imagekit.io/ndu2xecdf/default-avatar-social-media-display-600nw-2632690107.webp"
    },
    

})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel