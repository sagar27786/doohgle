export interface EmailData {
    to: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
}
export interface SMSData {
    phoneNumber: string;
    message: string;
}
export interface BookingNotificationData {
    bookingId: string;
    screenName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    urgency: "low" | "medium" | "high";
    ownerEmail: string;
    ownerPhone?: string;
}
declare class AWSNotificationService {
    sendEmail(emailData: EmailData): Promise<boolean>;
    sendSMS(smsData: SMSData): Promise<boolean>;
    sendBookingNotification(data: BookingNotificationData): Promise<{
        emailSent: boolean;
        smsSent: boolean;
    }>;
    sendBookingConfirmation(data: BookingNotificationData, approved: boolean): Promise<boolean>;
    private generateBookingEmailTemplate;
    private generateCustomerConfirmationTemplate;
}
export declare const awsNotificationService: AWSNotificationService;
export {};
