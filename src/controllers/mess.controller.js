/**
 * @fileoverview Mess management controller for CRUD operations
 * @module controllers/mess.controller
 * @requires http-status-codes
 * @requires ../model/Mess.model
 * @requires ../errors/index
 */

import { StatusCodes } from "http-status-codes";
import MESS from "../model/Mess.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

/**
 * Create a new mess/catering service
 * 
 * @async
 * @function createMess
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from JWT
 * @param {string} req.user.userId - Owner's user ID
 * @param {Object} req.body - Mess data
 * @param {string} req.body.messName - Mess name
 * @param {string} req.body.area - Location area
 * @param {string} req.body.phone - Contact number
 * @param {string} req.body.address - Full address
 * @param {string} req.body.description - Mess description
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with created mess
 * @throws {BadRequestError} If mess creation fails
 */
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
