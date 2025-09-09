"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsNotificationService = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const client_sns_1 = require("@aws-sdk/client-sns");
const aws_1 = require("../config/aws");
class AWSNotificationService {
    // Send email via AWS SES
    async sendEmail(emailData) {
        const params = {
            Source: process.env.EMAIL_USER || "noreply@doohgle.com",
            Destination: {
                ToAddresses: [emailData.to],
            },
            Message: {
                Subject: {
                    Data: emailData.subject,
                    Charset: "UTF-8",
                },
                Body: {
                    Html: {
                        Data: emailData.htmlContent,
                        Charset: "UTF-8",
                    },
                    Text: {
                        Data: emailData.textContent ||
                            emailData.htmlContent.replace(/<[^>]*>/g, ""),
                        Charset: "UTF-8",
                    },
                },
            },
        };
        try {
            const command = new client_ses_1.SendEmailCommand(params);
            await aws_1.sesClient.send(command);
            console.log("Email sent successfully via SES");
            return true;
        }
        catch (error) {
            console.error("Error sending email via SES:", error);
            return false;
        }
    }
    // Send SMS via AWS SNS
    async sendSMS(smsData) {
        const params = {
            PhoneNumber: smsData.phoneNumber,
            Message: smsData.message,
        };
        try {
            const command = new client_sns_1.PublishCommand(params);
            await aws_1.snsClient.send(command);
            console.log("SMS sent successfully via SNS");
            return true;
        }
        catch (error) {
            console.error("Error sending SMS via SNS:", error);
            return false;
        }
    }
    // Send booking notification to screen owner
    async sendBookingNotification(data) {
        const { bookingId, screenName, customerName, customerEmail, customerPhone, startDate, endDate, totalCost, urgency, ownerEmail, ownerPhone, } = data;
        // Create email content
        const emailHtml = this.generateBookingEmailTemplate(data);
        const emailSubject = `🚨 New Booking Request - ${screenName} (${urgency.toUpperCase()} Priority)`;
        // Send email notification
        const emailSent = await this.sendEmail({
            to: ownerEmail,
            subject: emailSubject,
            htmlContent: emailHtml,
        });
        // Send SMS notification if phone number is provided
        let smsSent = false;
        if (ownerPhone) {
            const smsMessage = `New ${urgency.toUpperCase()} priority booking request for ${screenName}. Customer: ${customerName}. Dates: ${startDate} to ${endDate}. Amount: $${totalCost}. Check your email for details and approval link. Booking ID: ${bookingId}`;
            smsSent = await this.sendSMS({
                phoneNumber: ownerPhone,
                message: smsMessage,
            });
        }
        return { emailSent, smsSent };
    }
    // Send booking confirmation to customer
    async sendBookingConfirmation(data, approved) {
        const subject = approved
            ? `✅ Booking Confirmed - ${data.screenName}`
            : `❌ Booking Declined - ${data.screenName}`;
        const emailHtml = this.generateCustomerConfirmationTemplate(data, approved);
        return this.sendEmail({
            to: data.customerEmail,
            subject,
            htmlContent: emailHtml,
        });
    }
    // Generate booking email template
    generateBookingEmailTemplate(data) {
        const { bookingId, screenName, customerName, customerEmail, customerPhone, startDate, endDate, totalCost, urgency, } = data;
        const urgencyColors = {
            low: "#28a745",
            medium: "#ffc107",
            high: "#dc3545",
        };
        const urgencyColor = urgencyColors[urgency];
        return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Booking Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📺 New Booking Request</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Doohgle Digital Advertising Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="background: ${urgencyColor}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${urgency} Priority</span>
            </div>
            <h2 style="color: #333; margin: 0 0 10px 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #333;">${bookingId}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Screen:</td>
                    <td style="padding: 8px 0; color: #333;">${screenName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Duration:</td>
                    <td style="padding: 8px 0; color: #333;">${startDate} to ${endDate}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Total Cost:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 18px;">$${totalCost}</td>
                </tr>
            </table>
        </div>

        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">👤 Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
                    <td style="padding: 8px 0; color: #333;">${customerName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 8px 0; color: #333;">${customerEmail}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                    <td style="padding: 8px 0; color: #333;">${customerPhone}</td>
                </tr>
            </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://doohgle.com/bookings/approve/${bookingId}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">✅ APPROVE BOOKING</a>
            <a href="https://doohgle.com/bookings/decline/${bookingId}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">❌ DECLINE BOOKING</a>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">This booking request requires your approval. Please respond within 24 hours.</p>
            <p style="margin: 5px 0 0 0;">© 2025 Doohgle - Digital Advertising Platform</p>
        </div>
    </body>
    </html>
    `;
    }
    // Generate customer confirmation template
    generateCustomerConfirmationTemplate(data, approved) {
        const status = approved ? "confirmed" : "declined";
        const statusIcon = approved ? "✅" : "❌";
        const statusColor = approved ? "#28a745" : "#dc3545";
        return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Booking ${approved ? "Confirmation" : "Declined"}</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${statusIcon} Booking ${approved ? "Confirmed" : "Declined"}</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Doohgle Digital Advertising Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: ${statusColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 16px; font-weight: bold; text-transform: uppercase;">${status}</span>
            </div>
            
            <h2 style="color: #333; margin: 0 0 15px 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #333;">${data.bookingId}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Screen:</td>
                    <td style="padding: 8px 0; color: #333;">${data.screenName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Duration:</td>
                    <td style="padding: 8px 0; color: #333;">${data.startDate} to ${data.endDate}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Total Cost:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 18px;">$${data.totalCost}</td>
                </tr>
            </table>
        </div>

        ${approved
            ? `
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #155724; margin: 0 0 15px 0;">🎉 What's Next?</h3>
            <p style="color: #155724; margin: 0 0 10px 0;">Your booking has been approved! Please proceed with payment to secure your advertising slot.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://doohgle.com/payment/${data.bookingId}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">💳 COMPLETE PAYMENT</a>
            </div>
        </div>
        `
            : `
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #721c24; margin: 0 0 15px 0;">😔 Booking Declined</h3>
            <p style="color: #721c24; margin: 0;">Unfortunately, the screen owner has declined your booking request. This could be due to scheduling conflicts or other reasons. Please try booking alternative screens or different dates.</p>
        </div>
        `}

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">Thank you for choosing Doohgle for your digital advertising needs.</p>
            <p style="margin: 5px 0 0 0;">© 2025 Doohgle - Digital Advertising Platform</p>
        </div>
    </body>
    </html>
    `;
    }
}
exports.awsNotificationService = new AWSNotificationService();
