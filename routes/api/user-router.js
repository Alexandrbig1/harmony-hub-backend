import express from "express";
import { authenticate } from "../../middleware/index.js";
import userController from "../../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/current", authenticate, userController.getCurrent);

export default userRouter;
