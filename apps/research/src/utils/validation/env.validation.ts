import * as Joi from 'joi';

/**
 * @description The schema of the environment variables that are needed by the Nest.js
 */
type EnvValidationSchema = {
  NODE_ENV: 'development' | 'production' | 'test' | 'local';
  RESEARCH_PORT: number;
  DATABASE_URI: string;
  JUPYTERHUB_DOMAIN: string;
};

export const envValidation = Joi.object<EnvValidationSchema>({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'local').default('local'),
  RESEARCH_PORT: Joi.number().default(4000),
  DATABASE_URI: Joi.string().uri().required(),
  JUPYTERHUB_DOMAIN: Joi.string().uri().required()
});
