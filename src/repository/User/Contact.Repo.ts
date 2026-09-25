import ContactUs from "../../model/contactus.model.js";
import mongoose from "mongoose";

export interface IContact {
  userID: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: Date;
}

class Contact {
  async ContactCreate(contactData: IContact) {
    return ContactUs.create(contactData);
  }

  async ContactGetAll() {
    return ContactUs.find({})
      .populate("userID", "name email")
      .sort({ createdAt: -1 });
  }

  async ContactGetById(contactId: mongoose.Types.ObjectId) {
    return ContactUs.findById(contactId).populate("userID", "name email");
  }

  async ContactGroupedByUser() {
    return ContactUs.aggregate([
      {
        $group: {
          _id: "$userID",
          messages: { $push: "$$ROOT" },
          messageCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
          messages: 1,
          messageCount: 1,
        },
      },
    ]);
  }

  async ContactDelete(contactId: mongoose.Types.ObjectId) {
    return ContactUs.findByIdAndDelete(contactId);
  }

  async ContactDeleteMany() {
    return ContactUs.deleteMany({});
  }

  async ContactGetCount() {
    return await ContactUs.countDocuments();
  }

  async uniqueUser() {
    return (await ContactUs.distinct("userID")).length;
  }
}

export default new Contact;
