# AWS SNS SMS Setup Guide

This guide explains how to set up AWS Simple Notification Service (SNS) for sending OTP messages via SMS in the Doohgle application.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (optional but recommended)
- Node.js backend with AWS SDK installed

## Step 1: AWS SNS Configuration

### 1.1 Create IAM User for SNS

1. Go to AWS IAM Console
2. Create a new user for programmatic access
3. Attach the following policy (or create a custom policy):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish",
                "sns:GetSMSAttributes",
                "sns:SetSMSAttributes"
            ],
            "Resource": "*"
        }
    ]
}
```

4. Save the Access Key ID and Secret Access Key

### 1.2 Configure SMS Settings in SNS

1. Go to AWS SNS Console
2. Navigate to "Text messaging (SMS)" in the left sidebar
3. Configure the following settings:
   - **Default message type**: Transactional (for OTP messages)
   - **Account spending limit**: Set according to your needs
   - **Default sender ID**: Your app name (if supported in your region)
   - **Monthly spending limit**: Set a reasonable limit

### 1.3 Request SMS Sandbox Exit (if needed)

For production use, you may need to:
1. Request to exit the SMS sandbox
2. Verify your use case with AWS
3. This allows sending SMS to any phone number

## Step 2: Environment Configuration

### 2.1 Update .env file

Copy from `.env.example` and update with your AWS credentials:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# AWS SNS Configuration (for SMS)
DEFAULT_COUNTRY_CODE=+91
SMS_ENABLED=true

# For testing (optional)
TEST_PHONE_NUMBER=+919876543210
```

### 2.2 Environment Variables Explanation

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1, ap-south-1)
- `DEFAULT_COUNTRY_CODE`: Default country code for phone formatting
- `SMS_ENABLED`: Enable/disable SMS sending (set to false for development)
- `TEST_PHONE_NUMBER`: Phone number for testing (optional)

## Step 3: Testing the Setup

### 3.1 Run the SMS Test Script

```bash
cd backend
npx tsx src/test/smsTest.ts
```

### 3.2 Test via API Endpoint

1. Start the backend server:
```bash
npm run dev
```

2. Send a POST request to `/api/auth/send-otp`:
```bash
curl -X POST http://localhost:4000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'
```

## Step 4: Phone Number Format Requirements

### 4.1 Supported Formats

The system accepts various phone number formats and automatically converts them to E.164 format:

- `9876543210` → `+919876543210` (with default country code)
- `+919876543210` → `+919876543210` (already in E.164)
- `09876543210` → `+919876543210` (removes leading 0)

### 4.2 E.164 Format

- Must start with `+`
- Followed by country code
- Then the phone number
- Maximum 15 digits total
- Example: `+919876543210` (India), `+11234567890` (US)

## Step 5: Error Handling and Fallbacks

### 5.1 Automatic Fallbacks

The system includes several fallback mechanisms:

1. **SMS Service Error**: Falls back to console logging
2. **Invalid Phone Number**: Returns validation error
3. **AWS Credentials Missing**: Falls back to development mode
4. **SMS Disabled**: Uses console logging for development

### 5.2 Monitoring and Logging

- All SMS attempts are logged with MessageId
- Failed attempts include error details
- Console fallback for development/testing

## Step 6: Production Considerations

### 6.1 Security

- Store AWS credentials securely (use AWS IAM roles in production)
- Implement rate limiting for OTP requests
- Monitor SMS usage and costs

### 6.2 Cost Optimization

- Set appropriate spending limits in AWS SNS
- Monitor SMS delivery rates
- Consider using AWS CloudWatch for monitoring

### 6.3 Regional Considerations

- Some countries require sender ID registration
- SMS delivery rates vary by country
- Consider local regulations and compliance

## Step 7: Troubleshooting

### 7.1 Common Issues

1. **SMS not received**:
   - Check phone number format
   - Verify AWS credentials
   - Check AWS SNS console for delivery status

2. **Invalid credentials error**:
   - Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
   - Check IAM permissions

3. **Region errors**:
   - Ensure AWS_REGION is correctly set
   - Some regions have limited SMS support

### 7.2 Debug Mode

Set `SMS_ENABLED=false` in `.env` to disable actual SMS sending and use console logging for development.

## Step 8: API Response Examples

### 8.1 Successful SMS
```json
{
  "message": "OTP sent via SMS",
  "messageId": "12345678-1234-1234-1234-123456789012"
}
```

### 8.2 SMS Delivery Failed
```json
{
  "message": "OTP generated (SMS delivery failed, check logs)",
  "warning": "SMS delivery failed, please contact support if you did not receive the OTP"
}
```

### 8.3 Development Mode
```json
{
  "message": "OTP sent via SMS (development mode - check console)"
}
```

## Support

For issues with AWS SNS setup:
1. Check AWS SNS documentation
2. Review CloudWatch logs
3. Contact AWS support for service-specific issues

For application-specific issues:
1. Check backend logs
2. Verify environment configuration
3. Run the SMS test script for debugging