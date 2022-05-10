import mongoose from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ["admin", "client", "super-user", "SEO"],
        message: "{VALUE} no es un rol válido",
        default: "client",
        required: true,
      },
    },
  },
  { timestamps: true }
);
const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
