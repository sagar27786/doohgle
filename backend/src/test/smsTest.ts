/**
 * SMS Service Test Script
 * 
 * This script tests the AWS SNS SMS functionality.
 * Run with: npx tsx src/test/smsTest.ts
 */

import dotenv from 'dotenv';
import { sendOTPSMS, formatPhoneNumber, isValidPhoneNumber } from '../services/smsService';

// Load environment variables
dotenv.config();

async function testSMSService() {
  console.log('🧪 Testing SMS Service...');
  console.log('========================');
  
  // Test phone number formatting
  console.log('\n📱 Testing phone number formatting:');
  const testNumbers = [
    '9876543210',      // Indian number without country code
    '+919876543210',   // Indian number with country code
    '1234567890',      // US number without country code
    '+11234567890',    // US number with country code
  ];
  
  testNumbers.forEach(number => {
    const formatted = formatPhoneNumber(number, '+91');
    const isValid = isValidPhoneNumber(formatted);
    console.log(`  ${number} -> ${formatted} (Valid: ${isValid})`);
  });
  
  // Test OTP SMS sending (only if SMS is enabled)
  const smsEnabled = process.env.SMS_ENABLED !== 'false';
  
  if (!smsEnabled) {
    console.log('\n⚠️  SMS is disabled in environment. Set SMS_ENABLED=true to test actual SMS sending.');
    return;
  }
  
  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log('\n❌ AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.');
    return;
  }
  
  console.log('\n📤 Testing OTP SMS sending:');
  console.log('Note: This will send an actual SMS if AWS SNS is properly configured.');
  
  // Use a test phone number (replace with your own for testing)
  const testPhoneNumber = process.env.TEST_PHONE_NUMBER;
  
  if (!testPhoneNumber) {
    console.log('\n⚠️  No test phone number provided. Set TEST_PHONE_NUMBER in .env to test SMS sending.');
    console.log('   Example: TEST_PHONE_NUMBER=+919876543210');
    return;
  }
  
  try {
    const testOTP = '123456';
    console.log(`  Sending OTP ${testOTP} to ${testPhoneNumber}...`);
    
    const result = await sendOTPSMS(testPhoneNumber, testOTP);
    
    if (result.success) {
      console.log(`  ✅ SMS sent successfully! MessageId: ${result.messageId}`);
    } else {
      console.log(`  ❌ SMS sending failed: ${result.error}`);
    }
  } catch (error) {
    console.error('  ❌ Error during SMS test:', error);
  }
  
  console.log('\n🏁 SMS Service test completed.');
}

// Run the test
if (require.main === module) {
  testSMSService().catch(console.error);
}

export default testSMSService;