import mongoose ,{ model, Schema } from "mongoose";
// mongodb://localhost:27017/
mongoose.connect("mongodb://localhost:27017/brainly");
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export const UserModel = model("User", userSchema);
