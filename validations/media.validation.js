const Joi = require('@hapi/joi');

const validate = (media) => {
  const mediaSchema = Joi.object({
    image: Joi.string().uri().required(),
    title: Joi.string().required(),
    creationDate: Joi.date().iso().required(),
    score: Joi.number().min(0).max(5).required(),
    genreUUID: Joi.array().required().items(Joi.string.guid({ version : 'uuidv4' })),
  });
  const { error } = mediaSchema.validate(media);
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
