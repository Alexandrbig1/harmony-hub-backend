import express from "express";
import {
  userSignInSchema,
  userSignUpSchema,
} from "../../schemas/auth-schema.js";
import { authenticate, isEmptyBody } from "../../middleware/index.js";
import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  isEmptyBody,
  validateBody(userSignUpSchema),
  authController.signUp
);

authRouter.post(
  "/signin",
  isEmptyBody,
  validateBody(userSignInSchema),
  authController.signIn
);

authRouter.post("/logout", authenticate, authController.logOut);

// authRouter.get("/current", authenticate, authController.getCurrent);

export default authRouter;
