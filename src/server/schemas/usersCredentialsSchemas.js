const { Joi } = require("express-validation");

const credentialsLoginSchema = {
  body: Joi.object({
    username: Joi.string()
      .max(15)
      .message({ message: "Username is required" })
      .required(),
    password: Joi.string()
      .max(20)
      .message({ message: "Password is required" })
      .required(),
  }),
};

module.exports = { credentialsLoginSchema };
