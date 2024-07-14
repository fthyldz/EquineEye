import { Router } from "express";
import Container from "typedi";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/login", async (req, res, next) => await Container.get(AuthController).login(req, res, next));
router.post("/refreshToken", async (req, res, next) => await Container.get(AuthController).refreshToken(req, res, next));

export default router;
