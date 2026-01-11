import mongoose from "mongoose";

const MessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]d{9}$/, "Invalid phone number"],
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    messName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minlength: 10,
      maxlength: 400,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Mess = mongoose.model("MessOwnerProfile", MessSchema);

export default Mess;
