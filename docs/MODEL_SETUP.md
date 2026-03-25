# 🤖 Model Setup & ONNX Conversion Guide

This guide explains how to export your PyTorch brain tumor model to ONNX format for Vercel deployment.

## 📋 Prerequisites

```bash
# Install required packages
pip install torch torchvision torchaudio
pip install onnx onnx-simplifier onnxruntime
```

## 🔄 Step 1: Prepare Your PyTorch Model

Ensure your model is saved and working:

```python
import torch
import torchvision.models as models

# Example: Using ResNet18 as backbone
class BrainTumorClassifier(torch.nn.Module):
    def __init__(self, num_classes=4):
        super().__init__()
        self.backbone = models.resnet18(pretrained=True)
        # Replace final layer
        self.backbone.fc = torch.nn.Linear(512, num_classes)
    
    def forward(self, x):
        return self.backbone(x)

# Load your trained model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = BrainTumorClassifier(num_classes=4)
model.load_state_dict(torch.load('your_model.pth', map_location=device))
model.to(device)
model.eval()
```

## ✅ Step 2: Convert to ONNX

```python
import torch
import torch.onnx

# Dummy input (batch_size=1, channels=3, height=224, width=224)
dummy_input = torch.randn(1, 3, 224, 224, device=device)

# Export to ONNX
torch.onnx.export(
    model,
    dummy_input,
    "brain_tumor_model.onnx",
    input_names=['images'],
    output_names=['output'],
    dynamic_axes={
        'images': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    },
    opset_version=13,
    do_constant_folding=True,
    verbose=False
)

print("✅ Model exported to brain_tumor_model.onnx")
```

## 🔍 Step 3: Verify ONNX Model

```python
import onnx
import onnxruntime as ort

# Load and check model
onnx_model = onnx.load("brain_tumor_model.onnx")
onnx.checker.check_model(onnx_model)
print("✅ ONNX model is valid")

# Test inference
session = ort.InferenceSession("brain_tumor_model.onnx")
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

# Run test
test_input = {input_name: dummy_input.cpu().numpy()}
output = session.run([output_name], test_input)

print(f"✅ Output shape: {output[0].shape}")
print(f"✅ Output sample: {output[0][0]}")
```

## 🎯 Step 4: Optional - Optimize ONNX Model

Reducing model size for faster deployment:

```python
import onnx
from onnxruntime.transformers import optimizer

# Load ONNX model
onnx_model = onnx.load("brain_tumor_model.onnx")

# Optimize
optimized_model = optimizer.optimize_model(
    "brain_tumor_model.onnx",
    model_type='bert',  # Use appropriate model type
    num_heads=None,
    hidden_size=None
)

optimized_model.save_model_to_file("brain_tumor_model_optimized.onnx")
print("✅ Optimized model saved")
```

**Alternative - Use ONNX Simplifier (Recommended):**

```bash
pip install onnx-simplifier

python -m onnxsim brain_tumor_model.onnx brain_tumor_model_simplified.onnx
```

## 📦 Step 5: Deploy Model

1. **Place model in project:**
   ```bash
   mkdir -p public/models
   cp brain_tumor_model.onnx public/models/
   ```

2. **Update API route:**
   Check that `app/api/predict/route.ts` uses the correct model path:
   ```typescript
   const MODEL_PATH = path.join(process.cwd(), 'public', 'models', 'brain_tumor_model.onnx');
   ```

3. **Update class names if needed:**
   ```typescript
   const CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary'];
   ```

## 🧪 Model Testing Checklist

- [ ] Model runs successfully with onnxruntime
- [ ] Input shape: (1, 3, 224, 224)
- [ ] Output shape: (1, num_classes)
- [ ] Confidence scores sum to ~1.0 (softmax applied)
- [ ] Model file < 500MB (for Vercel limits)
- [ ] Inference time < 60 seconds

## 🚨 Common Issues

### Issue: "Model format version is not supported"
**Solution:** Use opset_version=13 or higher

```python
torch.onnx.export(
    model, dummy_input, "model.onnx",
    opset_version=13  # ← Increase this
)
```

### Issue: "Input shape mismatch"
**Solution:** Ensure dummy input matches your model's expected input

```python
# For 224x224 RGB images
dummy_input = torch.randn(1, 3, 224, 224)
```

### Issue: Model too large (> 500MB)
**Solution:** Quantize the model

```python
import onnx
from onnxruntime.quantization import quantize_dynamic, QuantType

quantize_dynamic(
    "brain_tumor_model.onnx",
    "brain_tumor_model_quantized.onnx",
    weight_type=QuantType.QInt8,
)
```

### Issue: Inference timeout on Vercel
**Solution:** 
- Reduce model size via quantization
- Optimize image preprocessing
- Increase timeout in vercel.json

```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

## 📊 Model Performance Targets

- **Size:** < 500MB (unquantized), < 150MB (quantized)
- **Inference:** 2-5 seconds (on Vercel)
- **Accuracy:** > 85% (depends on training data)
- **Memory:** < 1GB during inference

## 🔗 Useful Resources

- [PyTorch ONNX Export](https://pytorch.org/docs/stable/onnx.html)
- [ONNX Model Zoo](https://github.com/onnx/models)
- [ONNX Runtime Docs](https://onnxruntime.ai/)
- [ONNX Simplifier](https://github.com/daquexian/onnx-simplifier)
- [Quantization Guide](https://github.com/microsoft/onnxruntime/tree/main/onnxruntime/quantization)

## 📝 Complete Example Script

Save as `convert_model.py`:

```python
#!/usr/bin/env python3
"""
Convert PyTorch brain tumor model to ONNX format
"""

import torch
import torch.onnx
import onnx
import onnxruntime as ort

def convert_to_onnx(model_path: str, output_path: str = "brain_tumor_model.onnx"):
    """Convert PyTorch model to ONNX"""
    
    print("🔄 Loading PyTorch model...")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # TODO: Update to load your actual model
    # model = YourModel()
    # model.load_state_dict(torch.load(model_path, map_location=device))
    
    # For now using a placeholder
    import torchvision.models as models
    model = models.resnet18(pretrained=False)
    model.fc = torch.nn.Linear(512, 4)  # 4 classes
    
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
    except:
        print("⚠️ Could not load weights, using random initialization")
    
    model.to(device)
    model.eval()
    
    print("✅ Model loaded")
    
    print("🔄 Exporting to ONNX...")
    dummy_input = torch.randn(1, 3, 224, 224, device=device)
    
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=['images'],
        output_names=['output'],
        dynamic_axes={
            'images': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        },
        opset_version=13,
        do_constant_folding=True,
        verbose=False
    )
    
    print(f"✅ Exported to {output_path}")
    
    print("🔍 Validating ONNX model...")
    onnx_model = onnx.load(output_path)
    onnx.checker.check_model(onnx_model)
    print("✅ ONNX model is valid")
    
    print("🧪 Testing ONNX inference...")
    session = ort.InferenceSession(output_path)
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    
    test_input = {input_name: dummy_input.cpu().numpy()}
    output = session.run([output_name], test_input)
    
    print(f"✅ Inference successful!")
    print(f"   Output shape: {output[0].shape}")
    print(f"   Output sample: {output[0][0]}")
    
    print("🎉 Conversion complete!")

if __name__ == "__main__":
    import sys
    model_path = sys.argv[1] if len(sys.argv) > 1 else "model.pth"
    convert_to_onnx(model_path)
```

Run it:
```bash
python convert_model.py your_model.pth
```

---

✅ Your model is now ready for Vercel deployment!
