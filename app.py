import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import os

# --- STEP 1: INITIALIZE FLASK FIRST ---
app = Flask(__name__)

# Enhanced CORS to make sure your browser never blocks the request
CORS(app, resources={r"/*": {"origins": "*"}}) 

# --- STEP 2: CONFIGURE GEMINI ---
# Your API Key
genai.configure(api_key="AIzaSyCq5jL_zOgHQ476Pl0F4sIG7MeQffm7xp0")

# Fetch all models available to your specific API key
try:
    available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    print("Available models:", available_models)

    # Logic to pick the best model without crashing
    if any('gemini-1.5-flash' in m for m in available_models):
        model_name = 'models/gemini-1.5-flash'
        print("Using Flash (Fastest)")
    elif any('gemini-1.5-pro' in m for m in available_models):
        model_name = 'models/gemini-1.5-pro'
        print("Using Pro (Stable)")
    elif any('gemini-pro-vision' in m for m in available_models):
        model_name = 'models/gemini-pro-vision'
        print("Using Legacy Pro Vision")
    else:
        # Fallback to the very first available model if others aren't found
        model_name = available_models[0]
        print(f"Using fallback: {model_name}")

    model = genai.GenerativeModel(model_name)
    print(f"Successfully connected to: {model.model_name}")
    print("Model loaded successfully!")

except Exception as e:
    print(f"Error during model initialization: {e}")

# --- STEP 3: DEFINE THE ANALYZE ROUTE ---
@app.route('/analyze', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({"status": "error", "message": "No image received"})

        print("Image data received! Length:", len(image_data))
        
        # 1. Clean the Base64 string
        # We split by the comma to remove the 'data:image/jpeg;base64,' header
        header, encoded = image_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        
        # 2. Convert to PIL Image
        img = Image.open(io.BytesIO(image_bytes))
        
        # 3. Ask Gemini
        response = model.generate_content([
            "Provide a concise, one-sentence description of the main object or person in this image for a voice assistant.", 
            img
        ])
        
        print("AI Result:", response.text)
        
        return jsonify({
            "status": "success",
            "message": response.text
        })
    except Exception as e:
        print("Error details:", str(e))
        return jsonify({"status": "error", "message": str(e)})

# --- STEP 4: RUN THE SERVER ---
if __name__ == '__main__':
    # Running on 0.0.0.0 helps tunnels (like Serveo/Pinggy) find the port
    app.run(host='0.0.0.0', port=5000, debug=True)