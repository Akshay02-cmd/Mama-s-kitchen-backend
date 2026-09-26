import Customer from "../../model/Customer.model.js";
import mongoose from "mongoose";

export interface ICustomer {
  userId: mongoose.Types.ObjectId;
  phone: string;
  address: string;
  profileImage?: string;
  isProfileCompleted: boolean;
}

class CProfile {
  async createCustomerProfile(profileData: ICustomer) {
    return Customer.create(profileData);
  }

  async getCustomerProfileByUserId(userId: mongoose.Types.ObjectId) {
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

  async CustomerUpdate(userId: mongoose.Types.ObjectId, updateData: Partial<ICustomer>) {
    return Customer.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }
}

export default new CProfile;
