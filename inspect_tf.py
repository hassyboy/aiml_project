
import sys
try:
    import tensorflow as tf
    print(f"TensorFlow Version: {tf.__version__}")
    print(f"Has keras attribute? {'keras' in dir(tf)}")
except ImportError as e:
    print(f"Failed to import tensorflow: {e}")

try:
    import keras
    print(f"Keras Version: {keras.__version__}")
except ImportError as e:
    print(f"Failed to import keras: {e}")

try:
    from tensorflow import keras as tf_keras
    print("Successfully imported tensorflow.keras")
except ImportError as e:
    print(f"Failed to import tensorflow.keras: {e}")
