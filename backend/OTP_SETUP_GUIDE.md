# OTP SMS Setup Guide

This guide will help you set up SMS OTP functionality using AWS SNS.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install AWS CLI (optional but recommended)
3. **Node.js**: Ensure Node.js is installed

## Step 1: AWS SNS Setup

### 1.1 Create AWS Account

- Go to [AWS Console](https://aws.amazon.com/)
- Sign up or log in to your account

### 1.2 Configure SNS

1. Go to AWS SNS (Simple Notification Service) in the AWS Console
2. Navigate to "Text messaging (SMS)" in the left sidebar
3. Click "Create text messaging (SMS) preferences"
4. Set your default settings:
   - **Spending limit**: Set a reasonable limit (e.g., $10)
   - **Delivery status logging**: Enable if needed
   - **Default message type**: Transactional

### 1.3 Create IAM User

1. Go to IAM (Identity and Access Management)
2. Click "Users" → "Create user"
3. Enter username: `doohgle-sns-user`
4. Attach policies:
   - `AmazonSNSFullAccess` (for full access)
   - Or create custom policy with these permissions:
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
5. Create access key for this user
6. **Save the Access Key ID and Secret Access Key**

## Step 2: Environment Configuration

Create a `.env` file in the backend directory:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# Optional: Test phone number
TEST_PHONE=+919876543210
```

## Step 3: Test the Setup

### 3.1 Build the project

```bash
cd backend
npm run build
```

### 3.2 Run the test script

```bash
# Set your test phone number
export TEST_PHONE=+919876543210
node test-otp.js
```

### 3.3 Test via API

```bash
# Start the server
npm run dev

# In another terminal, test the OTP endpoint
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```

## Step 4: Troubleshooting

### Common Issues:

1. **"AWS credentials not configured"**

   - Check if `.env` file exists and has correct values
   - Ensure environment variables are loaded

2. **"AuthorizationError"**

   - Verify AWS credentials are correct
   - Check IAM user has SNS permissions
   - Ensure the user is in the correct AWS region

3. **"InvalidParameter"**

   - Check phone number format (should be E.164: +919876543210)
   - Ensure phone number is valid

4. **"OptedOut"**

   - The phone number has opted out of SMS
   - Try a different phone number

5. **SMS not received**
   - Check spam folder
   - Verify phone number is correct
   - Some carriers may delay SMS delivery
   - Check AWS SNS delivery logs

### Debug Steps:

1. **Check logs**: Look at the console output for detailed error messages
2. **Verify phone format**: Ensure phone number is in E.164 format (+919876543210)
3. **Test with different numbers**: Try with different phone numbers
4. **Check AWS SNS console**: Look at delivery logs in AWS SNS

## Step 5: Production Considerations

1. **Rate Limiting**: Implement proper rate limiting
2. **Cost Monitoring**: Set up AWS billing alerts
3. **Error Handling**: Implement retry logic for failed sends
4. **Logging**: Set up proper logging and monitoring
5. **Security**: Never commit AWS credentials to version control

## Support

If you're still having issues:

1. Check AWS SNS documentation
2. Verify your AWS account has SMS permissions
3. Contact AWS support if needed
4. Check if your region supports SMS (some regions have restrictions)
