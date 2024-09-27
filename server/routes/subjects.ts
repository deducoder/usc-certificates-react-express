import { Router } from "express";
import {
  deleteSubject,
  getSubject,
  getSubjects,
  postSubject,
  putSubject,
  getSubjectsByCareerId,
} from "../controllers/subjects";

const router = Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.post("/", postSubject);
router.put("/:id", putSubject);
router.delete("/:id", deleteSubject);
router.get("/career/:careerId", getSubjectsByCareerId);

export default router;
