const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

// Create a simple test image buffer (1x1 PNG)
const createTestImage = () => {
  // Minimal 1x1 PNG file as buffer
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
};

async function testImageUpload() {
  try {
    console.log("🔍 Testing image upload to S3 via API...");

    const form = new FormData();
    const imageBuffer = createTestImage();

    // Add the image as a file
    form.append("images", imageBuffer, {
      filename: "test-image.png",
      contentType: "image/png",
    });

    const response = await fetch(
      "http://localhost:4000/api/upload-images/test-screen",
      {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Upload successful!");
      console.log("📤 Response:", JSON.stringify(result, null, 2));

      if (
        result.data &&
        result.data.imageUrls &&
        result.data.imageUrls.length > 0
      ) {
        console.log("🔗 First image URL:", result.data.imageUrls[0]);

        // Test if the signed URL works
        console.log("🔍 Testing signed URL access...");
        const imageResponse = await fetch(result.data.imageUrls[0]);
        if (imageResponse.ok) {
          console.log("✅ Signed URL works! Image is accessible");
          console.log(
            "📊 Image size:",
            imageResponse.headers.get("content-length"),
            "bytes"
          );
        } else {
          console.log("❌ Signed URL failed:", imageResponse.status);
        }
      }
    } else {
      console.log("❌ Upload failed:", result);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testImageUpload();
