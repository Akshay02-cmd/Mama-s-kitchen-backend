import ContactUs from "../../model/contactus.model.js";

const ContactCreate = async (contactData) => {
  return ContactUs.create(contactData);
};

const ContactGetAll = async () => {
  return ContactUs.find({})
    .populate("userID", "name email")
    .sort({ createdAt: -1 });
};

const ContactGetById = async (contactId) => {
  return ContactUs.findById(contactId).populate("userID", "name email");
};

const ContactGroupedByUser = async () => {
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
};

const ContactDelete = async (contactId) => {
  return ContactUs.findByIdAndDelete(contactId);
};

const ContactDeleteMany = async () => {
  return ContactUs.deleteMany({});
}

const ContactGetCount = async () => {
  const count = await ContactUs.countDocuments();
  return count;
}

const uniqueUser = async () => {
  const uniqueUsers = await ContactUs.distinct("userID");
  return uniqueUsers.length;
}

const contact = {
  ContactCreate,
  ContactGetAll,
  ContactGetById,
  ContactGroupedByUser,
  ContactDelete,
  ContactDeleteMany,
  ContactGetCount,
  uniqueUser,
};

export default contact;
