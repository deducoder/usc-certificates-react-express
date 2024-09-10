import { Router } from "express";
import {
  deleteCareer,
  getCareer,
  getCareers,
  postCareer,
  putCareer,
} from "../controllers/careers";

const router = Router();

router.get("/", getCareers);
router.get("/:id", getCareer);
router.post("/", postCareer);
router.put("/:id", putCareer);
router.delete("/:id", deleteCareer);

export default router;
