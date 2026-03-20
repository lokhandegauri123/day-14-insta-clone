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

  const hash = crypto.createHash("sha256").update(pass).digest("hex");

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
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
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

  const hash = crypto.createHash("sha256").update(pass).digest("hex");

  const isPassValid = hash === user.pass;

  if (!isPassValid) {
    return res.status(401).json({
      message: "invalid pass",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
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
