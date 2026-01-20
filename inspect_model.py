
import os
import sys

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
except ImportError:
    print("ERROR: TensorFlow is not installed in this environment.")
    sys.exit(1)

model_path = r"C:\Users\91866\Downloads\tourism_damage_detector.h5"

if not os.path.exists(model_path):
    print(f"ERROR: File not found at {model_path}")
    sys.exit(1)

try:
    print(f"Loading model from {model_path}...")
    model = load_model(model_path)
    
    print("\n--- MODEL SUMMARY ---")
    print(f"Input Shape: {model.input_shape}")
    print(f"Output Shape: {model.output_shape}")
    
    # Try to determine task type based on output
    output_dim = model.output_shape[-1]
    if output_dim == 1:
        print("Task Type: Likely Binary Classification (1 output node)")
    else:
        print(f"Task Type: Likely Multi-class Classification ({output_dim} classes)")
        
    print("\n--- LAYER DETAILS ---")
    for i, layer in enumerate(model.layers):
        print(f"{i}: {layer.name} ({layer.__class__.__name__})")
        
    print("\nSUCCESS: Model loaded successfully.")

except Exception as e:
    print(f"\nERROR: Failed to load model. Reason: {e}")
