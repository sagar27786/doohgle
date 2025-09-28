const {
  sendOTP,
  formatIndianPhoneNumber,
} = require("./dist/services/otpService");

async function testOTP() {
  console.log("🧪 Testing OTP SMS functionality...\n");

  // Test phone number formatting
  const testPhones = [
    "9876543210",
    "+919876543210",
    "919876543210",
    "+1234567890",
  ];

  console.log("📱 Testing phone number formatting:");
  testPhones.forEach((phone) => {
    const formatted = formatIndianPhoneNumber(phone);
    console.log(`${phone} -> ${formatted || "INVALID"}`);
  });

  console.log("\n🔍 Environment check:");
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
    console.log("\n❌ AWS credentials not configured!");
    console.log("Please set the following environment variables:");
    console.log("- AWS_ACCESS_KEY_ID");
    console.log("- AWS_SECRET_ACCESS_KEY");
    console.log("- AWS_REGION (optional, defaults to us-east-1)");
    return;
  }

  // Test OTP sending (replace with your actual phone number)
  const testPhone = process.env.TEST_PHONE || "9876543210";
  const testOTP = "123456";

  console.log(`\n📱 Testing OTP send to ${testPhone}...`);
  const result = await sendOTP(testPhone, testOTP);

  if (result) {
    console.log("✅ OTP test completed successfully!");
  } else {
    console.log("❌ OTP test failed. Check the logs above for details.");
  }
}

testOTP().catch(console.error);
