import os
import face_recognition
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Create an upload folder if it doesn't exist
UPLOAD_FOLDER = './uploads'
ADD_FOLDER = './known'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(ADD_FOLDER):
    os.makedirs(ADD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ADD_FOLDER'] = ADD_FOLDER

# Initialize known face encodings and names
known_encodings = []
known_names = []

def load_known_images():
    known_dir = './known'
    for file in os.listdir(known_dir):
        if file.endswith(('.jpg', '.jpeg', '.png')):
            path = os.path.join(known_dir, file)
            img = face_recognition.load_image_file(path)
            encodings = face_recognition.face_encodings(img)
            if len(encodings) > 0:
                known_encodings.append(encodings[0])
                known_names.append(file)  # Save the actual filename here

# Load known images when the app starts
load_known_images()

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.get_json()

    # Check if image data is in the request
    if 'image' not in data:
        return jsonify({'error': 'No image data found'}), 400
    
    image_data = data['image']
    
    # Decode the base64 image data (removing the base64 prefix)
    image_data = image_data.split(',')[1]
    image_data = base64.b64decode(image_data)
    
    # Convert to PIL image and save to a file
    image = Image.open(io.BytesIO(image_data))
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_selfie.png')
    image.save(image_path)
    
    # Load and process the uploaded image
    uploaded_image = face_recognition.load_image_file(image_path)
    uploaded_encoding = face_recognition.face_encodings(uploaded_image)
    
    if len(uploaded_encoding) == 0:
        return jsonify({'error': 'No face found in the image'}), 400
    
    # Compare the uploaded image with known faces
    results = face_recognition.compare_faces(known_encodings, uploaded_encoding[0])
    
    if any(results):
        match_index = results.index(True)
        matched_filename = known_names[match_index]  # Get the filename of the matched image
        return jsonify({'match': matched_filename})
    else:
        return jsonify({'match': 'No match found'})

@app.route('/add', methods=['POST'])
def add_image():
    data = request.get_json()

    # Check if image data is in the request
    if 'image' not in data:
        return jsonify({'error': 'No image data found'}), 400
    
    image_data = data['image']
    name = data['name'] + '.png'
    
    # Decode the base64 image data (removing the base64 prefix)
    image_data = image_data.split(',')[1]
    image_data = base64.b64decode(image_data)
    
    # Convert to PIL image and save to a file
    image = Image.open(io.BytesIO(image_data))
    image_path = os.path.join(app.config['ADD_FOLDER'], name)
    image.save(image_path)
    load_known_images()

    return jsonify({'match':name})

if __name__ == '__main__':
    app.run(debug=True)