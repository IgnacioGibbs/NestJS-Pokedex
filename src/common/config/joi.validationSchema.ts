import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(3000).required(),
  MONGODB_URL: Joi.string().required(),
  QUERY_LIMIT_DEFAULT: Joi.number().default(10).required(),
  QUERY_SKIP_DEFAULT: Joi.number().default(0).required(),
});
