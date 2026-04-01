const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required : [true , "Follower is required"]
    },

    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required : [true , "Followee is required"]
    },
    status :{
      type : String,
      default : "pending",
      enum : {
        values : ["pending", "accepted" , "rejected"],
        message : "status can only be pending, accepted or rejected"
      }
    }
  },
  {
    timestamps: true,
  },
);

// Compound Index = user can follow many people, but not same person twice
// A → B ✅
// A → C
followSchema.index({ follower : 1, followee : 1}, {unique : true})

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;
