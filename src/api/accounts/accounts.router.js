import { Router } from "express";
import controller from "./accounts.controller.js";
const router = Router();

router.post("/", controller.createAccount);
router.get("/", controller.getAccount);

export default router;
