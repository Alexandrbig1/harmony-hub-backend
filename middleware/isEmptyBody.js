import HttpError from "../helpers/HttpError.js";

export default function isEmptyBody(req, res, next) {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "Body must have fields"));
  }
  next();
}
