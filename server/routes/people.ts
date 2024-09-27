import { Router } from "express";
import {
  deletePerson,
  getPeople,
  getPerson,
  postPerson,
  putPerson,
} from "../controllers/people";

const router = Router();

router.get("/", getPeople);
router.get("/:id", getPerson);
router.post("/", postPerson);
router.put("/:id", putPerson);
router.delete("/:id", deletePerson);

export default router;
