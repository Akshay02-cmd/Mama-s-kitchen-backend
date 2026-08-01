import mongoose from "mongoose";

interface IContactUs {
  userID: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactUsSchema: mongoose.Schema<IContactUs> = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const ContactUs: mongoose.Model<IContactUs> = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;
