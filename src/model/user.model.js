import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const UserSchema = new mongoose.Schema({
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

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  // Convert minutes to proper JWT format (e.g., "30m", "7d")
  // If accessExpirationMinutes is 30, convert to "30m"
  // For better UX, use days instead: 7 days = 10080 minutes
  const expirationMinutes = config.jwt.accessExpirationMinutes || 10080; // Default 7 days
  const expiresIn = `${expirationMinutes}m`;
  
  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role },
    config.jwt.secret,
    { expiresIn }
  );
};

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

export default User;
