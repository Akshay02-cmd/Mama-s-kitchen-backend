/**
 * @fileoverview User model for authentication and account management
 * @module model/user.model
 * @requires mongoose
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires dotenv
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * User schema definition
 * @typedef {Object} User
 * @property {string} role - User role (CUSTOMER or OWNER)
 * @property {string} name - User's full name
 * @property {string} email - Unique email address
 * @property {string} password - Hashed password
 * @property {Date} createdAt - Account creation timestamp
 */
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

/**
 * Generate JWT token for user
 * @method createJWT
 * @returns {string} Signed JWT token
 * @memberof User
 */
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME || "30d" }
  );
};

/**
 * Compare plain text password with hashed password
 * @method comparePassword
 * @param {string} userPassword - Plain text password
 * @returns {Promise<boolean>} True if passwords match
 * @memberof User
 */
UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

export default User;
