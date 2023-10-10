import mongoose, { Document, Schema } from "mongoose";
import { IAuthentication } from "@auth/auth.interfaces";

export interface IUser {
  name: string;
  email: string;
  created: Date;
  authentication: IAuthentication;
}

export interface IUserModel extends IUser, Document {}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    created: { type: Date, require: false },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, required: true, select: false },
      sessionToken: { type: String, select: false },
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("user", userSchema);
