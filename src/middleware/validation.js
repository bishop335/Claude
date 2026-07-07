import Joi from 'joi';
import { logger } from '../utils/logger.js';

export const skillSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  summary: Joi.string().min(10).max(500).required(),
  tags: Joi.array().items(Joi.string().min(2).max(20)).optional()
});

export function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      logger.warn('Validation error:', details);
      return res.status(400).json({ error: 'Validation failed', details });
    }

    req.validatedData = value;
    next();
  };
}
