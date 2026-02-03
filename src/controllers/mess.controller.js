import { StatusCodes } from "http-status-codes";
import MESS from "../model/Mess.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

const createMess = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { name, area, phone, address, description } = req.body;

  const mess = await MESS.create({
    ownerId: userId,
    name,
    area,
    phone,
    address,
    description,
  });

  if (!mess) {
    throw new BadRequestError("Unable to create mess");
  }
  res.status(StatusCodes.CREATED).json({ mess });
});

const getMess = catchAsync(async (req, res) => {
  const { id } = req.params;
  if(!id){
    throw new NotFoundError("id is not passed");
  }
  const mess = await MESS.findById(id);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
});

const updateMess = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, area, phone, address, description } = req.body;
  const mess = await MESS.findByIdAndUpdate(
    id,
    { name, area, phone, address, description },
    { new: true, runValidators: true },
  );
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
});

const deleteMess = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mess = await MESS.findByIdAndDelete(id);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
});

const getallMesses = catchAsync(async (req, res) => {
  const { area, search, is_Active } = req.query;
  const queryObject = {};

  if (area) {
    queryObject.area = { $regex: area, $options: "i" };
  }
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (is_Active) {
    queryObject.is_Active = is_Active === "true";
  }

  if (Object.keys(queryObject).length === 0) {
    const messes = await MESS.find({});
  }
  const messes = await MESS.find(queryObject)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });
  if (!messes || messes.length === 0) {
    throw new NotFoundError("No messes found");
  }
  res.status(StatusCodes.OK).json({ messes });
});

export { createMess, getMess, updateMess, deleteMess, getallMesses };
