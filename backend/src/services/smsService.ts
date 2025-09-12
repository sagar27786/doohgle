import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize SNS client
const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS using AWS SNS
 * @param phoneNumber - Phone number in E.164 format (e.g., +1234567890)
 * @param message - SMS message content
 * @returns Promise<SMSResult>
 */
export async function sendSMS(phoneNumber: string, message: string): Promise<SMSResult> {
  try {
    // Validate phone number format (basic validation)
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must be in E.164 format (starting with +)');
    }

    // Validate message length (SMS limit is 160 characters for single SMS)
    if (message.length > 160) {
      console.warn('SMS message exceeds 160 characters, may be sent as multiple messages');
    }

    const command = new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional', // Use 'Promotional' for marketing messages
        },
        'AWS.SNS.SMS.MaxPrice': {
          DataType: 'String',
          StringValue: '0.50', // Maximum price willing to pay per SMS in USD
        },
      },
    });

    const response = await snsClient.send(command);
    
    console.log(`SMS sent successfully to ${phoneNumber}. MessageId: ${response.MessageId}`);
    
    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Send OTP SMS to a phone number
 * @param phoneNumber - Phone number in E.164 format
 * @param otp - 6-digit OTP code
 * @returns Promise<SMSResult>
 */
export async function sendOTPSMS(phoneNumber: string, otp: string): Promise<SMSResult> {
  const message = `Your Doohgle verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
  
  return sendSMS(phoneNumber, message);
}

/**
 * Format phone number to E.164 format
 * @param phoneNumber - Phone number (can be in various formats)
 * @param countryCode - Default country code (e.g., '+91' for India)
 * @returns Formatted phone number in E.164 format
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string = '+91'): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If number doesn't start with country code, add it
  if (!phoneNumber.startsWith('+')) {
    // Remove leading 0 if present (common in many countries)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Add country code
    cleaned = countryCode + cleaned;
  } else {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate if phone number is in correct E.164 format
 * @param phoneNumber - Phone number to validate
 * @returns boolean
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // E.164 format: + followed by up to 15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

export default {
  sendSMS,
  sendOTPSMS,
  formatPhoneNumber,
  isValidPhoneNumber,
};