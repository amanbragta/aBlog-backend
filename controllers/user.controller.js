import User from "../models/user.model.js";

export const getSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;
  if (!clerkUserId) res.status(401).json("Not authenticated");
  const user = await User.findOne({ clerkUserId });
  res.status(200).json(user.savedPosts);
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;
  if (!clerkUserId) res.status(401).json("Not authenticated");
  const user = await User.findOne({ clerkUserId });
  const isSaved = user.savedPosts.some((post) => post === postId);
  let update;
  if (!isSaved) {
    update = await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    update = await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }
  setTimeout(() => res.status(200).json(update), 3000);
};
