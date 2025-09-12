# Doohgle Backend Deployment Guide

## 🚀 Deploy to Render

This guide will help you deploy the Doohgle backend to Render.com.

### Prerequisites

- [x] GitHub repository with your code
- [x] Render account (free tier available)
- [x] PostgreSQL database on Render (already configured)

### Deployment Steps

#### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### 2. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `doohgle`

#### 3. Configure Build & Deploy Settings

**Basic Settings:**
- **Name**: `doohgle-backend`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: `backend`

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### 4. Environment Variables

Add these environment variables in Render:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://doohgle_user:otxTFMbnGUBHp6haXlXff7h1IgD6eamH@dpg-d301nk2li9vc738hm3i0-a.oregon-postgres.render.com/doohgle` |
| `JWT_SECRET` | `Sada_8324` |
| `AWS_ACCESS_KEY_ID` | `AKIA46HVBEZPIIHK62PE` |
| `AWS_SECRET_ACCESS_KEY` | `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` |
| `AWS_REGION` | `ap-southeast-2` |
| `S3_BUCKET_NAME` | `doohgle` |
| `EMAIL_USER` | `devlop8324@gmail.com` |
| `EMAIL_PASS` | `Sada@8324` |
| `EMAIL_TLS_INSECURE` | `true` |
| `NODE_ENV` | `production` |

#### 5. Advanced Settings

- **Health Check Path**: `/api/health`
- **Auto-Deploy**: `Yes`

#### 6. Deploy

Click "Create Web Service" to start the deployment.

### 📡 API Endpoints

Once deployed, your API will be available at:
```
https://doohgle-backend.onrender.com
```

**Available endpoints:**
- `GET /api/health` - Health check
- `GET /api/screens` - Get all screens
- `GET /api/campaigns` - Get all campaigns
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### 🔧 Post-Deployment

#### Update Frontend Configuration

Update your frontend `.env` file:
```env
VITE_API_URL=https://doohgle-backend.onrender.com/api
```

#### Test Deployment

```bash
# Test health endpoint
curl https://doohgle-backend.onrender.com/api/health

# Test screens API
curl https://doohgle-backend.onrender.com/api/screens

# Test campaigns API
curl https://doohgle-backend.onrender.com/api/campaigns
```

### 🐛 Troubleshooting

#### Build Fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally: `npm run build`

#### Service Won't Start
- Check the deployment logs
- Verify the start command: `npm start`
- Ensure `dist/index.js` exists after build

#### Database Connection Issues
- Verify `DATABASE_URL` environment variable
- Check database is running and accessible
- Test connection locally with the same URL

#### Health Check Fails
- Ensure `/api/health` endpoint is working
- Check that the service is listening on the correct port
- Verify CORS is configured for production

### 📝 Notes

- **Free Tier**: Render free services sleep after 15 minutes of inactivity
- **Cold Starts**: First request may take 30+ seconds after sleeping
- **Logs**: Available in Render dashboard for debugging
- **SSL**: Automatically provided by Render

### 🔄 Continuous Deployment

Once set up, any push to your main branch will automatically trigger a new deployment.

For manual deployment:
1. Push changes to GitHub
2. Render will automatically detect and deploy
3. Monitor deployment in Render dashboard

---

**🎉 Your Doohgle backend is now live on Render!**
