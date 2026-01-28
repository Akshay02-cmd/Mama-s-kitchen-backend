import express from "express";
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  GroupContactUsByUser,
  deleteContactUs,
} from "../controllers/contactus.controller.js";

const router = express.Router();

router.route("/").post(createContactUs);
router.route("/:id").get(getContactUsById).delete(deleteContactUs);
router.route("/getallContacts").get(getAllContactUs);
router.route("/groupbyuser").get(GroupContactUsByUser);

export default router;
