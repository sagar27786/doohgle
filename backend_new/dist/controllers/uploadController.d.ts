import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
interface MulterRequest extends AuthenticatedRequest {
    files?: any;
    file?: any;
}
/**
 * Upload single media file (image or video) to S3
 */
export declare const uploadSingleMedia: (req: MulterRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Upload multiple media files for screen registration
 */
export declare const uploadScreenMedia: (req: MulterRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete media file from S3
 */
export declare const deleteMedia: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
