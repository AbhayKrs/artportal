from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()
origins = ["https://127.0.0.1:3000/", "https://artportal.onrender.com/", "http://localhost:3000/"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allowed origins
    allow_credentials=True,      # If you want to allow cookies/auth headers
    allow_methods=["*"],         # Allow all HTTP methods
    allow_headers=["*"],         # Allow all headers
)

loaded_model = tf.keras.models.load_model('categorization_agent/saved_models/artportal_model_v1_01.h5');

@app.get("/")
def api_hello():
    return {"message": "artportal agents service active!"}

# Prediction endpoint
@app.post("/predict_api")
async def predict_api(image: UploadFile = File(...)):
    try:
        if image.content_type.split('/')[0] != 'image':
            raise HTTPException(status_code=400, detail="Uploaded file is not an image")
        
        # Read image into PIL
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes))
        img_array = np.array(img)

        # Debugging
        print(f"Original image shape: {img_array.shape}, dtype: {img_array.dtype}")

        # Resize and expand dimensions
        resize_img = tf.image.resize(img_array, (256, 256))
        expanded_img = np.expand_dims(resize_img, 0)

        print(f"Expanded image shape: {expanded_img.shape}")

        # Make prediction
        predicted = loaded_model.predict(expanded_img)
        print(f"Raw model predictions: {predicted}")

        predicted_class = [
            'abstract_art', 'architectural_art', 'characterdesign_art',
            'concept_art', 'environmental_art', 'mature_art', 'traditional_art'
        ]
        predictions_final = list(predicted[0])

        # Get top 2 predictions
        top_indices = []
        final = []

        for idx, category in enumerate(predicted_class):
            top_indices.append(idx)
            if len(top_indices) > 2:
                top_indices.sort(key=lambda x: predictions_final[x], reverse=True)
                top_indices.pop()
            print(category, '-----', format(predictions_final[idx], '.3f'))

        for i in top_indices:
            final.append(predicted_class[i])

        return JSONResponse(content=final)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))