import { Router } from "express";
import userInfoRoutes from "./UserInfoRouter";

const router = Router();

router.use("/user-info", userInfoRoutes);

export default router;
