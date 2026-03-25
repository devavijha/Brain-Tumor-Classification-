# 🧠 Brain Tumor MRI Classifier

A production-ready AI-powered web application for brain tumor classification from MRI images using deep learning.

## ✨ Features

- **🎯 AI-Powered Classification**: Deep learning model trained on thousands of MRI scans
- **⚡ Real-time Predictions**: Get results in seconds with confidence scores
- **📊 Grad-CAM Visualization**: See what the AI focused on during prediction
- **🎨 Modern UI**: Beautiful dark theme with blue accents, responsive design
- **📱 Mobile-Friendly**: Works seamlessly on all devices
- **🔒 Privacy-Focused**: Images processed securely, no data storage
- **🚀 Vercel-Native**: Fully hosted on Vercel, no backend required (ONNX inference)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js App Router)        │
│  TailwindCSS + Modern UI Components         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│    API Routes (Next.js Serverless)          │
│  /api/predict - Image classification        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│   Model Inference (ONNX Runtime)            │
│  - Image preprocessing (resize, normalize)  │
│  - Model inference                          │
│  - Post-processing & confidence scoring     │
└─────────────────────────────────────────────┘
```

### Why ONNX?
- ✅ No separate Python backend needed
- ✅ Fully Vercel-deployable
- ✅ Faster cold start times
- ✅ Cost-effective (serverless)
- ✅ Auto-scaling built-in

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TailwindCSS 3+
- TypeScript

**Backend:**
- Next.js API Routes (Serverless)
- ONNX Runtime (Node.js)
- Sharp (image processing)

**Deployment:**
- Vercel (Frontend + API)

**Model:**
- PyTorch (trained offline)
- Converted to ONNX format
- Supports 4 classifications: Glioma, Meningioma, Pituitary, No Tumor

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to project
cd BrainTumor

# Install dependencies
npm install
```

### 2. Configure Model

Download your trained PyTorch model and convert it to ONNX:

```bash
# Create models directory
mkdir -p public/models

# Place your ONNX model here
# Expected: public/models/brain_tumor_model.onnx
```

**To convert PyTorch model to ONNX:**

```python
import torch
import torch.onnx

# Load your trained model
model = YourModel()
model.load_state_dict(torch.load("model.pth"))
model.eval()

# Convert to ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model, 
    dummy_input, 
    "brain_tumor_model.onnx",
    input_names=['images'],
    output_names=['output'],
    opset_version=13
)
```

### 3. Environment Setup

```bash
# Copy example env file
cp .env.example .env.local

# Update .env.local with your values (optional for local dev)
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 API Documentation

### POST /api/predict

Classifies an MRI brain image and returns tumor classification.

**Request:**
```
POST /api/predict
Content-Type: multipart/form-data

Form Data:
  - file: <image file> (JPG, PNG, etc.)
```

**Response Success (200):**
```json
{
  "prediction": "glioma",
  "confidence": 0.9488,
  "timestamp": "2024-03-24T10:30:00.000Z",
  "modelVersion": "1.0.0",
  "gradcam": "data:image/png;base64,..."
}
```

**Response Error (4xx/5xx):**
```json
{
  "error": "Description of what went wrong"
}
```

**Supported Classifications:**
- `glioma` - Glioma tumor
- `meningioma` - Meningioma tumor
- `pituitary` - Pituitary tumor
- `notumor` - No tumor detected

## 🎨 UI Components

### Image Uploader
- Drag-and-drop support
- File validation
- Progress indication
- Size limit: 10MB

### Results Display
- Classification with icon
- Confidence score with animated bar
- Timestamp
- Model version
- Grad-CAM visualization (expandable)
- Disclaimer message
- Action buttons (Download, Details)

### Loading State
- Animated spinner
- Progress dots
- Status message

## 🔧 Configuration

### Model Configuration

Edit `app/api/predict/route.ts`:

```typescript
const CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary'];
const MODEL_PATH = path.join(process.cwd(), 'public', 'models', 'brain_tumor_model.onnx');
```

### UI Customization

Edit `app/globals.css` for colors and animations.

Edit `components/ResultsDisplay.tsx` for tumor type styling:

```typescript
const TUMOR_TYPES = {
  glioma: {
    name: 'Glioma',
    description: 'A tumor arising from glial cells in the brain',
    severity: 'high',
    color: 'from-red-500 to-red-600',
  },
  // ... more types
};
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Login to Vercel
npm i -g vercel
vercel login

# Deploy
vercel
```

**Or connect GitHub:**

1. Push to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import project
4. Add environment variables
5. Deploy

### Deployment Checklist

- [ ] Model file in `public/models/brain_tumor_model.onnx`
- [ ] Environment variables set in Vercel dashboard
- [ ] `vercel.json` configured correctly
- [ ] API timeout set to 60 seconds (for large images)
- [ ] Memory limit set to 3GB (for model inference)

## 📊 Performance

**Model Inference:**
- Average time: 2-5 seconds
- Max inference time: 60 seconds (Vercel limit)
- Memory required: ~500MB-1GB

**Optimizations:**
- Image preprocessing on client before upload
- Model caching at runtime
- ONNX optimizations for faster inference
- Lazy loading of UI components

## 🔒 Security & Privacy

- ✅ Images are not stored
- ✅ No tracking or telemetry
- ✅ All processing happens server-side
- ✅ HTTPS encryption by default (Vercel)
- ✅ Input validation on all uploads
- ✅ Rate limiting (implement as needed)

## 📝 Error Handling

The application handles:
- Invalid file types
- File size exceeding limit
- Model inference failures
- Network errors
- Timeout errors

All errors are logged and displayed to the user with helpful messages.

## 🐛 Troubleshooting

### "Model not found" error
- Ensure `public/models/brain_tumor_model.onnx` exists
- Check file path in `app/api/predict/route.ts`

### Inference timeout
- Model too large for Vercel's 60-second limit
- Optimize model size using quantization
- Increase memory allocation in `vercel.json`

### ONNX Runtime issues
- Ensure correct opset version (13+)
- Verify model architecture compatibility
- Check Node.js version compatibility

## 📚 References

- [ONNX Model Zoo](https://github.com/onnx/models)
- [ONNX Runtime Node.js](https://github.com/microsoft/onnxruntime-node)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [PyTorch ONNX Export](https://pytorch.org/docs/stable/onnx.html)

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Medical Disclaimer

**This tool is for educational and research purposes only.**

- Not intended for clinical diagnosis
- Always consult qualified medical professionals
- This is NOT a medical device
- Results should not be used for treatment decisions

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues and questions:
1. Check the Troubleshooting section
2. Review GitHub Issues
3. Submit a new issue with details

---

Built with ❤️ using Next.js, ONNX, and TailwindCSS
