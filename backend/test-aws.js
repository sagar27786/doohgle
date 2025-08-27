const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

console.log("Testing AWS S3 Connection...");
console.log("Region:", process.env.AWS_REGION);
console.log("Bucket:", process.env.S3_BUCKET_NAME);

s3.listBuckets((err, data) => {
  if (err) {
    console.log("❌ AWS Connection Error:", err.message);
    process.exit(1);
  } else {
    console.log("✅ AWS Connected Successfully!");
    console.log(
      "Available buckets:",
      data.Buckets.map((b) => b.Name)
    );

    // Test specific bucket access
    s3.headBucket({ Bucket: process.env.S3_BUCKET_NAME }, (bucketErr) => {
      if (bucketErr) {
        console.log("❌ Bucket access error:", bucketErr.message);
      } else {
        console.log(
          "✅ Bucket access confirmed for:",
          process.env.S3_BUCKET_NAME
        );
      }
      process.exit(0);
    });
  }
});
