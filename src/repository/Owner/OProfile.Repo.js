import OwnerProfile from "../../model/OwnerProfile.model.js";

class OProfile {
  async createOwnerProfile(profileData) {
    return OwnerProfile.create(profileData);
  }

  async getOwnerProfileByUserId(userId) {
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

  async OProfileUpdate(userId, updateData) {
    return OwnerProfile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email role");
  }
}



export default new OProfile();
