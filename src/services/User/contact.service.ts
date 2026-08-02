import { contact as contactRepo } from "../../repository/index.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

export const createContact = async (contactData) => {
  const { userID, name, email, phone, subject, message } = contactData;

  if (!userID || !name || !email || !message) {
    throw new BadRequestError("All fields are required");
  }

  const contact = await contactRepo.ContactCreate({
    userID,
    name,
    email,
    phone,
    subject,
    message,
  });

  if (!contact) {
    throw new BadRequestError("Unable to create contact us message");
  }

  return contact;
};

export const getAllContacts = async () => {
  const contacts = await contactRepo.ContactGetAll();

  if (!contacts || contacts.length === 0) {
    throw new NotFoundError("No contact us messages found");
  }

  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await contactRepo.ContactGetById(contactId);

  if (!contact) {
    throw new NotFoundError(
      `Contact us message with id ${contactId} not found`,
    );
  }

  return contact;
};

export const getContactsGroupedByUser = async () => {
  const groupedData = await contactRepo.ContactGroupedByUser();

  if (!groupedData || groupedData.length === 0) {
    throw new NotFoundError("No contact us messages found to group");
  }

  return groupedData;
};

export const deleteContact = async (contactId) => {
  const contact = await contactRepo.ContactDelete(contactId);

  if (!contact) {
    throw new NotFoundError(
      `Contact us message with id ${contactId} not found`,
    );
  }

  return contact;
};

export const deleteAllContacts = async () => {
  const result = await contactRepo.ContactDeleteMany();
  return result.deletedCount;
};

export const getContactStatistics = async () => {
  const [totalContacts, uniqueUsers] = await Promise.all([
    contactRepo.ContactGetCount(),
    contactRepo.uniqueUser(),
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
