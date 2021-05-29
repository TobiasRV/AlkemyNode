const Joi = require('@hapi/joi');

const validate = (character) => {
  const characterSchema = Joi.object({
    image: Joi.string().uri().required(),
    name: Joi.string().required(),
    age: Joi.number().min(0).required(),
    weight: Joi.number().min(0).required(),
    story: Joi.string().required(),
    mediaUUID: Joi.string().guid({ version : 'uuidv4' })
  });
  const { error } = characterSchema.validate(character);
  if(error) {
    return {
      result: false,
      error: error
    }
  }else {
    return {
      result: true
    }
  }
}

module.exports = {
  validate
}
