# ⚡ Quick Start Guide

Get the Brain Tumor Classifier running in minutes.

## 1️⃣ Prerequisites

Before starting, ensure you have:
- **Node.js 18+** ([download](https://nodejs.org/))
- **npm or yarn**
- **Git**
- **ONNX Model** (your converted brain_tumor_model.onnx)

Verify installation:
```bash
node --version   # Should be 18+
npm --version    # Should be 9+
```

## 2️⃣ Initial Setup

### Clone/Navigate to Project
```bash
cd ~/Desktop/BrainTumor
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

This installs:
- Next.js 14
- React 18
- TailwindCSS
- Sharp (image processing)
- TypeScript

### Add Your Model

```bash
# Create models directory
mkdir -p public/models

# Copy your ONNX model
cp /path/to/brain_tumor_model.onnx public/models/
```

Your model must be named: `brain_tumor_model.onnx`

## 3️⃣ Run Locally

```bash
npm run dev
```

Output:
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.1s
```

Open **http://localhost:3000** in your browser 🚀

## 4️⃣ Test the Application

### Test Upload
1. Click **"Upload Brain MRI Image"**
2. Select a test brain MRI image (JPG or PNG)
3. The app will:
   - Show preview
   - Submit to API
   - Display prediction
   - Show confidence score

### Expected Response
```json
{
  "prediction": "glioma",
  "confidence": 0.9488,
  "timestamp": "2024-03-24T10:30:00.000Z",
  "modelVersion": "1.0.0"
}
```

## 5️⃣ Project Structure

```
BrainTumor/
├── app/                    # Next.js App Router
│   ├── api/predict/       # API endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Styles
├── components/             # React components
│   ├── ImageUploader
│   ├── ResultsDisplay
│   ├── LoadingSpinner
│   └── Header
├── lib/                    # Utilities
│   ├── constants.ts
│   ├── imageProcessing.ts
│   ├── gradcam.ts
│   └── utils.ts
├── public/models/          # ONNX model storage
├── package.json
└── README.md
```

## 6️⃣ Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Model conversion helper
npm run export-model
```

## 7️⃣ Configuration

### Model Settings

Edit `app/api/predict/route.ts`:
```typescript
const MODEL_PATH = path.join(process.cwd(), 'public', 'models', 'brain_tumor_model.onnx');
const CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary'];
```

### UI Customization

Edit `components/ResultsDisplay.tsx`:
```typescript
const TUMOR_TYPES = {
  glioma: {
    name: 'Glioma',
    color: 'from-red-500 to-red-600',
    // ...
  },
  // ...
};
```

## 8️⃣ Troubleshooting

### "Module not found: 'sharp'"
```bash
npm install sharp
```

### "Model not found at runtime"
Check:
1. File path: `public/models/brain_tumor_model.onnx`
2. File exists: `ls public/models/`
3. Permissions: `chmod 644 public/models/brain_tumor_model.onnx`

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Slow Build Time
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 9️⃣ Next Steps

After verifying locally:

1. **Deploy to Vercel** (5 minutes)
   ```bash
   npm i -g vercel
   vercel
   ```
   See: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

2. **Setup CI/CD** (GitHub Actions)
   See: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#cicd-automation)

3. **Monitor Performance**
   - Vercel Dashboard → Analytics
   - Check response times
   - Track error rates

4. **Optimize Model**
   - Quantize if needed
   - Profile inference time
   - See: [docs/MODEL_SETUP.md](docs/MODEL_SETUP.md)

## 🔟 Development Tips

### Hot Reload
- Edit files and see changes instantly
- Keep dev server running
- Browser auto-refreshes

### Debug Mode
```bash
DEBUG=true npm run dev
```

### TypeScript
- Full type safety
- Intellisense in editor
- Catch errors at compile time

### Styling
- TailwindCSS classes
- Dark theme by default
- Blue + Purple accent
- Fully responsive

## Testing Locally with Sample Data

### Create Test Image
```python
# Create a test MRI image locally
from PIL import Image
import numpy as np

# Random brain-like image
img_array = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)
img = Image.fromarray(img_array)
img.save('test_brain.jpg')
```

### Upload Via curl
```bash
curl -X POST http://localhost:3000/api/predict \
  -F "file=@test_brain.jpg"
```

## 📚 Documentation

- **[README.md](README.md)** - Full documentation
- **[docs/MODEL_SETUP.md](docs/MODEL_SETUP.md)** - Model conversion guide
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Vercel deployment
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture

## 🆘 Need Help?

1. **Check the API**
   - Open DevTools (F12)
   - Go to Network tab
   - Check POST /api/predict request

2. **View Logs**
   - Terminal: `npm run dev`
   - Vercel: Dashboard → Logs

3. **Debug Inference**
   - Check model file size
   - Verify model format
   - Test with ONNX Runtime directly

## ✅ Checklist Before Deployment

- [ ] Model file: `public/models/brain_tumor_model.onnx` exists
- [ ] `npm run build` succeeds
- [ ] Test upload works locally
- [ ] Environment variables configured
- [ ] README updated with your info
- [ ] Model version in constants.ts

---

**You're all set! Start uploading brain MRI images and get instant AI predictions.** 🧠✨

For detailed info: → [README.md](README.md)
