import express from "express";
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  GroupContactUsByUser,
  deleteContactUs,
  deleteAllContactUs,
} from "../controllers/contactus.controllers.js";

const router = express.Router();

router.route("/").post(createContactUs);
router.route("/:id").get(getContactUsById).delete(deleteContactUs);
router.route("/getallContacts").get(getAllContactUs);
router.route("/groupbyuser").get(GroupContactUsByUser);
router.route("/deleteall").delete(deleteAllContactUs);

export default router;
