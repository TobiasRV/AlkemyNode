const Joi = require('@hapi/joi');

const validate = (user) => {
  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const { error } = userSchema.validate(user);
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
