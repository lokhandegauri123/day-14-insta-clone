const postModel = require("../models/posts.model");
const ImageKit = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const { Readable } = require("stream");
const likeModel = require("../models/like.model");

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

    // const token = req.cookies?.token;
    // if (!token) {
    //   return res.status(401).json({
    //     message: "Token not provided, Unauthorized access",
    //   });
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const stream = Readable.from(req.file.buffer);

    const file = await imagekit.files.upload({
      file: stream,
      fileName: req.file.originalname,
      folder: "/posts",
      useUniqueFileName: true,
    });

    const post = await postModel.create({
      caption: req.body.caption || "",
      imgUrl: file.url,
      user: req.user.id,
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

async function getPostController(req, res) {
  // const token = req.cookies?.token;

  // let decoded;
  // try {
  //   decoded = jwt.verify(token, process.env.JWT_SECRET);
  // } catch (err) {
  //   return res.status(400).json({
  //     message: "Token unauthorized",
  //   });
  // }

  const userId = req.user.id;
  const posts = await postModel
    .find({
      user: userId,
    })
    .lean();

  res.status(200).json({
    message: "post fetched successfully",
    posts,
  });
}

/* get  /api/posts/details/:postId

it return specific post and also check whether it belong to specific person or not 
:postId = dynamic id
*/
async function getPostDetailsController(req, res) {
  // const token = req.cookies?.token;

  // let decoded;
  // try {
  //   decoded = jwt.verify(token, process.env.JWT_SECRET);
  // } catch (err) {
  //   return res.status(401).json({
  //     message: "invalid Token ",
  //   });
  // }

  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden content",
    });
  }

  return res.status(200).json({
    message: "post fetched successfully",
    post,
  });
}

async function likePostController(req , res) {
   const username = req.user.username
   const postId = req.params.postId

   const isPost = await postModel.findById(postId)

   if(!isPost){
    return res.status(404).json({
      message : "post does not exist"
    })
   }
  
   const like = await likeModel.create({
      post : postId,
      user : username 
   })

   res.status(200).json({
    message : "post liked successfully",
    like
   })


}
module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController
};
