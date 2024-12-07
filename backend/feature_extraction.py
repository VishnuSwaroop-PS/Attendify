# feature_extraction.py

import dlib
import csv
import numpy as np
import cv2
import os
import logging

def initialize_dlib_models(path_dlib):
    """Initialize Dlib models."""
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(os.path.join(path_dlib, 'shape_predictor_68_face_landmarks.dat'))
    face_reco_model = dlib.face_recognition_model_v1(os.path.join(path_dlib, 'dlib_face_recognition_resnet_model_v1.dat'))
    return detector, predictor, face_reco_model

def return_128d_features(path_img, detector, predictor, face_reco_model):
    """Extract 128D features from an image."""
    img_rd = cv2.imread(path_img)
    faces = detector(img_rd, 1)

    logging.info(f"Image with faces detected: {path_img}")

    if len(faces) != 0:
        shape = predictor(img_rd, faces[0])
        face_descriptor = face_reco_model.compute_face_descriptor(img_rd, shape)
    else:
        face_descriptor = np.zeros(128)  # Ensure it returns an array
        logging.warning("No face detected")
    return face_descriptor

def return_features_mean_personX(image_path, detector, predictor, face_reco_model):
    """Calculate mean 128D features for a single image."""
    features_list_personX = []
    features_128d = return_128d_features(image_path, detector, predictor, face_reco_model)
    features_list_personX.append(features_128d)

    if features_list_personX:
        features_mean_personX = np.mean(features_list_personX, axis=0)
    else:
        features_mean_personX = np.zeros(128)
    return features_mean_personX

def save_features_to_csv(features, name, features_file):
    """Save features to a CSV file, including name as the first column."""
    try:
        with open(features_file, "a", newline="") as csvfile:
            writer = csv.writer(csvfile)
            row = [name] + features.tolist()
            writer.writerow(row)
            logging.info("Saved features for %s", name)
    except Exception as e:
        raise Exception(f"Failed to save features: {e}")