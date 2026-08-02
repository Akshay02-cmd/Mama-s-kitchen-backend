import mess from "../../model/Mess.model.js";

class Mess {
  async MessCreate(ownerId: any, messData: any) {
    return await mess.create({
      ownerId,
      ...messData,
    });
  }

  find(filters: any = {}) {
    return mess.find(filters);
  }

  findById(messId: any) {
    return mess.findById(messId);
  }

  countDocuments(filters: any = {}) {
    return mess.countDocuments(filters);
  }

  async MessGetById(messId: any) {
    return await mess.findById(messId).populate("ownerId", "name email");
  }

  async MessGetAll(filters: any = {}) {
    return await mess
      .find(filters)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
  }

  async MessUpdateById(messId: any, updateData: any) {
    return await mess
      .findByIdAndUpdate(messId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("ownerId", "name email");
  }

  async MessDeleteById(messId: any) {
    return await mess.findByIdAndDelete(messId);
  }

  async MessDeleteByOwnerId(ownerId: any) {
    return await mess.deleteMany({ ownerId });
  }

  async MessCount(filters: any = {}) {
    return await mess.countDocuments(filters);
  }

  async MessGetByOwnerId(ownerId: any) {
    return await mess
      .find({ ownerId })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
  }
}

export default new Mess;
