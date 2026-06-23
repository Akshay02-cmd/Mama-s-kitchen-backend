import Customer from "../../model/CustomerProfile.model.js";

const createCustomerProfile = async (profileData) => {
  return Customer.create(profileData);
};

const getCustomerProfileByUserId = async (userId) => {
  return Customer.findOne({ userId })
    .populate("userId", "name email role")
    .select("-__v");
};

const CustomerAll = async () => {
  return (await Customer.find({}))
    .populate("userId", "name email role")
    .select("-__v");
};

const CustomerCount = async () => {
  return Customer.countDocuments();
};

const CustomerUpdate = async (userId, updateData) => {
  return Customer.findOneAndUpdate(
    { userId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("userId", "name email role");
};

const CProfile = {
  CustomerAll,
  CustomerCount,
  create: createCustomerProfile,
  getByUserId: getCustomerProfileByUserId,
  update: CustomerUpdate,
};

export default CProfile;
