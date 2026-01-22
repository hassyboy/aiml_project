import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.preprocessing import image
from PIL import Image

# Global model variable
model = None

# Constants
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tourism_damage_detector.keras')
# TODO: User must provide actual class names. Assuming 4 classes based on model config.
CLASS_LABELS = {
    0: 'Cracking',
    1: 'Erosion',
    2: 'Flakings',
    3: 'No Damage'
}

def load_damage_model():
    """
    Loads the Keras model from the local filesystem.
    """
    global model
    try:
        print(f"🔄 Loading damage detection model from {MODEL_PATH}...")
        if not os.path.exists(MODEL_PATH):
            print(f"❌ Model file not found at {MODEL_PATH}")
            return False

        # Load the model directly
        model = load_model(MODEL_PATH)
        print("✅ Damage Detection Model loaded successfully!")
        
        # Warmup prediction (optional but good for performance)
        # dummy_input = np.zeros((1, 224, 224, 3))
        # model.predict(dummy_input)
        
        return True
    except Exception as e:
        print(f"❌ Failed to load damage model: {e}")
        return False

def preprocess_image(img_file):
    """
    Preprocesses the image for the model:
    - Resize to 224x224
    - Normalize if needed (MobileNetV2 usually expects [-1, 1] or [0, 1])
    - Batch dimension
    """
    # Open image using PIL
    img = Image.open(img_file)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    
    # Rescale to [0, 1] as commonly done, or specific preprocessing
    # MobileNetV2 from Keras applications usually expects [-1, 1] using tf.keras.applications.mobilenet_v2.preprocess_input
    # But since we don't know the training process, standard 1./255 is a safe bet for custom trained models usually.
    # Let's try 1./255 first.
    img_array = img_array / 255.0
    
    img_array = np.expand_dims(img_array, axis=0) # (1, 224, 224, 3)
    return img_array

def predict_damage(image_file):
    """
    Runs prediction locally.
    """
    global model
    if model is None:
        success = load_damage_model()
        if not success:
            return {'error': "Model not loaded and could not be reloaded."}

    try:
        processed_img = preprocess_image(image_file)
        
        predictions = model.predict(processed_img)
        # predictions is typically [[p0, p1, p2, p3]]
        
        probs = predictions[0]
        max_index = np.argmax(probs)
        confidence = float(probs[max_index])
        predicted_class = CLASS_LABELS.get(max_index, "Unknown")
        
        return {
            'prediction': predicted_class,
            'confidence': confidence,
            'all_scores': {CLASS_LABELS.get(i, f"Class_{i}"): float(prob) for i, prob in enumerate(probs)}
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        return {'error': str(e)}

def get_model_status():
    global model
    if model is not None:
        return {'status': 'active', 'model_loaded': True}
    else:
        return {'status': 'inactive', 'model_loaded': False}
