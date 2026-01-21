import os
import sys
import numpy as np
import cv2
import pathlib
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

# --- CONFIGURATION ---
PORT = 5001
HOST = '0.0.0.0'
# Use .keras format as per latest user update
MODEL_FILENAME = 'tourism_damage_detector.keras'

# Setup paths
BASE_DIR = pathlib.Path(__file__).parent.absolute()
MODEL_PATH = os.path.join(BASE_DIR, MODEL_FILENAME)

app = Flask(__name__)
CORS(app)

# Global model variable
damage_model = None
IMG_SIZE = (224, 224)
LABELS = ['Cracking', 'Erosion', 'Flaking', 'No_Damage']

def load_model_locally():
    global damage_model
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"CRITICAL ERROR: Model file not found at {MODEL_PATH}")
            return False

        print(f"Loading model from {MODEL_PATH}...")
        
        # Import keras here to avoid importing it if not running this script
        # Using standard Keras import as requested for modern .keras files
        import keras
        from keras.models import load_model
        
        damage_model = load_model(MODEL_PATH)
        print("✅ Damage Prediction Model Loaded Successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        traceback.print_exc()
        return False

def preprocess_image(image_file):
    # Read image from file stream directly
    # Convert string data to numpy array
    try:
        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image")

        # BGR -> RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Resize
        img = cv2.resize(img, IMG_SIZE)

        # Normalize
        img = img / 255.0

        # Add batch dimension
        img = np.expand_dims(img, axis=0)

        return img
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    global damage_model
    if damage_model is None:
        return jsonify({'error': 'Model not loaded'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    try:
        image_file = request.files['image']
        
        # Preprocess
        processed_img = preprocess_image(image_file)
        
        # Predict
        prediction = damage_model.predict(processed_img)
        
        # Post-process
        pred_class = np.argmax(prediction)
        confidence = float(np.max(prediction))
        damage_type = LABELS[pred_class]
        
        result = {
            'prediction': damage_type,
            'confidence': confidence,
            'all_scores': {LABELS[i]: float(prediction[0][i]) for i in range(len(LABELS))}
        }
        
        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'running',
        'model_loaded': damage_model is not None,
        'model_path': str(MODEL_PATH)
    })

if __name__ == '__main__':
    print("-------------------------------------------------------")
    print(f"   Starting Damage Detection Microservice on Port {PORT}")
    print("-------------------------------------------------------")
    if load_model_locally():
        app.run(host=HOST, port=PORT, debug=True)
    else:
        print("Failed to start service due to model loading error.")
