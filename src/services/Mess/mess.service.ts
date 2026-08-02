import { Mess } from "../../repository/index.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

export const createMess = async (ownerId: any, messData: any) => {
  const mess = await Mess.MessCreate(ownerId, messData);

  if (!mess) {
    throw new BadRequestError("Unable to create mess");
  }

  return mess;
};

export const getMessById = async (messId: any) => {
  if (!messId) {
    throw new NotFoundError("Mess ID is required");
  }

  const mess = await Mess.MessGetById(messId);

  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess;
};

export const getAllMesses = async (filters: any = {}) => {
  const { area, search, is_Active } = filters;
  const queryObject: any = {};

  // Filter by area
  if (area) {
    queryObject.area = { $regex: area, $options: "i" };
  }

  // Search in name and description
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by active status
  if (is_Active !== undefined) {
    queryObject.is_Active = is_Active === "true" || is_Active === true;
  }

  const messes = await Mess.MessGetAll(queryObject);

  // Return empty array if no messes found instead of throwing error
  return messes || [];
};

export const updateMess = async (messId: any, updateData: any) => {
  const mess = await Mess.MessUpdateById(messId, updateData);

  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess;
};

export const deleteMess = async (messId: any) => {
  const mess = await Mess.MessDeleteById(messId);

  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess;
};

export const getMessesByOwnerId = async (ownerId: any) => {
  const messes = await Mess.MessGetByOwnerId(ownerId);

  return messes;
};

export const verifyMessOwnership = async (messId: any, ownerId: any) => {
  const mess = await Mess.MessGetById(messId);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  return mess.ownerId.toString() === ownerId.toString();
};

const messService = {
  createMess,
  getMessById,
  getAllMesses,
  updateMess,
  deleteMess,
  getMessesByOwnerId,
  verifyMessOwnership,
};

export default messService;
