"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCampaignCreation = exports.validateScreenCreation = exports.validateUserLogin = exports.validateUserRegistration = exports.handleValidationErrors = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (schema) => {
    return (req, res, next) => {
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
exports.handleValidationErrors = handleValidationErrors;
/**
 * User registration validation
 */
const userRegistrationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    name: joi_1.default.string().trim().min(2).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'any.required': 'Name is required'
    })
});
exports.validateUserRegistration = (0, exports.handleValidationErrors)(userRegistrationSchema);
/**
 * User login validation
 */
const userLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required'
    })
});
exports.validateUserLogin = (0, exports.handleValidationErrors)(userLoginSchema);
/**
 * Screen creation validation
 */
const screenCreationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).required().messages({
        'string.min': 'Screen name must be at least 2 characters long',
        'any.required': 'Screen name is required'
    }),
    location: joi_1.default.string().trim().min(5).required().messages({
        'string.min': 'Location must be at least 5 characters long',
        'any.required': 'Location is required'
    }),
    description: joi_1.default.string().trim().max(500).optional().messages({
        'string.max': 'Description must not exceed 500 characters'
    })
});
exports.validateScreenCreation = (0, exports.handleValidationErrors)(screenCreationSchema);
/**
 * Campaign creation validation
 */
const campaignCreationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).required().messages({
        'string.min': 'Campaign name must be at least 2 characters long',
        'any.required': 'Campaign name is required'
    }),
    description: joi_1.default.string().trim().max(1000).optional().messages({
        'string.max': 'Description must not exceed 1000 characters'
    }),
    budget: joi_1.default.number().positive().required().messages({
        'number.positive': 'Budget must be a positive number',
        'any.required': 'Budget is required'
    })
});
exports.validateCampaignCreation = (0, exports.handleValidationErrors)(campaignCreationSchema);
