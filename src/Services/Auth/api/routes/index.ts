import { Router } from "express";
import authRouter from "./AuthRouter";
import userInfoRoutes from "./UserInfoRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/user-info", userInfoRoutes);

export default router;
