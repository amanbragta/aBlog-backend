import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });
  res.json(comments);
};

export const addComments = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;
  if (!clerkUserId) return res.status(401).json("User is not authenticated");
  const user = await User.findOne({ clerkUserId });
  const comment = new Comment({
    ...req.body,
    post: postId,
    user: user._id,
  });
  const savedComment = await comment.save();
  res.status(201).json(savedComment);
};

export const deleteComments = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const id = req.params.id;

  const admin = req.auth.sessionClaims?.meta_data?.role || "user";

  if (admin === "admin") {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).send("Comment deleted");
  }

  if (!clerkUserId) return res.status(401).json("User is not authenticated");
  const user = await User.findOne({ clerkUserId });
  const deletedComment = await Comment.findOneAndDelete({
    _id: id,
    user: user._id,
  });
  if (!deletedComment)
    res.status(403).json("You can delete only your comments.");
  res.status(200).json("Deleted successfully.");
};
