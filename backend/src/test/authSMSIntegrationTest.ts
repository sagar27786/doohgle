/**
 * Auth SMS Integration Test
 *
 * This script tests the complete OTP flow with SMS integration.
 * Run with: npx tsx src/test/authSMSIntegrationTest.ts
 */

import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api";

async function testAuthSMSIntegration() {
  console.log("🔐 Testing Auth SMS Integration...");
  console.log("===================================");

  // Test data
  const testPhone = "+919876543210"; // Use a test phone number

  try {
    console.log("\n📤 Step 1: Testing OTP sending...");

    const otpResponse = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
      phone: testPhone,
    });

    console.log("✅ OTP Request Response:");
    console.log("  Status:", otpResponse.status);
    console.log("  Message:", otpResponse.data.message);

    if (otpResponse.data.messageId) {
      console.log("  MessageId:", otpResponse.data.messageId);
    }

    if (otpResponse.data.warning) {
      console.log("  Warning:", otpResponse.data.warning);
    }

    console.log("\n📝 Step 2: Testing phone number validation...");

    // Test invalid phone number
    try {
      await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phone: "invalid-phone",
      });
    } catch (error: any) {
      if (error.response) {
        console.log("✅ Invalid phone validation working:");
        console.log("  Status:", error.response.status);
        console.log("  Message:", error.response.data.message);
      }
    }

    console.log("\n📱 Step 3: Testing different phone formats...");

    const phoneFormats = [
      "9876543210", // Without country code
      "+919876543210", // With country code
      "09876543210", // With leading zero
    ];

    for (const phone of phoneFormats) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
          phone: phone,
        });
        console.log(`  ✅ ${phone} -> Status: ${response.status}`);
      } catch (error: any) {
        if (error.response) {
          console.log(`  ❌ ${phone} -> Error: ${error.response.data.message}`);
        } else {
          console.log(`  ❌ ${phone} -> Network Error`);
        }
      }
    }
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Backend server is not running.");
      console.log("   Please start the server with: npm run dev");
    } else if (error.response) {
      console.log("❌ API Error:");
      console.log("  Status:", error.response.status);
      console.log(
        "  Message:",
        error.response.data.message || error.response.data
      );
    } else {
      console.log("❌ Unexpected error:", error.message);
    }
  }

  console.log("\n🏁 Auth SMS Integration test completed.");
  console.log("\n💡 Notes:");
  console.log("  - If SMS_ENABLED=false, OTPs will be logged to console");
  console.log(
    "  - If AWS credentials are not configured, fallback mode is used"
  );
  console.log("  - Check backend logs for detailed SMS delivery information");
}

// Run the test
if (require.main === module) {
  testAuthSMSIntegration().catch(console.error);
}

export default testAuthSMSIntegration;
