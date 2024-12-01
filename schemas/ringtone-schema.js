// schemas/ringtone-schema.js
import Joi from "joi";

export const ringtoneGenerationSchema = Joi.object({
    caller: Joi.string().required().messages({
        "string.empty": "Caller name is required",
        "any.required": "Caller name is required",
    }),
    instrument: Joi.string().required().messages({
        "string.empty": "Instrument is required",
        "any.required": "Instrument is required",
    }),
    genre: Joi.string().required().messages({
        "string.empty": "Genre is required",
        "any.required": "Genre is required",
    }),
    popStar: Joi.string().required().messages({
        "string.empty": "Pop star name is required",
        "any.required": "Pop star name is required",
    }),
    vibe: Joi.string().required().messages({
        "string.empty": "Vibe description is required",
        "any.required": "Vibe description is required",
    })
});