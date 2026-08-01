import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import config from "../config/config.js";

interface IUser {
  role: "CUSTOMER" | "OWNER";
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

interface IUserMethods {
  createJWT(): string;
  comparePassword(userPassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
type UserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  role: {
    type: String,
    enum: ["CUSTOMER", "OWNER"],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (this: UserDocument): string {
  const expirationMinutes = config.jwt.accessExpirationMinutes || 10080; // Default 7 days
  const secret = config.jwt.secret as Secret;

  const expiresInSeconds = Number(expirationMinutes) * 60;

  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role },
    secret,
    { expiresIn: expiresInSeconds }
  );
};

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  userPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model<IUser, UserModel>("User", UserSchema);


export default User;
