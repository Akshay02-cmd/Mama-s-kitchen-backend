import { StatusCodes } from "http-status-codes";
import MESS from "../model/Mess.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const createMess = async (req, res) => {
  const { userId } = req.user;
  const { messName, area, phone, address, description } = req.body;

  const mess = await MESS.create({
    ownerId: userId,
    name: messName,
    area,
    phone,
    address,
    description,
  });

  if (!mess) {
    throw new BadRequestError("Unable to create mess");
  }
  res.status(StatusCodes.CREATED).json({ mess });
};

const getMess = async (req, res) => {
  const { messid } = req.params;
  const mess = await MESS.findById(messid);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
};

const updateMess = async (req, res) => {
  const { messid } = req.params;
  const { name, area, phone, address, description } = req.body;
  const mess = await MESS.findByIdAndUpdate(
    messid,
    { name, area, phone, address, description },
    { new: true, runValidators: true }
  );
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
};

const deleteMess = async (req, res) => {
  const { messid } = req.params;
  const mess = await MESS.findByIdAndDelete(messid);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
};

const getallMesses = async (req, res) => {
  const messes = await MESS.find({});
  if (!messes) {
    throw new NotFoundError("No messes found");
  }
  res.status(StatusCodes.OK).json({ messes });
};

export { createMess, getMess, updateMess, deleteMess, getallMesses };
