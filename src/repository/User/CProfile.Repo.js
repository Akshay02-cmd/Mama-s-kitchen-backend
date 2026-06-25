import Customer from "../../model/CustomerProfile.model.js";

class CProfile {
  async createCustomerProfile(profileData) {
    return Customer.create(profileData);
  }

  async getCustomerProfileByUserId(userId) {
    return Customer.findOne({ userId })
      .populate("userId", "name email role")
      .select("-__v");
  }

  async CustomerAll() {
    return (await Customer.find({}))
      .populate("userId", "name email role")
      .select("-__v");
  }

  async CustomerCount() {
    return Customer.countDocuments();
  }

  async CustomerUpdate(userId, updateData) {
    return Customer.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }
}

export default new CProfile;
