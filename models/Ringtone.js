// models/Ringtone.js
import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks.js";

const ringtoneSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        caller: {
            type: String,
            required: true,
        },
        instrument: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        popStar: {
            type: String,
            required: true,
        },
        vibe: {
            type: String,
            required: true,
        },
        generatedUrl: {
            type: String,
            required: true,
        }
    },
    { versionKey: false, timestamps: true }
);

ringtoneSchema.post("save", handleSaveError);
ringtoneSchema.pre("findOneAndUpdate", addUpdateSettings);
ringtoneSchema.post("findOneAndUpdate", handleSaveError);

const Ringtone = model("ringtone", ringtoneSchema);

export default Ringtone;