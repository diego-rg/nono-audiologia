const baseJoi = require("joi");//Schema para a validación con Joi. Para avitar problemas usar TODOS os campos do schema, anque sea con Joi.any();
const sanitizeHtml = require("sanitize-html");//Para evitar XXS xunto con joi
//XSS: cross site scripting: intectar scripts do lado do cilente nunha web para a acceder a datos coma cookies

//Modificación de joi xunto con sanitize-html para usalos como para evitar xss
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} no puede incluir HTML o scripts!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension)

const joiSoundSchema = Joi.object({
    sound: Joi.object({
        name: Joi.string().required().escapeHTML(),
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