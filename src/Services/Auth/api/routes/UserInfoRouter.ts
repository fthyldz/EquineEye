import { Router } from "express";
import Container from "typedi";
import { UserInfoController } from "../controllers/UserInfoController";

const router = Router();

router.use("/", async (req, res, next) => await Container.get(UserInfoController).getUserInfo(req, res, next));

export default router;
