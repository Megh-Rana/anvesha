import joblib
import json
import numpy as np
import os

# --- Configuration ---
MODEL_FILENAME = "aptitude_model_22q.joblib"
COLUMNS_FILENAME = "aptitude_model_22q.joblib_columns.joblib"
EXPORT_FILENAME = "model.json"

print("--- Scikit-learn Model Exporter ---")

# --- 1. Load the trained model and columns ---
if not os.path.exists(MODEL_FILENAME):
    print(f"Error: Model file '{MODEL_FILENAME}' not found.")
    print("Please run your training script first to create the model file.")
    exit()

print(f"Loading model from '{MODEL_FILENAME}'...")
model = joblib.load(MODEL_FILENAME)
model_columns = joblib.load(COLUMNS_FILENAME)

# --- 2. Extract the structure of each decision tree ---
exported_trees = []
for estimator in model.estimators_:
    tree = estimator.tree_
    
    # The tree's structure is stored in several arrays.
    # We convert them to lists for JSON compatibility.
    tree_data = {
        "children_left": tree.children_left.tolist(),
        "children_right": tree.children_right.tolist(),
        "feature": tree.feature.tolist(),
        "threshold": tree.threshold.tolist(),
        # Squeeze and tolist to make it a clean list of lists
        "value": np.squeeze(tree.value, axis=1).tolist()
    }
    exported_trees.append(tree_data)

# --- 3. Create the final export object ---
export_data = {
    "trees": exported_trees,
    "classes": model.classes_.tolist(),
    "columns": model_columns # The one-hot encoded column names
}

# --- 4. Save the data to a JSON file ---
print(f"Exporting model structure to '{EXPORT_FILENAME}'...")
with open(EXPORT_FILENAME, 'w') as f:
    json.dump(export_data, f)

print("\nSuccess! Model exported.")
print(f"Now, add '{EXPORT_FILENAME}' to your website's folder and update your script.js.")

