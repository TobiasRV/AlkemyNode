const Joi = require('@hapi/joi');

const validate = (genre) => {
  const genreSchema = Joi.object({
    image: Joi.string().uri().required(),
    name: Joi.string().required()
  });
  const { error } = genreSchema.validate(genre);
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
