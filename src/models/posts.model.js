const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        default : ''
    },
    imgUrl : {
        type : String,
        required : [true,"imgUrl is required for creating an post"]
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : [true,"user id requires for creting a post"]
    }
}) 

const postModel = mongoose.model("post",postSchema)

module.exports = postModel