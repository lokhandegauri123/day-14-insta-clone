const followModel = require("../models/follows.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  // who is the user
  const followerUsername = req.user.username;

  const followeeUsername = req.params.username;

  // Find the followee user
  const isFolloweeExist = await userModel.findOne({ username: followeeUsername });
  if (!isFolloweeExist) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find the follower user (though it should be the authenticated user)
  const isFollowerExist = await userModel.findOne({ username: followerUsername });
  if (!isFollowerExist) {
    return res.status(404).json({ message: "Follower not found" });
  }

  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "you cannot follow yourself",
    });
  }

  const isAlreadyFollowing = await followModel.findOne({
    followee: followeeUsername._id,
    follower: followerUsername._id,
  });

  if (isAlreadyFollowing) {
    return res.status(200).json({
      message: `You already following ${followeeUsername}`,
      follow: isAlreadyFollowing,
    });
  }
  const followRecord = await followModel.create({
    follower: followerUsername._id,
    followee: followeeUsername._id,
  });

  res.status(201).json({
    message: `You are now following ${followeeUsername}`,
    follow: followRecord,
  });
}

async function unFollowUserController(req , res) 
{
    const followerUsername =  req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower : followerUsername._id,
        followee : followeeUsername._id
    })
    
    if(!isUserFollowing){
        return res.status(200).json({
            message : `you are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message : `you have unfollowed ${followeeUsername}`
    })
}
module.exports = {
  followUserController,
  unFollowUserController
};
