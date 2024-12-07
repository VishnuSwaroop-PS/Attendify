import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import cv2
import numpy as np
import pandas as pd
from feature_extraction import initialize_dlib_models, return_features_mean_personX, save_features_to_csv
from recognise import run_face_recognition, get_face_database, process_frame

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    try:
        os.makedirs(UPLOAD_FOLDER)
    except Exception as e:
        print(f"Failed to create directory: {e}")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/register-student', methods=['POST'])
def register_student():
    if 'capturedImage' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['capturedImage']
    name = request.form.get('name')
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and name:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        image = cv2.imread(file_path)
        if image is None:
            return jsonify({"error": "Failed to read the image"}), 500

        features = return_features_mean_personX(image)
        if not features:
            return jsonify({"error": "Failed to extract features"}), 500

        student_info = {
            "name": name,
            "features": features
        }
        save_features_to_csv(student_info, "student_data.csv")
        os.remove(file_path)  # Clean up the file after processing
        return jsonify({"message": "Student registered successfully"}), 200

    return jsonify({"error": "Invalid request"}), 400

@app.route('/upload-frame', methods=['POST'])
def upload_frame():
    if 'frame' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['frame']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    frame_path = os.path.join(app.config['UPLOAD_FOLDER'], 'frame.jpg')
    file.save(frame_path)

    img = cv2.imread(frame_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    path_dlib = os.path.join(os.path.dirname(__file__), "data", 'data_dlib')
    features_file = os.path.join(os.path.dirname(__file__), 'data', 'features_all.csv')

    if not os.path.exists(path_dlib):
        return jsonify({"error": f"Dlib data path {path_dlib} does not exist."}), 500

    detector, predictor, face_reco_model = initialize_dlib_models(path_dlib)
    face_features_known_list, face_name_known_list = get_face_database(features_file)

    try:
        face_names, face_positions = process_frame(img, detector, predictor, face_reco_model, face_features_known_list, face_name_known_list)
        
        # Prepare result in a dictionary format
        result = {
            "faces": [
                {"name": name, "position": {"x": pos[0], "y": pos[1]}} 
                for name, pos in zip(face_names, face_positions)
            ]
        }
        
        return jsonify({"message": "Face recognition completed.", "result": result}), 200
    except Exception as e:
        return jsonify({"error": f"Face recognition failed: {e}"}), 500


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(host="0.0.0.0", port=3000)
