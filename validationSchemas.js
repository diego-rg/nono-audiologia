const Joi = require("joi");//Schema para a validación con Joi. Para avitar problemas usar TODOS os campos do schema, anque sea con Joi.any();

const joiSoundSchema = Joi.object({
    sound: Joi.object({
        name: Joi.string().required(),
        minFrec: Joi.number().required().min(0),
        maxFrec: Joi.number().required().min(0),
        minInt: Joi.number().required().min(0),
        maxInt: Joi.number().required().min(0),
        category: Joi.string().valid("Hogar", "Naturaleza", "Conversación", "Ocio", "Lugares", "Ciudad"),
        audio: Joi.any(),
        image: Joi.any()
    }).required()
});

module.exports = joiSoundSchema;