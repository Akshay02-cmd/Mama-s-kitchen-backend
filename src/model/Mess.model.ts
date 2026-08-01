import mongoose from "mongoose";

interface IMess {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  area: string;
  phone: string;
  address: string;
  description: string;
  is_Active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessSchema: mongoose.Schema<IMess> = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
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
const Mess: mongoose.Model<IMess> = mongoose.model("Mess", MessSchema);

export default Mess;
