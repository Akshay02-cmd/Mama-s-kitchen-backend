import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    isProfileCompleted:{
      type: Boolean,
      default: false,
      required: true,
    }
  },
  { timestamps: true }
);

const Customer =  mongoose.model("Customer", CustomerSchema)

export default Customer;