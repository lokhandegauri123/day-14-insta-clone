const userModel = require("../models/user.model")
const authRouter = require("../routes/auth.route")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
async function registerController(req, res) {
  const { username, email, pass, bio, profile_image } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User already exist ",
    });
  }

  const hash = await bcrypt.hash(pass, 10)

  const user = await userModel.create({
    username,
    email,
    pass: hash,
    bio,
    profile_image,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username : user.username 
    },
    process.env.JWT_SECRET,
    
  );

  res.cookie("token", token);

  res.status(200).json({
    username: user.username,
    email: user.email,
    bio: user.bio,
    profile_image: user.profile_image,
  });
}

async function loginController(req, res) {
  const { username, email, pass } = req.body;
  /***
   * username
   * pass
   * *
   *
   * email
   * pass** */

  /* 
  {username : a, email : test@test.com , pass : test} = req.body
  */
  const user = await userModel.findOne({
    $or: [
      {
        /* 
          condition
          if   
          1. username : a
          2. username : undefined
        */
        username: username,
      },
      {
        /*
      condition 
      1. email: undefined
      2. email : a
      */
        email: email,
      },
    ],
  });
// user.pass = hash

  const isPassValid = await bcrypt.compare(pass , user.pass)


  if (!isPassValid) {
    return res.status(401).json({
      message: "invalid pass",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username : user.username
    },
    process.env.JWT_SECRET,
   
  );

  res.cookie("token", token);

  res.status(200).json({
    message: " user loggedIn successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      // profile_image : username.profile_image
    },
  });
}

module.exports = {
  registerController,
  loginController,
};
