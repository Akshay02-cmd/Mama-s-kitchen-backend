import { StatusCodes } from "http-status-codes";
import { messService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

const createMess = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const mess = await messService.createMess(userId, req.body);
  res.status(StatusCodes.CREATED).json({ mess });
});

const getMess = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mess = await messService.getMessById(id);
  res.status(StatusCodes.OK).json({ mess });
});

const updateMess = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mess = await messService.updateMess(id, req.body);
  res.status(StatusCodes.OK).json({ mess });
});

const deleteMess = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mess = await messService.deleteMess(id);
  res.status(StatusCodes.OK).json({ mess });
});

const getallMesses = catchAsync(async (req, res) => {
  const { area, search, is_Active } = req.query;
  const filters = { area, search, is_Active };
  const messes = await messService.getAllMesses(filters);
  res.status(StatusCodes.OK).json({ messes });
});

export { createMess, getMess, updateMess, deleteMess, getallMesses };
