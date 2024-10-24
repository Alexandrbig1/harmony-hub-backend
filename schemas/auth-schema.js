import Joi from "joi";

export const userSignUpSchema = Joi.object({
  name: Joi.string().trim().min(2).max(20).required().messages({
    "string.empty": "Name must not be empty",
    "any.required": "Name is required",
    "string.min": "Name should have at least {#limit} characters",
    "string.max": "Name should not exceed {#limit} characters",
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least {#limit} characters long",
    "string.max": "Password cannot be longer than {#limit} characters",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Enter a valid email address",
    }),
});

export const userSignInSchema = Joi.object({
  password: Joi.string().min(6).max(20).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least {#limit} characters long",
    "string.max": "Password cannot be longer than {#limit} characters",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Enter a valid email address",
    }),
});
