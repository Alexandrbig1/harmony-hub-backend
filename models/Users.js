// import { Schema, model } from "mongoose";
// import { handleSaveError, addUpdateSettings } from "./hooks.js";
// import emailRegex from "../regex/emailRegex.js";

// const userSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Set password for user"],
//     },
//     email: {
//       type: String,
//       match: emailRegex,
//       required: [true, "Email is required"],
//       unique: true,
//     },
//     token: {
//       type: String,
//     },
//   },
//   { versionKey: false, timestamps: true }
// );

// userSchema.post("save", handleSaveError);

// userSchema.pre("findOneAndUpdate", addUpdateSettings);

// userSchema.post("findOneAndUpdate", handleSaveError);

// const User = model("user", userSchema);

// export default User;


// models/Users.js
import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks.js";
import emailRegex from "../regex/emailRegex.js";

const ringtoneSchema = new Schema({
    caller: String,
    instrument: String,
    genre: String,
    popStar: String,
    vibe: String,
    audioUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "Set password for user"],
        },
        email: {
            type: String,
            match: emailRegex,
            required: [true, "Email is required"],
            unique: true,
        },
        token: {
            type: String,
        },
        ringtones: [ringtoneSchema]
    },
    { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", addUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;