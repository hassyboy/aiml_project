import tensorflow as tf
try:
    print(f"TF Version: {tf.__version__}")
    print(f"Compiler module: {dir(tf.compiler)}")
except Exception as e:
    print(e)
