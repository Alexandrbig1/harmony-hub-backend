import { Schema, model } from "mongoose";
import handleSaveError from "../hooks/handleSaveError.js";

const sessionSchema = new Schema(
  {
    uid: Schema.Types.ObjectId,
  },
  { versionKey: false }
);

sessionSchema.post("save", handleSaveError);

const Session = model("session", sessionSchema);

export default Session;
