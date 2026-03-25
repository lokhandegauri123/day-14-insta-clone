const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access",
    });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({
      message: "User not authorized",
    });
  }

  req.user = decoded
  next()
}

module.exports = identifyUser;
