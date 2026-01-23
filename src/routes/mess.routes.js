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
  .get(auth, authorizeRoles("ADMIN", "OWNER"), getallMesses)
  .post(
    auth,
    authorizeRoles("ADMIN", "OWNER"),
    validate(MessSchema),
    createMess,
  );

router
  .route("/:messId")
  .get(auth, authorizeRoles("ADMIN", "OWNER"), getMess)
  .put(
    auth,
    authorizeRoles("ADMIN", "OWNER"),
    validate(UpdateMessSchema),
    updateMess,
  )
  .delete(auth, authorizeRoles("ADMIN", "OWNER"), deleteMess);
  
export default router;
