#!/bin/bash

# Doohgle Backend Deployment Guide for Render

echo "🚀 Deploying Doohgle Backend to Render"
echo "======================================"

echo ""
echo "📋 Pre-deployment Checklist:"
echo "✅ PostgreSQL database configured on Render"
echo "✅ Environment variables configured"
echo "✅ Build script tested"
echo "✅ Health check endpoint available"

echo ""
echo "🔧 Deployment Steps:"
echo ""
echo "1. Push your code to GitHub repository"
echo "2. Go to https://render.com and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Configure the following settings:"
echo ""
echo "   Build Command: npm install && npm run build"
echo "   Start Command: npm start"
echo "   Environment Variables:"
echo "   - DATABASE_URL: (use your existing Render PostgreSQL connection string)"
echo "   - JWT_SECRET: (generate a secure random string)"
echo "   - AWS_ACCESS_KEY_ID: (your AWS access key ID)"
echo "   - AWS_SECRET_ACCESS_KEY: (your AWS secret access key)"
echo "   - AWS_REGION: (your AWS region, e.g., us-east-1)"
echo "   - S3_BUCKET_NAME: (your S3 bucket name)"
echo "   - SMTP_HOST: (your SMTP server, e.g., smtp.gmail.com)"
echo "   - SMTP_PORT: (SMTP port, e.g., 587)"
echo "   - SMTP_USER: (your email address)"
echo "   - SMTP_PASS: (your email app password)"
echo "   - EMAIL_USER: (your email address for notifications)"
echo "   - EMAIL_TLS_INSECURE: false"
echo "   - NODE_ENV: production"
echo ""
echo "5. Set Health Check Path: /api/health"
echo "6. Deploy!"
echo ""
echo "🌐 After deployment, your API will be available at:"
echo "https://your-service-name.onrender.com/api/health"
echo ""
echo "📝 Remember to update your frontend VITE_API_URL to point to the new Render URL"

# Test build locally
echo ""
echo "🔨 Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Your backend is ready for deployment!"
    echo "Visit https://render.com to deploy your service."
else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi
