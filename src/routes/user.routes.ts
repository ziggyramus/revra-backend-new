import { Router } from "express";
import {
  create,
  getUsers,
  getById,
  update,
  remove,
} from "../controllers/user.controller";

const router = Router();

router.post("/", create);
router.get("/", getUsers);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;