"""
AI Waste Detection Module using YOLO
This module handles waste type detection from uploaded images
"""

import cv2
import numpy as np
from ultralytics import YOLO
import os
from typing import Dict, Tuple, Optional

class WasteDetector:
    def __init__(self, model_path: str = "models/waste_detection.pt"):
        """
        Initialize the waste detection model
        
        Args:
            model_path: Path to the trained YOLO model
        """
        self.model_path = model_path
        self.model = None
        self.load_model()
        
        # Waste type mapping
        self.waste_types = {
            0: 'plastic',
            1: 'paper',
            2: 'glass',
            3: 'metal',
            4: 'organic',
            5: 'electronic',
            6: 'hazardous',
            7: 'other'
        }
    
    def load_model(self):
        """Load the YOLO model"""
        try:
            if os.path.exists(self.model_path):
                self.model = YOLO(self.model_path)
            else:
                # Use a pre-trained model as fallback
                self.model = YOLO('yolov8n.pt')
                print(f"Warning: Custom model not found at {self.model_path}, using default YOLO model")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
    
    def preprocess_image(self, image_path: str) -> Optional[np.ndarray]:
        """
        Preprocess the image for detection
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Preprocessed image array or None if error
        """
        try:
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            # Resize image to standard size
            image = cv2.resize(image, (640, 640))
            
            # Normalize pixel values
            image = image.astype(np.float32) / 255.0
            
            return image
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def detect_waste(self, image_path: str) -> Dict:
        """
        Detect waste type in the image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary containing detection results
        """
        if self.model is None:
            return {
                'success': False,
                'error': 'Model not loaded',
                'waste_type': 'other',
                'confidence': 0.0
            }
        
        try:
            # Run detection
            results = self.model(image_path)
            
            if not results or len(results) == 0:
                return {
                    'success': False,
                    'error': 'No detections found',
                    'waste_type': 'other',
                    'confidence': 0.0
                }
            
            # Get the first result
            result = results[0]
            
            if result.boxes is None or len(result.boxes) == 0:
                return {
                    'success': False,
                    'error': 'No objects detected',
                    'waste_type': 'other',
                    'confidence': 0.0
                }
            
            # Get the detection with highest confidence
            confidences = result.boxes.conf.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy()
            
            max_conf_idx = np.argmax(confidences)
            max_confidence = float(confidences[max_conf_idx])
            class_id = int(class_ids[max_conf_idx])
            
            # Map class ID to waste type
            waste_type = self.waste_types.get(class_id, 'other')
            
            return {
                'success': True,
                'waste_type': waste_type,
                'confidence': max_confidence,
                'class_id': class_id,
                'all_detections': [
                    {
                        'class_id': int(cid),
                        'waste_type': self.waste_types.get(int(cid), 'other'),
                        'confidence': float(conf)
                    }
                    for cid, conf in zip(class_ids, confidences)
                ]
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'waste_type': 'other',
                'confidence': 0.0
            }
    
    def get_waste_type_from_text(self, text: str) -> str:
        """
        Fallback method to determine waste type from text description
        
        Args:
            text: Description text
            
        Returns:
            Detected waste type
        """
        text_lower = text.lower()
        
        # Keywords for different waste types
        keywords = {
            'plastic': ['plastic', 'bottle', 'bag', 'container', 'wrapper'],
            'paper': ['paper', 'cardboard', 'newspaper', 'magazine', 'book'],
            'glass': ['glass', 'bottle', 'jar', 'window'],
            'metal': ['metal', 'can', 'aluminum', 'steel', 'iron'],
            'organic': ['food', 'organic', 'vegetable', 'fruit', 'compost'],
            'electronic': ['electronic', 'battery', 'phone', 'computer', 'tv'],
            'hazardous': ['hazardous', 'chemical', 'toxic', 'paint', 'oil']
        }
        
        for waste_type, words in keywords.items():
            if any(word in text_lower for word in words):
                return waste_type
        
        return 'other'

# Global instance
waste_detector = WasteDetector()

def detect_waste_type(image_path: str, description: str = "") -> Dict:
    """
    Main function to detect waste type from image and description
    
    Args:
        image_path: Path to the image file
        description: Optional text description
        
    Returns:
        Detection results dictionary
    """
    # Try AI detection first
    result = waste_detector.detect_waste(image_path)
    
    # If AI detection fails or confidence is low, use text analysis
    if not result['success'] or result['confidence'] < 0.5:
        if description:
            text_type = waste_detector.get_waste_type_from_text(description)
            result['waste_type'] = text_type
            result['confidence'] = 0.3  # Lower confidence for text-based detection
            result['method'] = 'text_analysis'
        else:
            result['waste_type'] = 'other'
            result['confidence'] = 0.1
            result['method'] = 'fallback'
    else:
        result['method'] = 'ai_detection'
    
    return result

if __name__ == "__main__":
    # Test the detection
    test_image = "test_image.jpg"
    if os.path.exists(test_image):
        result = detect_waste_type(test_image, "A plastic bottle on the ground")
        print(f"Detection result: {result}")
    else:
        print("Test image not found")
