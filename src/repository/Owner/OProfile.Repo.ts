import OwnerProfile from "../../model/OwnerProfile.model.js";

class OProfile {
  create(profileData: any) {
    return OwnerProfile.create(profileData);
  }

  find(filters: any = {}) {
    return OwnerProfile.find(filters);
  }

  findOne(filters: any = {}) {
    return OwnerProfile.findOne(filters);
  }

  countDocuments(filters: any = {}) {
    return OwnerProfile.countDocuments(filters);
  }

  async getByUserId(userId: any) {
    return OwnerProfile.findOne({ userId })
      .populate("userId", "name email role")
      .select("-__v");
  }

  async update(userId: any, updateData: any) {
    return OwnerProfile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }

  async createOwnerProfile(profileData: any) {
    return OwnerProfile.create(profileData);
  }

  async getOwnerProfileByUserId(userId: any) {
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

  async OProfileUpdate(userId: any, updateData: any) {
    return OwnerProfile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }
}



export default new OProfile();
