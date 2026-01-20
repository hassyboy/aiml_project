import h5py
import json
import os

model_path = 'backend/tourism_damage_detector.h5'
output_path = 'backend/model_config.json'

try:
    with h5py.File(model_path, 'r') as f:
        config_str = f.attrs.get('model_config')
        if config_str is None:
            print("No model_config found in attributes.")
        else:
            if isinstance(config_str, bytes):
                config_str = config_str.decode('utf-8')
            
            config = json.loads(config_str)
            with open(output_path, 'w') as json_file:
                json.dump(config, json_file, indent=2)
            print(f"Config successfully extracted to {output_path}")

except Exception as e:
    print(f"Error extracting config: {e}")
