import express from "express";
import validate from "../middleware/validator.middelware.js";
import auth from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  MessSchema,
  UpdateMessSchema,
} from "../validators/profile.validators.js";
import {
  getMess,
  createMess,
  updateMess,
  deleteMess,
  getallMesses,
} from "../controllers/mess.controller.js";

const router = express.Router();
router
  .route("/")
  .get(auth, authorizeRoles("OWNER"), getallMesses)
  .post(
    auth,
    authorizeRoles("OWNER"),
    validate(MessSchema),
    createMess,
  );

router
  .route("/:messId")
  .get(auth, authorizeRoles("OWNER"), getMess)
  .put(
    auth,
    authorizeRoles("OWNER"),
    validate(UpdateMessSchema),
    updateMess,
  )
  .delete(auth, authorizeRoles("OWNER"), deleteMess);
  
export default router;
