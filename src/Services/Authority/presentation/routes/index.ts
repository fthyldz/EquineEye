import { Router } from "express";
import authRouter from "./AuthRouter";

const router = Router();

router.use("/auth", authRouter);

export default router;
