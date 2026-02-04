import { StatusCodes } from "http-status-codes";
import { contactService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

export const createContactUs = catchAsync(async (req, res) => {
    const contactus = await contactService.createContact(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: contactus });
});
  
export const getAllContactUs = catchAsync(async (req, res) => {
    const contactusMessages = await contactService.getAllContacts();
    res.status(StatusCodes.OK).json({ success: true, data: contactusMessages });
  });
 

export const getContactUsById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const contactus = await contactService.getContactById(id);
    res.status(StatusCodes.OK).json({ success: true, data: contactus });
  });

export const GroupContactUsByUser = catchAsync(async (req, res) => {
    const groupedData = await contactService.getContactsGroupedByUser();
    res.status(StatusCodes.OK).json({ success: true, data: groupedData });
  });

export const deleteContactUs = catchAsync(async (req, res) => {
    const { id } = req.params;
    await contactService.deleteContact(id);
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Contact us message deleted successfully",
      });
  });
   
export const deleteAllContactUs = catchAsync(async (req, res) => {
    await contactService.deleteAllContacts();
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All contact us messages deleted successfully",
      });
  });

