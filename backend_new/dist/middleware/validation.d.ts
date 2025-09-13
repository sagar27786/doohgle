import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
/**
 * Middleware to handle validation errors
 */
export declare const handleValidationErrors: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateUserRegistration: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateUserLogin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateScreenCreation: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateCampaignCreation: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
