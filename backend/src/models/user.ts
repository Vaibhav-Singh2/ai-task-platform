import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type IUserModel = mongoose.Model<IUser>;

const schema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export const User = mongoose.model<IUser, IUserModel>("User", schema);
