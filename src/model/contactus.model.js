import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;
