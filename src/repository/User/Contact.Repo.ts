import ContactUs from "../../model/contactus.model.js";

class Contact {
  async create(contactData: any) {
    return ContactUs.create(contactData);
  }

  find(filters: any = {}) {
    return ContactUs.find(filters);
  }

  countDocuments(filters: any = {}) {
    return ContactUs.countDocuments(filters);
  }

  async ContactCreate(contactData: any) {
    return ContactUs.create(contactData);
  }

  async ContactGetAll() {
    return ContactUs.find({})
      .populate("userID", "name email")
      .sort({ createdAt: -1 });
  }

  async ContactGetById(contactId: any) {
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

  async ContactDelete(contactId: any) {
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
