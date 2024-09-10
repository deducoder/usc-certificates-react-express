import { Router } from "express";
import {
  deleteStudentCareer,
  getStudentCareer,
  getStudentsCareers,
  postStudentCareer,
  putStudentCareer,
} from "../controllers/students-careers";

const router = Router();

router.get("/", getStudentsCareers);
router.get("/:id", getStudentCareer);
router.post("/", postStudentCareer);
router.put("/:id", putStudentCareer);
router.delete("/:id", deleteStudentCareer);

export default router;
