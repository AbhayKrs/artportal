from flask import Flask,request,app, jsonify, redirect
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)

## Load the model
loaded_model = tf.keras.models.load_model('saved_models/artportal_model_v1_01.h5');

@app.route('/')
def home():
    return redirect('https://artportal.onrender.com')

@app.route('/predict_api', methods=['POST'])
def predict_api():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No file part in the requst"}), 400

        imgfile = request.files['image']
        img = np.array(Image.open(imgfile.stream))

        # Debugging: Print shape and type of the image
        print(f"Original image shape: {img.shape}, dtype: {img.dtype}")
        
        resize_img = tf.image.resize(img, (256, 256))
        expanded_img = np.expand_dims(resize_img, 0)

        # Debugging: Print shape of the resized and expanded image
        print(f"Expanded image shape: {expanded_img.shape}")

        predicted = loaded_model.predict(expanded_img)
        
        # Debugging: Print the raw predictions
        print(f"Raw model predictions: {predicted}")
        
        predicted_class = ['abstract_art', 'architectural_art', 'characterdesign_art', 'concept_art', 'environmental_art', 'mature_art', 'traditional_art']
        predications_final = list(predicted[0])

        p_ind = []
        final = []

        for idx, category in enumerate(predicted_class):
            p_ind.append(idx);
            if len(p_ind) > 2:
                p_ind.sort(key=lambda x: predications_final[x], reverse=True)
                p_ind.pop();
            print(category, '-----', format(predications_final[idx], '.3f'))

        for i in p_ind:
            final.append(predicted_class[i])

        return jsonify(final)
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Print error to server logs
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)