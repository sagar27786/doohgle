import { Request, Response } from "express";
import { AuthUser } from "../middleware/auth";
export declare function createCampaignRequest(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMyRequests(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getIncomingRequests(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function approveCampaignRequest(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function rejectCampaignRequest(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getNotifications(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function markNotificationRead(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getCampaignRequest(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
