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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      maxlength: 10,
      match: [/^[6-9]d{9}$/, "Invalid Phone Number"],
      required: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

const Customer =  mongoose.model("Customer", CustomerSchema)

export default Customer;