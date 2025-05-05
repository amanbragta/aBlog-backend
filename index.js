import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import clerkWebHook from "./routes/webhook.route.js";
import { clerkMiddleware } from "@clerk/express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("connected to mongo"))
  .catch((err) => console.log(err));

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());
app.use("/webhooks", clerkWebHook);
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.get("/", (req, res) => {
  res.status(200).send("Hello Vercel!");
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong",
    status: error.status,
    stack: error.stack,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
