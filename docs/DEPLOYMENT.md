# 🚀 Deployment Guide

Complete guide for deploying the Brain Tumor Classifier to Vercel.

## Prerequisites

- Vercel account (free tier supported)
- GitHub account
- Node.js 18+ installed locally
- Brain tumor model in ONNX format

## 📋 Pre-Deployment Checklist

- [ ] Model file: `public/models/brain_tumor_model.onnx` exists
- [ ] Run `npm install` successfully
- [ ] Run `npm run build` successfully
- [ ] Test locally with `npm run dev`
- [ ] All environment variables configured
- [ ] `.gitignore` includes model files (optional)
- [ ] README.md updated

## 🔧 Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd BrainTumor
vercel
```

Follow the prompts:
- **Project setup:** Select "Other"
- **Framework:** Select "Next.js"
- **Root directory:** Leave empty (default)

### Step 4: Set Environment Variables
After deployment, add environment variables:

```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_MODEL_VERSION
```

Or via Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add variables

## 🌐 Option 2: Deploy via GitHub (Recommended for Teams)

### Step 1: Push to GitHub

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit: Brain Tumor Classifier"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/BrainTumor.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Select "GitHub"
4. Authorize if needed
5. Import your `BrainTumor` repository
6. Click "Import"

### Step 3: Configure Project

**Framework Preset:** Next.js

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Production URL (auto-filled)
- `NEXT_PUBLIC_MODEL_VERSION`: 1.0.0

**Build Settings:**
- Command: `npm run build` (default)
- Output Directory: `.next` (default)

### Step 4: Deploy

Click "Deploy" and wait for completion.

## 📤 Handling Large Model Files

If your ONNX model is > 100MB, you may hit GitHub limits:

### Option A: Use Git LFS (Recommended)

```bash
# Install Git LFS
git lfs install

# Track .onnx files
git lfs track "*.onnx"
git add .gitattributes
git commit -m "Add Git LFS tracking"

# Push
git push
```

### Option B: Upload Model to Vercel

1. Deploy first without model
2. Use Vercel CLI to upload:
   ```bash
   vercel env add MODEL_URL "https://your-storage.com/model.onnx"
   ```
3. Modify API route to download model on first run

## 🔒 Environment Variables for Production

### Required Variables

```
# Public variables (visible at build time)
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
NEXT_PUBLIC_MODEL_VERSION=1.0.0

# Secret variables (runtime only)
# (Add if needed for external services)
```

## ⚙️ Vercel Configuration

Your `vercel.json` should have:

```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_MODEL_VERSION": "@next_public_model_version"
  },
  "functions": {
    "app/api/**": {
      "maxDuration": 60,
      "memory": 3008
    }
  },
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "output": ".next"
}
```

## 🧪 Test Deployment

### Test API Endpoint

```bash
# Get your deployment URL from Vercel
curl -X POST https://your-domain.vercel.app/api/predict \
  -F "file=@test_image.jpg"
```

### Expected Response

```json
{
  "prediction": "glioma",
  "confidence": 0.95,
  "timestamp": "2024-03-24T10:30:00.000Z",
  "modelVersion": "1.0.0"
}
```

## 📊 Vercel Dashboard Monitoring

After deployment, check:

1. **Deployments Tab**
   - Deployment status
   - Build logs
   - Environment variables

2. **Analytics Tab**
   - Request count
   - Response times
   - Error rates

3. **Logs Tab**
   - Real-time logs
   - Error tracking
   - Debug information

## 🚨 Troubleshooting Deployment

### Build Fails: "Module not found"

```bash
# Ensure dependencies installed
npm install
npm run build
```

### API Timeout

Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 120
    }
  }
}
```

### Model Not Found at Runtime

Ensure model path is correct:
```typescript
// app/api/predict/route.ts
const MODEL_PATH = path.join(process.cwd(), 'public', 'models', 'brain_tumor_model.onnx');
```

Vercel serves static files from `public` folder.

### Out of Memory Error

Increase function memory:
```json
{
  "functions": {
    "app/api/**": {
      "memory": 3008
    }
  }
}
```

### Cold Start Too Slow

- Optimize model size (quantization)
- Use lazy loading
- Cache model in memory

## 🔐 Production Best Practices

### 1. Add Rate Limiting

```typescript
// app/api/predict/route.ts
const rateLimit = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  
  // Keep requests from last minute
  const recentRequests = requests.filter(t => now - t < 60000);
  
  if (recentRequests.length >= 10) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return false;
}
```

### 2. Add Error Logging

```typescript
import Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    // ... inference code
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Prediction failed' }, { status: 500 });
  }
}
```

### 3. Monitor Performance

Use Vercel Analytics:
- Track Web Vitals
- Monitor API response times
- Identify bottlenecks

### 4. Enable Security Headers

```javascript
// next.config.js
async function headers() {
  return [
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
      ],
    },
  ];
}

module.exports = {
  async headers() {
    return headers();
  },
};
```

## 📊 Monitoring & Scaling

### Monitor Deployment

```bash
# Check deployment status
vercel deployments list

# View logs
vercel logs [deployment-url]

# Check analytics
vercel analytics
```

### Scaling Automatically

Vercel handles scaling automatically. Your project scales based on demand.

Performance tiers:
- Free: 1 concurrent execution
- Pro: 6 concurrent executions
- Enterprise: Custom

## 🔄 CI/CD Automation

GitHub Actions workflow for auto-deploy:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📝 Post-Deployment

1. **Test thoroughly**
   - Upload test images
   - Verify predictions
   - Check response times

2. **Share with stakeholders**
   - Get feedback
   - Collect metrics
   - Plan improvements

3. **Monitor continuously**
   - Watch error rates
   - Track usage patterns
   - Optimize as needed

## 🆘 Support

For Vercel deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/next.js/discussions)

---

Your Brain Tumor Classifier is now live! 🎉
