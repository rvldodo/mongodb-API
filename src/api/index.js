import { Router } from "express";

import Accounts from "./accounts/accounts.router.js";

const router = Router();

router.use("/accounts", Accounts);

export default router;
