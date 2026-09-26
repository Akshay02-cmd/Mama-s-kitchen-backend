import OwnerProfile from "../../model/Owner.model.js";
import mongoose from "mongoose";

export interface IOwner {
  userId: mongoose.Types.ObjectId;
  phone: string;
  address: string;
  profileImage?: string;
  isProfileCompleted: boolean;
}


class OProfile {
  async createOwnerProfile(profileData: IOwner) {
    return OwnerProfile.create(profileData);
  }

  async getOwnerProfileByUserId(userId: mongoose.Types.ObjectId) {
    return OwnerProfile.findOne({ userId })
      .populate("userId", "name email role")
      .select("-__v");
  }

  async OwnerAll() {
    return OwnerProfile.find({})
      .populate("userId", "name email role")
      .select("-__v");
  }

  async OwnerCount() {
    return OwnerProfile.countDocuments();
  }

  async OProfileUpdate(userId: mongoose.Types.ObjectId, updateData: Partial<IOwner>) {
    return OwnerProfile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }
}



export default new OProfile();
