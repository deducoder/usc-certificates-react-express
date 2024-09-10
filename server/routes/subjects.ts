import { Router } from "express";
import {
  deleteSubject,
  getSubject,
  getSubjects,
  postSubject,
  putSubject,
} from "../controllers/subjects";

const router = Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.post("/", postSubject);
router.put("/:id", putSubject);
router.delete("/:id", deleteSubject);

export default router;
