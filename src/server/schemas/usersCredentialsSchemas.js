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

const credentialsRegisterSchema = {
  body: Joi.object({
    username: Joi.string()
      .max(15)
      .message({ message: "Username is required" })
      .required(),
    email: Joi.string().max(30).message({ message: "email is required" }),
    password: Joi.string()
      .max(20)
      .message({ message: "Password is required" })
      .required(),
    location: Joi.string().required(),
    image: Joi.string().allow(null, ""),
  }),
};

module.exports = { credentialsLoginSchema, credentialsRegisterSchema };
