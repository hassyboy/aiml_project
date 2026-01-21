import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"
import sys
import tensorflow as tf

print(f"TensorFlow Version: {tf.__version__}")

try:
    import tf_keras
    print(f"tf_keras installed. Version: {tf_keras.__version__}")
except ImportError:
    print("tf_keras NOT installed.")

try:
    import keras
    print(f"Keras (standalone) Version: {keras.__version__}")
except ImportError:
    print("Keras NOT installed.")

print(f"tf.keras.version: {getattr(tf.keras, '__version__', 'unknown')}")
