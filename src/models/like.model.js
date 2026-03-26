const express = require("express")
const { default: mongoose } = require("mongoose")

const likeSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'posts',
        required : [true , "post id is required for creating post"]
    },
    user : {
        type : String,
        // ref : 'user',
        required : [true , "username is required for creating post"]
    },
    
},
{
    timestamps : true
})

likeSchema.index({post : 1 , user : 1}, {unique : true})
const likeModel = mongoose.model("like", likeSchema)

module.exports = likeModel 