import ContactUs from "../model/contactus.model.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createContactUs = async (req, res) => {
  try {
    const { userID, name, email, message } = req.body;
    const contactus = await ContactUs.create({ userID, name, email, message });
    if (!contactus) {
      throw new BadRequestError("Unable to create contact us message");
    }
    res.status(StatusCodes.CREATED).json({ success: true, data: contactus });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const getAllContactUs = async (req, res) => {
  try {
    const contactusMessages = await ContactUs.find();
    if (!contactusMessages) {
      throw new NotFoundError("No contact us messages found");
    }
    res.status(StatusCodes.OK).json({ success: true, data: contactusMessages });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const getContactUsById = async (req, res) => {
  try {
    const { id } = req.params;
    const contactus = await ContactUs.findById(id);
    if (!contactus) {
      throw new NotFoundError(`Contact us message with id ${id} not found`);
    }
    res.status(StatusCodes.OK).json({ success: true, data: contactus });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const GroupContactUsByUser = async (req, res) => {
  try {
    const groupedData = await ContactUs.aggregate([
      { $group: { _id: "$userID", messages: { $push: "$$ROOT" } } },
    ]);
    if (!groupedData) {
      throw new NotFoundError("No contact us messages found to group");
    }
    res.status(StatusCodes.OK).json({ success: true, data: groupedData });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const deleteContactUs = async (req, res) => {
  try {
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
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const deleteAllContactUs = async (req, res) => {
  try {
    await ContactUs.deleteMany({});
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All contact us messages deleted successfully",
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

