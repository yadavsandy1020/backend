# Vercel Serverless Deployment Guide

This guide will help you deploy the School Management Backend to Vercel as serverless functions.

## Prerequisites

- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)
- Git repository with your code

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account if you don't have one
3. Create a new cluster (free tier)
4. In Database Access, create a database user with read/write permissions
5. In Network Access, whitelist IP `0.0.0.0/0` to allow access from Vercel
6. Click "Connect" → "Connect your application"
7. Copy the connection string (replace `<password>` with your actual password)

## Step 2: Install Vercel CLI

```bash
npm i -g vercel
```

## Step 3: Configure Environment Variables

1. Login to Vercel:
```bash
vercel login
```

2. Set environment variables in Vercel dashboard or CLI:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
```

Or add them in Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Add the following:
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A strong random string (use: `openssl rand -base64 32`)
  - `FRONTEND_URL`: Your frontend Vercel URL

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
cd backend
vercel
```

Follow the prompts:
- Set up and deploy? → Yes
- Which scope? → Select your account
- Link to existing project? → No (or select if exists)
- Project name → school-management-backend
- Directory → . (current)
- Override settings? → No

### Option B: Using Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Other
   - Root Directory: backend
   - Build Command: `npm install`
   - Output Directory: `api`
6. Add environment variables
7. Click "Deploy"

## Step 5: Verify Deployment

1. Check the deployment logs in Vercel Dashboard
2. Test the health endpoint:
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "School Management API is running"
}
```

## Important Notes

### Serverless Considerations

- **Cold Starts**: First request may be slower (1-2 seconds)
- **Execution Time**: Functions timeout after 30 seconds (configurable in vercel.json)
- **Memory**: Functions have 1024MB memory limit (configurable)
- **Database Connections**: Connection pooling is implemented to reuse connections

### File Uploads

The current setup includes static file serving for uploads. For production:
- Consider using Vercel Blob Storage or AWS S3 for file uploads
- Update the `/uploads` route to use cloud storage

### Monitoring

- Vercel provides built-in monitoring and logs
- Check Vercel Dashboard for function execution metrics
- Monitor MongoDB Atlas for database performance

### Scaling

- Vercel automatically scales based on traffic
- Free tier: 100GB bandwidth, 100GB hours/month
- Pro tier ($20/mo): Unlimited bandwidth, 1000GB hours/month

## Troubleshooting

### MongoDB Connection Issues

- Ensure IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Verify database user has correct permissions

### Timeouts

- Increase `maxDuration` in vercel.json (max 60 seconds on Pro plan)
- Optimize database queries
- Consider moving long-running tasks to background jobs

### Environment Variables

- Variables must be set in Vercel Dashboard, not in .env files
- Redeploy after adding new variables
- Use `vercel env ls` to list current variables

## Local Development

To test locally with Vercel CLI:

```bash
vercel dev
```

This simulates the serverless environment locally.

## Next Steps

1. Deploy your frontend to Vercel
2. Update FRONTEND_URL environment variable with actual frontend URL
3. Set up custom domain (optional)
4. Configure error tracking (Sentry, etc.)
5. Set up analytics (optional)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Vercel Serverless Functions Guide](https://vercel.com/docs/concepts/functions/serverless-functions)
