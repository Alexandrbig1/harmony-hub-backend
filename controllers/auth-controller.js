import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import Session from "../models/sessionSchema.js";

const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(
      409,
      "Email In Use: The provided email address is already associated with an existing account. If you already have an account, please log in."
    );
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  const newSession = await Session.create({
    uid: newUser._id,
  });

  const payload = {
    id: newUser._id,
    sid: newSession._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  res.status(201).json({
    message:
      "Congratulations! Your registration was successful. You can now sign in with your new account.",
    user: {
      name: newUser.name,
      email: newUser.email,
      token: token,
      refreshToken: refreshToken,
    },
  });
};

const signIn = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(
      401,
      "Authentication Failed: Incorrect login or password. Please double-check your credentials and try again."
    );
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(
      401,
      "Authentication Failed: Incorrect login or password. Please double-check your credentials and try again"
    );
  }

  const { _id: id } = user;

  const newSession = await Session.create({
    uid: id,
  });

  const payload = {
    id,
    sid: newSession._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    message: "Successful operation",
    token,
    refreshToken,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout Successful: You have been successfully logged out.",
  });
};

// const getCurrent = async (req, res) => {
//   const { email } = req.user;
//   res.json({ email });
// };

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  // getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut),
};
