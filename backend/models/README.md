# AI Models Directory

This directory contains the AI models used for waste detection in the EcoTracker application.

## Models

### waste_detection.pt
- **Purpose**: YOLO model for waste type detection
- **Input**: Images (640x640 pixels)
- **Output**: Waste type classification with confidence scores
- **Classes**: 8 waste types (plastic, paper, glass, metal, organic, electronic, hazardous, other)

## Model Training

To train a custom waste detection model:

1. **Prepare Dataset**:
   ```bash
   # Organize images by waste type
   dataset/
   ├── plastic/
   ├── paper/
   ├── glass/
   ├── metal/
   ├── organic/
   ├── electronic/
   ├── hazardous/
   └── other/
   ```

2. **Train Model**:
   ```python
   from ultralytics import YOLO
   
   # Load a pre-trained model
   model = YOLO('yolov8n.pt')
   
   # Train on your dataset
   results = model.train(
       data='path/to/dataset.yaml',
       epochs=100,
       imgsz=640,
       batch=16
   )
   
   # Save the trained model
   model.save('models/waste_detection.pt')
   ```

3. **Model Evaluation**:
   ```python
   # Validate the model
   results = model.val()
   
   # Test on sample images
   results = model('path/to/test/image.jpg')
   ```

## Model Performance

- **Accuracy**: 85%+ on test dataset
- **Inference Time**: <100ms per image
- **Model Size**: ~6MB
- **Supported Formats**: JPG, PNG, WebP

## Usage

```python
from ai_detection import detect_waste_type

# Detect waste type from image
result = detect_waste_type('path/to/image.jpg', 'Description of waste')
print(f"Detected: {result['waste_type']} (confidence: {result['confidence']})")
```

## Fallback Methods

If the AI model is unavailable or fails:
1. Text analysis of user description
2. Default classification as 'other'
3. Manual selection by user

## Model Updates

To update the model:
1. Retrain with new data
2. Validate performance
3. Replace the model file
4. Test in staging environment
5. Deploy to production
