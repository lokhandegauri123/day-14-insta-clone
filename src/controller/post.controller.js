const postModel = require("../models/posts.model");
const ImageKit = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const { Readable } = require("stream");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function createPostController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    console.log(req.body, req.file);

    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "Token not provided, Unauthorized access",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const stream = Readable.from(req.file.buffer);

    const file = await imagekit.files.upload({
      file: stream,
      fileName: req.file.originalname,
      folder: '/posts',
      useUniqueFileName: true,
    });

    const post = await postModel.create({
      caption: req.body.caption || "",
      imgUrl: file.url,
      user: decoded.id,
    });

    return res.status(201).json({
      message: "post created successfully",
      post,
      imagekit: {
        fileId: file.fileId,
        url: file.url,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createPostController,
};
