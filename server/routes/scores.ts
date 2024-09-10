import { Router } from "express";
import {
  deleteScore,
  getScore,
  getScores,
  postScore,
  putScore,
} from "../controllers/scores";

const router = Router();

router.get("/", getScores);
router.get("/:id", getScore);
router.post("/", postScore);
router.put("/:id", putScore);
router.delete("/:id", deleteScore);

export default router;
