import os
import requests

# Configuration for the microservice
# Read from colab_url.txt file for easy updating
try:
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'colab_url.txt')
    with open(config_path, 'r') as f:
        SERVICE_URL = f.read().strip().rstrip('/')
except Exception:
    SERVICE_URL = "http://localhost:5001" # Fallback setup

print(f"🔗 Damage Service Configured at: {SERVICE_URL}") 
# SERVICE_URL = "https://YOUR-NGROK-URL.ngrok-free.app"

def load_damage_model():
    """
    Checks if the microservice is running.
    """
    try:
        # Ngrok free tier requires a special header to skip the warning page
        headers = {"ngrok-skip-browser-warning": "true"}
        response = requests.get(f"{SERVICE_URL}/status", headers=headers, timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data.get('model_loaded'):
                print(f"✅ Connection established to Damage Service at {SERVICE_URL}")
                return True
            else:
                print(f"⚠️ Damage Service reachable, but model is NOT loaded.")
                return False
        else:
            print(f"⚠️ Damage Service returned status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to Damage Service at {SERVICE_URL}. Is it running?")
        return False
    except Exception as e:
        print(f"❌ Error checking Damage Service: {e}")
        return False

def predict_damage(image_file):
    """
    Forwards the image to the independent microservice for prediction.
    """
    try:
        # Reset file pointer to beginning if it was read previously
        image_file.seek(0)
        
        # files dictionary for requests
        # We need to send the file content. 
        # image_file is likely a Werkzeug FileStorage object from Flask
        files = {'image': (image_file.filename, image_file.read(), image_file.content_type)}
        
        # Ngrok free tier requires a special header to skip the warning page
        headers = {"ngrok-skip-browser-warning": "true"}
        response = requests.post(f"{SERVICE_URL}/predict", files=files, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': f"Service Error ({response.status_code}): {response.text}"}
            
    except requests.exceptions.ConnectionError:
        return {'error': "Damage functionality is unavailable. Please ensure the 'damage_service.py' is running."}
    except Exception as e:
        return {'error': f"Bridge Error: {str(e)}"}

def get_model_status():
    try:
        headers = {"ngrok-skip-browser-warning": "true"}
        response = requests.get(f"{SERVICE_URL}/status", headers=headers, timeout=1)
        if response.status_code == 200:
            return response.json()
        else:
            return {'status': 'error', 'message': f"Service returned {response.status_code}"}
    except Exception as e:
        return {'status': 'disconnected', 'message': str(e)}
