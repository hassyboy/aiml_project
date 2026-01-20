import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
import h5py

input_config_path = 'backend/model_config.json'
original_model_path = 'backend/tourism_damage_detector.h5'
new_model_path = 'backend/tourism_damage_detector_fixed.h5'

def sanitize_config(config):
    if isinstance(config, dict):
        # Fix 1: Remove 'batch_shape'
        if 'batch_shape' in config:
            del config['batch_shape']
        
        # Fix 2: Simplify DTypePolicy
        if 'dtype' in config and isinstance(config['dtype'], dict):
            if config['dtype'].get('class_name') == 'DTypePolicy':
                # Extract the name (e.g. "float32") and use it directly
                try:
                    config['dtype'] = config['dtype']['config']['name']
                except:
                    config['dtype'] = 'float32'
        
        # Recursive processing
        for key, value in config.items():
            if key == 'layers':
                for layer in value:
                    sanitize_config(layer)
            elif key == 'config':
                sanitize_config(value)
            elif isinstance(value, (dict, list)):
                 sanitize_config(value)

    elif isinstance(config, list):
        for item in config:
            sanitize_config(item)

try:
    print("Loading config...")
    with open(input_config_path, 'r') as f:
        config = json.load(f)

    print("Sanitizing config...")
    sanitize_config(config)

    # Save sanitized config for debugging
    with open('backend/model_config_fixed.json', 'w') as f:
        json.dump(config, f, indent=2)
    print("Config sanitized and saved to backend/model_config_fixed.json")

    print("Reconstructing model from JSON...")
    # Use standard keras (tensorflow.keras)
    model = keras.models.model_from_json(json.dumps(config))
    
    print("Loading weights...")
    model.load_weights(original_model_path)
    
    print(f"Saving fixed model to {new_model_path}...")
    model.save(new_model_path)
    
    print("SUCCESS: Model fixed and saved.")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"FAILED: {e}")
