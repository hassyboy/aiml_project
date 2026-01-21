# --- 1. Install Dependencies ---
!pip install flask flask-cors pyngrok tensorflow==2.15.0 opencv-python-headless

# --- 2. Authenticate Ngrok (Get token from dashboard.ngrok.com) ---
from pyngrok import ngrok
# REPLACE 'YOUR_AUTHTOKEN' WITH YOUR ACTUAL TOKEN
ngrok.set_auth_token("YOUR_AUTH_TOKEN_HERE")

# --- 3. Create the Server Script ---
code = """
import os
import numpy as np
import cv2
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model

# Download model if not present (Optional: You can upload it manually to Colab files)
# if not os.path.exists('tourism_damage_detector.keras'):
#     from google.colab import files
#     print("Please upload 'tourism_damage_detector.keras' now:")
#     files.upload()

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'tourism_damage_detector.keras'
damage_model = None
IMG_SIZE = (224, 224)
LABELS = ['Cracking', 'Erosion', 'Flaking', 'No_Damage']

def load_model_locally():
    global damage_model
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"Model not found at {MODEL_PATH}")
            return False
        damage_model = load_model(MODEL_PATH)
        print("✅ Model Loaded!")
        return True
    except Exception as e:
        print(f"❌ Load Error: {e}")
        return False

# Load correctly on startup
load_model_locally()

def preprocess_image(file_stream):
    file_bytes = np.frombuffer(file_stream.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    if not damage_model:
        return jsonify({'error': 'Model not loaded'}), 503
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    try:
        img = preprocess_image(request.files['image'])
        pred = damage_model.predict(img)
        idx = np.argmax(pred)
        return jsonify({
            'prediction': LABELS[idx],
            'confidence': float(np.max(pred))
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'running', 'model_loaded': damage_model is not None})

if __name__ == '__main__':
    app.run(port=5000)
"""

# Write script to file
with open('app_colab.py', 'w') as f:
    f.write(code)

# --- 4. Run Server & Tunnel ---
# Start the Flask app in the background
get_ipython().system_raw('python app_colab.py &')

# Open Ngrok Tunnel
try:
    public_url = ngrok.connect(5000).public_url
    print(f"🚀 YOUR PUBLIC URL IS: {public_url}")
    print("Copy this URL and paste it into your local backend/damage_detection.py")
except Exception as e:
    print(f"Ngrok Error: {e}")
