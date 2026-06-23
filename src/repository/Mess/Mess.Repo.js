import mess from "../../model/Mess.model.js";

const MessCreate = async (ownerId, messData) => {
  return await mess.create({
    ownerId,
    ...messData,
  });
};

const MessGetById = async (messId) => {
  return await mess.findById(messId).populate("ownerId", "name email");
};

const MessGetAll = async (filters = {}) => {
  return await mess.find(filters)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });
};

const MessUpdateById = async (messId, updateData) => {
  return await mess.findByIdAndUpdate(messId, updateData, {
    new: true,
    runValidators: true,
  }).populate("ownerId", "name email");
};

const MessDeleteById = async (messId) => {
  return await mess.findByIdAndDelete(messId);
};

const MessDeleteByOwnerId = async (ownerId) => {
  return await mess.deleteMany({ ownerId });
};

const MessCount = async (filters = {}) => {
  return await mess.countDocuments(filters);
};

const Mess = {
  MessCreate,
  MessGetById,
  MessGetAll,
  MessUpdateById,
  MessDeleteById,
  MessDeleteByOwnerId,
  MessCount,
};

export default Mess;