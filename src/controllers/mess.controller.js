import { StatusCodes } from "http-status-codes";
import MESS from "../model/Mess.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const createMess = (req, res) => {
  const { userId } = req.user.userId;
  const { messName, area, phone, address, description } = req.body;

  const mess = MESS.create({
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

const getMess = (req, res) => {
  const { messid } = req.params;
  const mess = MESS.findById(messid);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
};

const updateMess = (req, res) => {
  const { messid } = req.params;
  const { name, area, phone, address, description } = req.body;
  const mess = MESS.findByIdAndUpdate(
    messid,
    { name, area, phone, address, description },
    { new: true, runValidators: true }
  );
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
};

const deleteMess = (req, res) => {
  const { messid } = req.params;
  const mess = MESS.findByIdAndDelete(messid);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  res.status(StatusCodes.OK).json({ mess });
};

const getallMesses = (req, res) => {
  const messes = MESS.find({});
  if (!messes) {
    throw new NotFoundError("No messes found");
  }
  res.status(StatusCodes.OK).json({ messes });
};

export { createMess, getMess, updateMess, deleteMess, getallMesses };
