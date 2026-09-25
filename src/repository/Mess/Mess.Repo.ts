import mess from "../../model/Mess.model.js";
import mongoose from "mongoose";

export interface IMess {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  area: string;
  phone: string;
  address: string;
  description: string;
  is_Active: boolean;
}

class Mess {
  async MessCreate(ownerId: mongoose.Types.ObjectId, messData: Omit<IMess, "ownerId">) {
    const { ownerId: _ignoredOwnerId, ...messPayload } = messData as IMess;
    return await mess.create({
      ownerId,
      ...messPayload,
    });
  }

  async MessGetById(messId: mongoose.Types.ObjectId) {
    return await mess.findById(messId).populate("ownerId", "name email");
  }

  async MessGetAll(filters = {}) {
    return await mess
      .find(filters)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
  }

  async MessGetByOwnerId(ownerId: mongoose.Types.ObjectId | string) {
    return await mess
      .find({ ownerId })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
  }

  async MessUpdateById(messId: mongoose.Types.ObjectId, updateData: Partial<IMess>) {
    return await mess
      .findByIdAndUpdate(messId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("ownerId", "name email");
  }

  async MessDeleteById(messId: mongoose.Types.ObjectId) {
    return await mess.findByIdAndDelete(messId);
  }

  async MessDeleteByOwnerId(ownerId: mongoose.Types.ObjectId) {
    return await mess.deleteMany({ ownerId });
  }

  async MessCount(filters = {}) {
    return await mess.countDocuments(filters);
  }
}

export default new Mess;
