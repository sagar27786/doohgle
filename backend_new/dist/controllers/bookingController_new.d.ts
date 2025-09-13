import { Request, Response } from "express";
import { AuthUser } from "../middleware/auth";
interface BookingRequest extends Request {
    body: {
        screenId: number;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        companyName?: string;
        startDate: string;
        endDate: string;
        urgency: "low" | "medium" | "high";
        message?: string;
        screen_id: number;
        start_date: string;
        end_date: string;
        campaign_id?: number;
        total_amount: number;
        booking_hours: number[];
        content_url?: string;
        notes?: string;
    };
}
export declare function createBooking(req: BookingRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getOwnerBookingRequests(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function processBookingApproval(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getAdsManagerNotifications(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function markNotificationAsRead(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createBookingWithAuth(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function checkScreenAvailability(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMyBookings(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function cancelBooking(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export {};
