import mess from "../../model/Mess.model.js";

class Mess {
  async MessCreate(ownerId, messData) {
    return await mess.create({
      ownerId,
      ...messData,
    });
  }

  async MessGetById(messId) {
    return await mess.findById(messId).populate("ownerId", "name email");
  }

  async MessGetAll(filters = {}) {
    return await mess
      .find(filters)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
  }

  async MessUpdateById(messId, updateData) {
    return await mess
      .findByIdAndUpdate(messId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("ownerId", "name email");
  }

  async MessDeleteById(messId) {
    return await mess.findByIdAndDelete(messId);
  }

  async MessDeleteByOwnerId(ownerId) {
    return await mess.deleteMany({ ownerId });
  }

  async MessCount(filters = {}) {
    return await mess.countDocuments(filters);
  }
}

export default new Mess;
