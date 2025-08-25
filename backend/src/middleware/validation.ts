import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

/**
 * User registration validation
 */
const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  name: Joi.string().trim().min(2).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required'
  })
});

export const validateUserRegistration = handleValidationErrors(userRegistrationSchema);

/**
 * User login validation
 */
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const validateUserLogin = handleValidationErrors(userLoginSchema);

/**
 * Screen creation validation
 */
const screenCreationSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.min': 'Screen name must be at least 2 characters long',
    'any.required': 'Screen name is required'
  }),
  location: Joi.string().trim().min(5).required().messages({
    'string.min': 'Location must be at least 5 characters long',
    'any.required': 'Location is required'
  }),
  description: Joi.string().trim().max(500).optional().messages({
    'string.max': 'Description must not exceed 500 characters'
  })
});

export const validateScreenCreation = handleValidationErrors(screenCreationSchema);

/**
 * Campaign creation validation
 */
const campaignCreationSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.min': 'Campaign name must be at least 2 characters long',
    'any.required': 'Campaign name is required'
  }),
  description: Joi.string().trim().max(1000).optional().messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  budget: Joi.number().positive().required().messages({
    'number.positive': 'Budget must be a positive number',
    'any.required': 'Budget is required'
  })
});

export const validateCampaignCreation = handleValidationErrors(campaignCreationSchema);