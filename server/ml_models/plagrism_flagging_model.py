import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import gridfs
from pymongo import MongoClient, errors
from io import BytesIO
from PIL import Image

# Connect to MongoDB
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    db = client["art_plagiarism"]
    fs = gridfs.GridFS(db)
    client.server_info()  # Trigger exception if connection fails
except errors.ServerSelectionTimeoutError as err:
    print(f"MongoDB connection failed: {err}")
    exit(1)

# Function to load images from MongoDB
def load_images_from_gridfs(artist_name):
    images = []
    try:
        for file in db.fs.files.find({"metadata.artist": artist_name}):
            file_id = file["_id"]
            image_data = fs.get(file_id).read()
            image = Image.open(BytesIO(image_data)).convert("RGB")
            image = image.resize((224, 224))  # Resize for ResNet
            images.append(np.array(image) / 255.0)  # Normalize
    except Exception as e:
        print(f"Error loading images from GridFS: {e}")
        return np.array([])
    return np.array(images)

# Custom ResNet model
def create_model():
    try:
        base_model = keras.applications.ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))
        base_model.trainable = True
        model = keras.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dense(256, activation='relu'),
            layers.Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model
    except Exception as e:
        print(f"Error creating model: {e}")
        return None

# Training function
def train_model(artist_name):
    images = load_images_from_gridfs(artist_name)
    if images.size == 0:
        print("No images found or error occurred during loading. Training aborted.")
        return None
    
    labels = np.zeros(len(images))  # Placeholder (Adjust with real labels)
    
    model = create_model()
    if model is None:
        print("Model creation failed. Training aborted.")
        return None
    
    try:
        model.fit(images, labels, epochs=5, batch_size=8)
        model.save("plagiarism_model.h5")  # Save model for API
        print("Model training completed successfully.")
    except Exception as e:
        print(f"Error during model training: {e}")
    return model

# Example usage
model = train_model("Artist_Name")
