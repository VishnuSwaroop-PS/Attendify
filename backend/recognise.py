# recognise.py

import dlib
import numpy as np
import cv2
import os
import logging
import pandas as pd

def initialize_dlib_models(path_dlib):
    """Initialize Dlib models."""
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(os.path.join(path_dlib, 'shape_predictor_68_face_landmarks.dat'))
    face_reco_model = dlib.face_recognition_model_v1(os.path.join(path_dlib, 'dlib_face_recognition_resnet_model_v1.dat'))
    return detector, predictor, face_reco_model

def get_face_database(features_file):
    """Load known faces from CSV file."""
    if os.path.exists(features_file):
        csv_rd = pd.read_csv(features_file, header=None)
        face_features_known_list = []
        face_name_known_list = []

        for i in range(csv_rd.shape[0]):
            features_someone_arr = []
            face_name_known_list.append(csv_rd.iloc[i][0])
            for j in range(1, 129):
                features_someone_arr.append(float(csv_rd.iloc[i][j]) if csv_rd.iloc[i][j] else 0.0)
            face_features_known_list.append(features_someone_arr)

        logging.info("Faces in Database: %d", len(face_features_known_list))
        return face_features_known_list, face_name_known_list
    else:
        logging.warning("'%s' not found!", features_file)
        return [], []

def return_euclidean_distance(feature_1, feature_2):
    """Compute the Euclidean distance between two feature vectors."""
    return np.sqrt(np.sum(np.square(np.array(feature_1) - np.array(feature_2))))

def process_frame(img_rd, detector, predictor, face_reco_model, face_features_known_list, face_name_known_list):
    """Process a single frame to detect and recognize faces."""
    faces = detector(img_rd, 0)
    face_name_list = []
    face_position_list = []
    face_feature_list = []

    for d in faces:
        shape = predictor(img_rd, d)
        face_descriptor = face_reco_model.compute_face_descriptor(img_rd, shape)
        face_feature_list.append(face_descriptor)
        face_position_list.append((d.left(), d.bottom()))
        face_name_list.append("unknown")

    for k in range(len(face_feature_list)):
        e_distances = [return_euclidean_distance(face_feature_list[k], known_feature) for known_feature in face_features_known_list]
        min_distance = min(e_distances)
        if min_distance < 0.4:
            face_name_list[k] = face_name_known_list[e_distances.index(min_distance)]

    return face_name_list, face_position_list

def run_face_recognition(stream, detector, predictor, face_reco_model, face_features_known_list, face_name_known_list):
    """Run face recognition on video stream."""
    while stream.isOpened():
        flag, img_rd = stream.read()
        if not flag:
            break

        face_names, face_positions = process_frame(img_rd, detector, predictor, face_reco_model, face_features_known_list, face_name_known_list)

        for name, pos in zip(face_names, face_positions):
            cv2.putText(img_rd, name, pos, cv2.FONT_ITALIC, 0.8, (255, 190, 0), 1, cv2.LINE_AA)
        cv2.imshow("Face Recognition", img_rd)
        
        if cv2.waitKey(1) == ord('q'):
            break

    stream.release()
    cv2.destroyAllWindows()
