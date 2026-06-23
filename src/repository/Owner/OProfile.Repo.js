import OwnerProfile from "../../model/OwnerProfile.model.js";

const createOwnerProfile = async (profileData) => {
  return OwnerProfile.create(profileData);
};

const getOwnerProfileByUserId = async (userId) => {
  return OwnerProfile.findOne({ userId })
    .populate("userId", "name email role")
    .select("-__v");
};

const OwnerAll = async () => {
  return OwnerProfile.find({})
    .populate("userId", "name email role")
    .select("-__v");
};

const OwnerCount = async () => {
  return OwnerProfile.countDocuments();
};

const OProfileUpdate = async (userId, updateData) => {
  return OwnerProfile.findOneAndUpdate({ userId }, updateData, {
    new: true,
    runValidators: true,
  }).populate("userId", "name email role");
};

const OProfile = {
  OwnerAll,
  OwnerCount,
  getByUserId: getOwnerProfileByUserId,
  update: OProfileUpdate,
  create: createOwnerProfile,
};

export default OProfile;
