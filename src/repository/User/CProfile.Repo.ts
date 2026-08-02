import Customer from "../../model/CustomerProfile.model.js";

class CProfile {
  create(profileData: any) {
    return Customer.create(profileData);
  }

  find(filters: any = {}) {
    return Customer.find(filters);
  }

  findOne(filters: any = {}) {
    return Customer.findOne(filters);
  }

  countDocuments(filters: any = {}) {
    return Customer.countDocuments(filters);
  }

  async getByUserId(userId: any) {
    return Customer.findOne({ userId })
      .populate("userId", "name email role")
      .select("-__v");
  }

  async update(userId: any, updateData: any) {
    return Customer.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }

  async createCustomerProfile(profileData: any) {
    return Customer.create(profileData);
  }

  async getCustomerProfileByUserId(userId: any) {
    return Customer.findOne({ userId })
      .populate("userId", "name email role")
      .select("-__v");
  }

  async CustomerAll() {
    return Customer.find({})
      .populate("userId", "name email role")
      .select("-__v");
  }

  async CustomerCount() {
    return Customer.countDocuments();
  }

  async CustomerUpdate(userId: any, updateData: any) {
    return Customer.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }
}

export default new CProfile;
