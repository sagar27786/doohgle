import { Request, Response } from "express";
import { AuthUser } from "../middleware/auth";
export declare function checkScreenAvailability(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createBooking(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMyBookings(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function cancelBooking(req: Request & {
    user?: AuthUser;
}, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function sendBookingRequest(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMyBookingRequests(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getAvailableCities(req: Request, res: Response): Promise<void>;
export declare function getBookedTimeSlots(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getBookingRequestsForOwner(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
