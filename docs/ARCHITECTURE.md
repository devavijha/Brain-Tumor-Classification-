# 🏗️ Architecture Documentation

Complete architecture overview of the Brain Tumor Classifier application.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                         │
├─────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────────────────────────┐
│  │         Next.js 14 App Router (Frontend)             │
│  └──────────────────────────────────────────────────────┘
│           │
│           ├─ Pages
│           │   └─ app/page.tsx (Main UI)
│           │
│           ├─ Components
│           │   ├─ ImageUploader
│           │   ├─ ResultsDisplay
│           │   ├─ LoadingSpinner
│           │   └─ Header
│           │
│           ├─ Hooks
│           │   ├─ usePrediction
│           │   ├─ useImageUpload
│           │   ├─ useAsync
│           │   └─ useViewport
│           │
│           ├─ Lib
│           │   ├─ imageProcessing.ts
│           │   ├─ gradcam.ts
│           │   ├─ constants.ts
│           │   └─ utils.ts
│           │
│           ├─ Styles
│           │   ├─ globals.css (TailwindCSS)
│           │   └─ component styles
│           │
│           └─ Types
│               └─ index.ts (TypeScript definitions)
│
│  ┌──────────────────────────────────────────────────────┐
│  │    HTTP/HTTPS (Fetch API / Axios)                   │
│  │         POST /api/predict                            │
│  └──────────────────────────────────────────────────────┘
│           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Vercel Serverless Functions                │
├─────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────────────────────────┐
│  │         Next.js API Routes (Backend)                 │
│  │         app/api/predict/route.ts                     │
│  └──────────────────────────────────────────────────────┘
│           │
│           ├─ Request Handler
│           │   ├─ Parse FormData
│           │   ├─ Validate File
│           │   └─ Extract Image Buffer
│           │
│           ├─ Image Processing
│           │   ├─ Decode Image
│           │   ├─ Resize (224x224)
│           │   ├─ Normalize
│           │   └─ Convert to Tensor
│           │
│           ├─ ONNX Model Inference
│           │   ├─ Load Model (cached)
│           │   ├─ Run Inference
│           │   └─ Post-process Output
│           │
│           └─ Response
│               └─ JSON (prediction, confidence, etc)
│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Model & Static Assets                          │
├─────────────────────────────────────────────────────────────┤
│
│  ├─ public/models/brain_tumor_model.onnx
│  ├─ public/models/ (other assets)
│  └─ Static files served by Vercel
│
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### Page Components
- **app/page.tsx** - Main page with layout and state management
  - Handles image upload
  - Manages prediction lifecycle
  - Displays results or error
  - Coordinates component interactions

#### Feature Components
- **ImageUploader** - File upload interface
  - Drag-and-drop support
  - File validation
  - Progress indication
  
- **ResultsDisplay** - Prediction results display
  - Classification result
  - Confidence visualizations
  - Grad-CAM visualization toggle
  - Action buttons

- **LoadingSpinner** - Loading state indicator
  - Animated spinner
  - Status message
  - Progress dots

- **Header** - Navigation and branding
  - Logo
  - Navigation links
  - GitHub button

### State Management

**Local State (React Hooks)**
```
page.tsx (Main State)
├── image: string (base64 preview)
├── loading: boolean
├── result: PredictionResponse
├── error: string | null
└── file: File (upload reference)
```

**No External State Manager Needed**
- Simple local React state sufficient
- Props drilling minimal
- Components self-contained

### Data Flow

```
User Action
    │
    ├─→ Select/Drop Image
    │       │
    │       ├─→ Validate (validateImageFile)
    │       ├─→ Preview (FileReader)
    │       └─→ Store in state
    │
    ├─→ Submit for Prediction
    │       │
    │       ├─→ FormData creation
    │       ├─→ POST /api/predict
    │       ├─→ Show loading state
    │       │
    │       └─→ Server Processing
    │               │
    │               ├─→ Parse FormData
    │               ├─→ Process Image (Sharp)
    │               ├─→ Run ONNX Inference
    │               └─→ Return JSON Response
    │
    └─→ Display Results
            │
            ├─→ Update result state
            ├─→ Render ResultsDisplay
            ├─→ Show Grad-CAM option
            └─→ Display buttons
```

## API Architecture

### Endpoint: POST /api/predict

**Request:**
```
POST /api/predict
Content-Type: multipart/form-data

{
  file: File
}
```

**Response Success (200):**
```json
{
  "prediction": "glioma|meningioma|pituitary|notumor",
  "confidence": 0.0 - 1.0,
  "timestamp": "ISO8601 string",
  "modelVersion": "1.0.0",
  "gradcam": "base64 encoded image (optional)"
}
```

**Response Error (400/500):**
```json
{
  "error": "Human readable error message"
}
```

### Request Validation

```
┌─ File exists
├─ File type is image
├─ File size < 10MB
├─ Image format valid
└─ Image dimensions reasonable
```

### Response Pipeline

```
Raw Image Buffer
    └─→ Sharp Processing
        ├─ Decode image
        ├─ Resize to 224x224
        ├─ Normalize with ImageNet stats
        └─ Convert to tensor
            │
            └─→ ONNX Runtime
                ├─ Load model (cached in memory)
                ├─ Run inference
                └─ Softmax post-processing
                    │
                    └─→ Return Top Prediction + Confidence
                        │
                        └─→ Optional Grad-CAM Generation
                            │
                            └─→ JSON Response
```

## Model Integration

### ONNX Model Format

**Why ONNX?**
- ✅ No Python backend needed
- ✅ Fully Vercel-native
- ✅ Supports Node.js runtime
- ✅ Fast inference
- ✅ Cross-platform compatibility

**Model Specs:**
- Format: ONNX (Open Neural Network Exchange)
- Framework: PyTorch (converted)
- Input: (1, 3, 224, 224) - NCHW format
- Output: (1, 4) - 4 class logits
- Preprocessing: ImageNet normalization

### Inference Flow

```
Base64 Image
    │
    ├─→ Buffer Decode
    │       └─→ ImageData
    │
    ├─→ Resize & Normalize
    │       └─→ Float32Array
    │
    ├─→ Model Inference
    │       └─→ Raw Output [0.1, 0.8, 0.05, 0.05]
    │
    ├─→ Post-processing
    │       ├─ Apply Softmax (already applied usually)
    │       ├─ Find argmax
    │       └─ Return [classIdx, confidence]
    │
    └─→ Format Response
            └─→ {"prediction": "glioma", "confidence": 0.8}
```

## TailwindCSS + Custom Styling

### Design System

**Colors:**
- Background: Slate 900 gradient
- Primary: Blue (#3b82f6)
- Accent: Purple (#8b5cf6)
- Text: White with opacity levels

**Components:**
- Glass morphism: `.glass`
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Animations: `.pulse-glow`, `.smooth-transition`
- Gradients: `.gradient-text`

### Responsive Design

```
Mobile First
├─ Base: Mobile (375px+)
├─ sm: 640px
├─ md: 768px (tablet)
├─ lg: 1024px
└─ xl: 1280px (desktop)

Grid Layout
md:grid-cols-2 → 1 column mobile, 2 columns on tablet+
```

## Deployment Architecture

### Vercel Infrastructure

```
Git Repository (GitHub)
    │
    └─→ Push to main
        │
        └─→ Vercel Build
            ├─ npm install
            ├─ npm run build
            │   ├─ Next.js compilation
            │   ├─ TypeScript checking
            │   ├─ Bundle optimization
            │   └─ Output: .next/
            │
            └─→ Vercel Deployment
                ├─ Next.js App Deployed
                │   └─ Serverless Functions
                │
                ├─ Static Assets
                │   └─ public/ (CSS, images, model)
                │
                ├─ Edge Functions (optional)
                │   └─ Middleware
                │
                └─ CDN Distribution
                    └─ Global edge caching
```

### Function Configuration (vercel.json)

```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60,      // 60 seconds max runtime
      "memory": 3008          // 3GB memory
    }
  }
}
```

## Performance Optimization

### Frontend Optimization
- Code splitting (Next.js automatic)
- Image lazy loading
- CSS minification (Tailwind)
- JavaScript minification
- Bundle analysis

### Backend Optimization
- Model caching in memory
- Efficient image processing (Sharp)
- Tensor pre-allocation
- Response compression
- Cold start optimization

### Network Optimization
- Gzip compression
- CDN caching (Vercel)
- Image optimization
- Lazy loading

## Security Architecture

### Input Validation
```
File Upload
├─ File type check (MIME)
├─ File size limit (10MB)
├─ Image format validation
└─ Dimension bounds check
```

### Data Privacy
- ✅ No data storage
- ✅ No analytics tracking
- ✅ No external APIs
- ✅ HTTPS by default
- ✅ Server-side processing only

### Error Handling
- User-friendly error messages
- Server error logging
- Graceful degradation
- No sensitive data exposure

## File Structure

```
BrainTumor/
├─ app/
│   ├─ api/
│   │   └─ predict/
│   │       └─ route.ts
│   ├─ globals.css
│   ├─ layout.tsx
│   └─ page.tsx
├─ components/
│   ├─ Header.tsx
│   ├─ ImageUploader.tsx
│   ├─ LoadingSpinner.tsx
│   └─ ResultsDisplay.tsx
├─ docs/
│   ├─ DEPLOYMENT.md
│   └─ MODEL_SETUP.md
├─ hooks/
│   └─ use-prediction.ts
├─ lib/
│   ├─ constants.ts
│   ├─ gradcam.ts
│   ├─ imageProcessing.ts
│   └─ utils.ts
├─ public/
│   └─ models/
│       └─ brain_tumor_model.onnx
├─ scripts/
│   └─ convert-model.js
├─ types/
│   └─ index.ts
├─ .env.local
├─ .gitignore
├─ next.config.js
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ vercel.json
└─ README.md
```

## Scalability Considerations

### Current Approach (Suitable for)
- ✅ Prototypes and MVPs
- ✅ Moderate traffic (< 1000 req/min)
- ✅ Low latency requirements
- ✅ Simple scaling (automatic via Vercel)

### Future Enhancements

**If traffic increases:**
```
Current:
User → Vercel Serverless → ONNX Model

Enhanced:
User → Vercel CDN
          ├─ Static content cached
          └─ API requests → Load Balancer
                                ├─ Model Server 1
                                ├─ Model Server 2
                                └─ Model Server 3 (auto-scaling)
```

**If model becomes large:**
- Model quantization
- Model splitting/pruning
- GPU inference
- Dedicated inference server

## Monitoring & Observability

### Vercel Metrics
- Request count
- Response time
- Error rate
- Function duration
- Memory usage

### recommended Integration
- Sentry for error tracking
- Vercel Analytics for performance
- Custom logging in API routes

```typescript
// Example error tracking
if (error) {
  console.error('Inference failed:', error);
  // Optional: Sentry.captureException(error);
}
```

---

This architecture provides a solid foundation for a production-grade application with room for scaling and enhancement.
