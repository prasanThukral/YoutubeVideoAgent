import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    repeat_password: Joi.valid(Joi.ref('password')).required(),

    birth_year: Joi.number().integer().min(1900).max(2013).required(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }).required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})