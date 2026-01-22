import os
import sys

import traceback
import json
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import database

# ... imports ...

app = Flask(__name__)
CORS(app)

# Setup Uploads Folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize DB
db = database.init_db()

# --- Load Models on Startup ---

# Import local modules
# (Assuming they are in the same directory, which is 'backend')
# If running from root, python backend/app.py might need path adjustment if not a package.
# But 'backend/app.py' as script means 'backend' is just a dir.
# Imports should work if we are running FROM root as `python backend/app.py` AND `backend` has __init__.py OR we add backend to sys.path.
# Alternatively, if running inside backend, direct import works.
# The user seems to run `python backend/app.py` from root `c:\Users\91866\Documents\new aiml`.
# So `backend` is a package if it has __init__, or we need to fix path.
# Let's add current directory's parent or current directory to sys.path to be safe.

sys.path.append(os.path.dirname(os.path.abspath(__file__)))


import damage_detection
import recommendation_engine

# --- Load Models on Startup ---

# --- Load Models on Startup ---

# Check connection to damage service (non-blocking, just log status)
damage_detection.load_damage_model()
recommendation_engine.load_recommendation_models()


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Forward to the microservice via the proxy module
    result = damage_detection.predict_damage(file)
    
    if 'error' in result:
         # Propagate the error code from the service if possible, defaulting to 500
        return jsonify(result), 500
    
    return jsonify(result)

@app.route('/debug-model', methods=['GET'])
def debug_model():
    # Check status of the microservice
    return jsonify(damage_detection.get_model_status())




@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/reports', methods=['POST'])
def save_report():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        file = request.files['image']
        data = request.form
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save Image
        filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Construct Document
        report = {
            "place_name": data.get('place_name', 'Unknown'),
            "district": data.get('district', 'Unknown'),
            "description": data.get('description', ''),
            "damage_type": data.get('damage_type', 'Unknown'),
            "confidence": float(data.get('confidence', 0.0)),
            "image_path": f"/uploads/{filename}",
            "timestamp": datetime.now()
        }
        
        # Save to JSON DB
        saved_report = database.save_report(report)
        return jsonify({'message': 'Report saved successfully!', 'report': saved_report})

    except Exception as e:
        print(f"Save Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        reports = database.get_all_reports()
        return jsonify(reports)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    try:
        deleted = database.delete_report(report_id)
        if deleted:
            return jsonify({'message': 'Report deleted successfully'})
        else:
            return jsonify({'error': 'Report not found'}), 404
    except Exception as e:
        print(f"Delete Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    return jsonify({'error': 'NLP model disabled for debugging'}), 503

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        user_query = data['text']
        
        recommendations = recommendation_engine.get_recommendations(user_query)
        
        return jsonify(recommendations)

    except Exception as e:
        print(f"Recommendation error: {e}")
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    # Run on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
