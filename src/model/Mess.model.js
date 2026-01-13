import mongoose from "mongoose";

const MessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    area: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    phone: {
      type: String,
      match: [/^[6-9]d{9}$/, "Invalid phone number"],
      required: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    is_Active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);
const Mess = mongoose.model("Mess", MessSchema);

export default Mess;
