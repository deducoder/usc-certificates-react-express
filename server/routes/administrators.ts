import { Router } from "express";
import {
  deleteAdmin,
  getAdmin,
  getAdmins,
  postAdmin,
  putAdmin,
} from "../controllers/administrators";

const router = Router();

router.get("/", getAdmins);
router.get("/:id", getAdmin);
router.post("/", postAdmin);
router.put("/:id", putAdmin);
router.delete("/:id", deleteAdmin);

export default router;
