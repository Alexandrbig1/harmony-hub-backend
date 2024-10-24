import { ctrlWrapper } from "../decorators/index.js";
import "dotenv/config";

const getCurrent = async (req, res) => {
  const { _id: id, name, email } = req.user;

  res.json({ id, name, email });
};

export default {
  getCurrent: ctrlWrapper(getCurrent),
};
