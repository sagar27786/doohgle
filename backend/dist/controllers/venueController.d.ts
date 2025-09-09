import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../middleware/auth';
export declare const isVenueOwner: (req: Request & {
    user?: AuthUser;
}, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function addScreenAsset(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function setScreenPricing(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
import { S3Client } from '@aws-sdk/client-s3';
declare const s3Client: S3Client;
export { s3Client };
export declare function getVenueBookingRequests(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<void>;
export declare function getVenueBookings(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<void>;
export declare function updateBookingRequestStatus(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateBookingStatus(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function addProofOfPlay(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
