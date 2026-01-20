
import numpy as np
# Monkey patch np.object to fix compatibility issues with newer numpy versions
try:
    np.object = object
    np.bool = bool
    np.int = int
    np.float = float
    np.typeDict = np.sctypeDict
except:
    pass

import tensorflow as tf
import tensorflowjs as tfjs
import os

model_path = r"C:\Users\91866\Downloads\tourism_damage_detector.h5"
output_path = r"c:\Users\91866\Documents\new aiml\public\models\damage_detector"

print(f"Loading model from {model_path}...")
model = tf.keras.models.load_model(model_path)

print(f"Saving TFJS model to {output_path}...")
tfjs.converters.save_keras_model(model, output_path)

print("Conversion complete.")
