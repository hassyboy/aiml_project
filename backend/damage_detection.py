import requests
import sys

# Configuration for the microservice
# REPLACE THIS WITH YOUR NGROK URL (e.g., "https://1234-56-78.ngrok-free.app")
SERVICE_URL = "https://592dabaaba6e.ngrok-free.app" 
# SERVICE_URL = "https://YOUR-NGROK-URL.ngrok-free.app"

def load_damage_model():
    """
    Checks if the microservice is running.
    """
    try:
        response = requests.get(f"{SERVICE_URL}/status", timeout=2)
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
        
        response = requests.post(f"{SERVICE_URL}/predict", files=files)
        
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
        response = requests.get(f"{SERVICE_URL}/status", timeout=1)
        if response.status_code == 200:
            return response.json()
        else:
            return {'status': 'error', 'message': f"Service returned {response.status_code}"}
    except Exception as e:
        return {'status': 'disconnected', 'message': str(e)}
