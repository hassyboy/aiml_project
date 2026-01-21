import os
# Force Legacy Keras support
os.environ["TF_USE_LEGACY_KERAS"] = "1"

import sys
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# Switch to Legacy Keras (tf_keras)
import tf_keras as keras
from tf_keras.models import load_model

# --- CONFIGURATION ---
PORT = 5001
MODEL_PATH = "tourism_damage_detector.keras"
LABELS = ['Cracking', 'Erosion', 'Flaking', 'No_Damage']
IMG_SIZE = (224, 224)

app = Flask(__name__)
CORS(app)

print(f"TensorFlow Version: {tf.__version__}")
print(f"Loading model from {MODEL_PATH}...")

# Load model globally ONCE
try:
    model = load_model(MODEL_PATH)
    print("Model loaded successfully (Top Level)")
except Exception as e:
    print(f"CRITICAL Error loading model: {e}")
    model = None

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize(IMG_SIZE)
    img_array = np.array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model failed to load on startup'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    try:
        img_bytes = file.read()
        processed_img = preprocess_image(img_bytes)
        prediction = model.predict(processed_img)
        pred_class = np.argmax(prediction)
        confidence = float(np.max(prediction))
        damage_type = LABELS[pred_class]
        return jsonify({
            'prediction': damage_type,
            'confidence': confidence,
            'all_scores': {LABELS[i]: float(prediction[0][i]) for i in range(len(LABELS))}
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    status = 'active' if model else 'model_not_loaded'
    return jsonify({'status': status, 'tensorflow_version': tf.__version__})

if __name__ == '__main__':
    print(f"Starting Damage Detection Microservice on Port {PORT}")
    # User Fix #1: Disable Flask auto-reloader
    app.run(host='0.0.0.0', port=PORT, debug=True, use_reloader=False)
