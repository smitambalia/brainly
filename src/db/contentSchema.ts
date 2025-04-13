import mongoose, { model, Schema } from "mongoose";

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const ContentModel = model("Content", contentSchema);
