import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../config/aws";

// Phone number validation regex for E.164 format
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

/**
 * Validates if phone number is in E.164 format
 * @param phoneNumber - Phone number to validate
 * @returns boolean indicating if format is valid
 */
function validatePhoneNumber(phoneNumber: string): boolean {
  return E164_REGEX.test(phoneNumber);
}

/**
 * Formats phone number to E.164 format if it's an Indian number
 * @param phoneNumber - Input phone number
 * @returns formatted phone number or null if invalid
 */
function formatIndianPhoneNumber(phoneNumber: string): string | null {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Handle Indian numbers (10 digits starting with 6-9)
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // Handle numbers already with country code
  if (
    cleaned.length === 12 &&
    cleaned.startsWith("91") &&
    /^91[6-9]/.test(cleaned)
  ) {
    return `+${cleaned}`;
  }

  // Return as-is if already in correct format
  if (validatePhoneNumber(phoneNumber)) {
    return phoneNumber;
  }

  return null;
}

/**
 * Send OTP via AWS SNS
 * @param phoneNumber - Phone number in E.164 format
 * @param otp - OTP code to send
 * @returns Promise<boolean> indicating success/failure
 */
async function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    // Check AWS configuration first
    console.log("🔍 Checking AWS configuration...");
    console.log("AWS_REGION:", process.env.AWS_REGION || "us-east-1");
    console.log(
      "AWS_ACCESS_KEY_ID:",
      process.env.AWS_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing"
    );
    console.log(
      "AWS_SECRET_ACCESS_KEY:",
      process.env.AWS_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing"
    );

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error(
        "❌ AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
      );
      return false;
    }

    // Format phone number
    const formattedPhone = formatIndianPhoneNumber(phoneNumber);

    if (!formattedPhone) {
      console.error(`❌ Invalid phone number format: ${phoneNumber}`);
      return false;
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      console.error(`❌ Invalid OTP format: ${otp}`);
      return false;
    }

    console.log(`📱 Formatted phone number: ${formattedPhone}`);
    console.log(`🔢 OTP to send: ${otp}`);

    const params = {
      Message: `Your Doohgle verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`,
      PhoneNumber: formattedPhone,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "DOOHGLE",
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    };

    console.log(`📱 Attempting to send OTP to ${formattedPhone}`);
    console.log("📋 SNS Parameters:", JSON.stringify(params, null, 2));

    const command = new PublishCommand(params);
    console.log("🚀 Sending SNS command...");

    const response = await snsClient.send(command);

    console.log("📨 SNS Response:", JSON.stringify(response, null, 2));

    if (response.MessageId) {
      console.log(
        `✅ OTP sent successfully to ${formattedPhone}. MessageId: ${response.MessageId}`
      );
      return true;
    } else {
      console.error(`❌ Failed to send OTP: No MessageId received`);
      return false;
    }
  } catch (error: any) {
    console.error("❌ Error sending OTP via SNS:", {
      message: error.message,
      code: error.code || error.name,
      phoneNumber: phoneNumber,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    });

    // Log specific AWS SNS errors
    if (error.code === "InvalidParameter") {
      console.error(
        "💡 Hint: Check if phone number is in correct E.164 format"
      );
    } else if (error.code === "AuthorizationError") {
      console.error("💡 Hint: Check AWS credentials and SNS permissions");
    } else if (error.code === "Throttling") {
      console.error(
        "💡 Hint: Rate limit exceeded, implement exponential backoff"
      );
    } else if (error.code === "OptedOut") {
      console.error("💡 Hint: Phone number has opted out of SMS");
    } else if (error.code === "InvalidParameterValue") {
      console.error(
        "💡 Hint: Invalid parameter value - check phone number format"
      );
    }

    return false;
  }
}

export { sendOTP, validatePhoneNumber, formatIndianPhoneNumber };
