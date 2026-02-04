/**
 * @fileoverview Contact Service
 * @module services/contact.service
 * @description Business logic for contact us operations
 */

import ContactUs from "../model/contactus.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

/**
 * Create a new contact us entry
 * @param {Object} contactData - Contact data
 * @param {string} contactData.userID - User ID
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.message - Contact message
 * @returns {Promise<Object>} Created contact entry
 * @throws {BadRequestError} If contact creation fails
 */
export const createContact = async (contactData) => {
  const { userID, name, email, message } = contactData;

  if (!userID || !name || !email || !message) {
    throw new BadRequestError("All fields are required");
  }

  const contact = await ContactUs.create({
    userID,
    name,
    email,
    message,
  });

  if (!contact) {
    throw new BadRequestError("Unable to create contact us message");
  }

  return contact;
};

/**
 * Get all contact entries
 * @returns {Promise<Array>} Array of contact entries
 * @throws {NotFoundError} If no contacts found
 */
export const getAllContacts = async () => {
  const contacts = await ContactUs.find({})
    .populate("userID", "name email")
    .sort({ createdAt: -1 });

  if (!contacts || contacts.length === 0) {
    throw new NotFoundError("No contact us messages found");
  }

  return contacts;
};

/**
 * Get contact entry by ID
 * @param {string} contactId - Contact ID
 * @returns {Promise<Object>} Contact entry
 * @throws {NotFoundError} If contact not found
 */
export const getContactById = async (contactId) => {
  const contact = await ContactUs.findById(contactId).populate(
    "userID",
    "name email"
  );

  if (!contact) {
    throw new NotFoundError(`Contact us message with id ${contactId} not found`);
  }

  return contact;
};

/**
 * Get contacts grouped by user
 * @returns {Promise<Array>} Array of grouped contacts
 * @throws {NotFoundError} If no contacts found
 */
export const getContactsGroupedByUser = async () => {
  const groupedData = await ContactUs.aggregate([
    {
      $group: {
        _id: "$userID",
        messages: { $push: "$$ROOT" },
        messageCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
        },
        messages: 1,
        messageCount: 1,
      },
    },
  ]);

  if (!groupedData || groupedData.length === 0) {
    throw new NotFoundError("No contact us messages found to group");
  }

  return groupedData;
};

/**
 * Delete contact entry
 * @param {string} contactId - Contact ID
 * @returns {Promise<Object>} Deleted contact entry
 * @throws {NotFoundError} If contact not found
 */
export const deleteContact = async (contactId) => {
  const contact = await ContactUs.findByIdAndDelete(contactId);

  if (!contact) {
    throw new NotFoundError(`Contact us message with id ${contactId} not found`);
  }

  return contact;
};

/**
 * Delete all contact entries
 * @returns {Promise<number>} Number of deleted contacts
 */
export const deleteAllContacts = async () => {
  const result = await ContactUs.deleteMany({});
  return result.deletedCount;
};

/**
 * Get contact statistics
 * @returns {Promise<Object>} Contact statistics
 */
export const getContactStatistics = async () => {
  const [totalContacts, uniqueUsers] = await Promise.all([
    ContactUs.countDocuments({}),
    ContactUs.distinct("userID").then((users) => users.length),
  ]);

  return {
    totalContacts,
    uniqueUsers,
  };
};

const contactService = {
  createContact,
  getAllContacts,
  getContactById,
  getContactsGroupedByUser,
  deleteContact,
  deleteAllContacts,
  getContactStatistics,
};

export default contactService;
