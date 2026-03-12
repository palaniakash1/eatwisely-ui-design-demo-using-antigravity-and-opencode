import Joi from 'joi';
import { errorHandler } from '../utils/error.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(errorHandler(400, 'Validation failed', errors));
    }

    req[source] = value;
    next();
  };
};
