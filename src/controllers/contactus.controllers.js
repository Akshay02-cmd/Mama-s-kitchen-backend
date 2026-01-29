import ContactUs from "../model/contactus.model.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

export const createContactUs = catchAsync(async (req, res) => {
    const { userID, name, email, message } = req.body;
    const contactus = await ContactUs.create({ userID, name, email, message });
    if (!contactus) {
      throw new BadRequestError("Unable to create contact us message");
    }
    res.status(StatusCodes.CREATED).json({ success: true, data: contactus });
});
  
export const getAllContactUs = catchAsync(async (req, res) => {
    const contactusMessages = await ContactUs.find();
    if (!contactusMessages) {
      throw new NotFoundError("No contact us messages found");
    }
    res.status(StatusCodes.OK).json({ success: true, data: contactusMessages });
  });
 

export const getContactUsById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const contactus = await ContactUs.findById(id);
    if (!contactus) {
      throw new NotFoundError(`Contact us message with id ${id} not found`);
    }
    res.status(StatusCodes.OK).json({ success: true, data: contactus });
  });

export const GroupContactUsByUser = catchAsync(async (req, res) => {
    const groupedData = await ContactUs.aggregate([
      { $group: { _id: "$userID", messages: { $push: "$$ROOT" } } },
    ]);
    if (!groupedData) {
      throw new NotFoundError("No contact us messages found to group");
    }
    res.status(StatusCodes.OK).json({ success: true, data: groupedData });
  });

export const deleteContactUs = catchAsync(async (req, res) => {
    const { id } = req.params;
    const contactus = await ContactUs.findByIdAndDelete(id);
    if (!contactus) {
      throw new NotFoundError(`Contact us message with id ${id} not found`);
    }
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Contact us message deleted successfully",
      });
  });
   
export const deleteAllContactUs = catchAsync(async (req, res) => {
    await ContactUs.deleteMany({});
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All contact us messages deleted successfully",
      });
  });

