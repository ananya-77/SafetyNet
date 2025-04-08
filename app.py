import pickle
import numpy as np
import librosa
import logging
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__, template_folder="templates", static_folder="static", static_url_path="/static")

# Configure logging
logging.basicConfig(level=logging.INFO)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["SafetyNet"]
collection = db["gunshot_reports"]

# Load the trained ML model
try:
    with open("gunshot_detector.pkl", "rb") as model_file:
        model = pickle.load(model_file)
        logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {str(e)}")
    model = None  # Handle case when model isn't available

# Home Route - Loads Main Page
@app.route("/")
def home():
    return render_template("index.html")

# Report Page Route
@app.route("/report")
def report():
    return render_template("report.html")

# Test Page Route
@app.route("/test")
def test():
    return render_template("test.html")

# Profile Page Route
@app.route("/profile")
def profile():
    return render_template("profile.html")

# API to Predict Gunshot Sound
@app.route("/predict", methods=["POST"])
def predict():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files["audio"]

    try:
        # Load audio and extract features
        y, sr = librosa.load(audio_file, sr=None)
        
        # Feature extraction: Mean & Standard Deviation
        feature = np.array([np.mean(y), np.std(y), np.max(y), np.min(y)]).reshape(1, -1)

        # Ensure model is loaded before prediction
        if model:
            prediction = model.predict(feature)[0]
            result = "Gunshot Detected" if prediction == 1 else "No Gunshot"

            # Save result to MongoDB with timestamp
            detection_data = {
                "result": result,
                "timestamp": datetime.utcnow()
            }
            collection.insert_one(detection_data)

            return jsonify({"prediction": result, "timestamp": detection_data["timestamp"]})
        else:
            return jsonify({"error": "Model not loaded"}), 500
    except Exception as e:
        logging.error(f"Error processing audio: {str(e)}")
        return jsonify({"error": "Failed to process audio"}), 500

# API to Fetch Saved Reports
@app.route("/get_reports", methods=["GET"])
def get_reports():
    reports = list(collection.find({}, {"_id": 0}))  # Convert to list, exclude MongoDB ID
    return jsonify(reports)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
