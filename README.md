# AI Object Recognition System

An AI-based image description system that captures images, processes them using AI, and converts the generated descriptions into voice output.

## Features
- Image capture and upload
- AI-powered image description using Gemini AI
- Text-to-speech conversion of descriptions
- Simple web interface (HTML, CSS, JavaScript)

## Tech Stack
- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript
- **AI:** Gemini AI (Google)

## How It Works
1. User uploads/captures an image
2. Image is sent to the backend
3. Gemini AI generates a description of the image
4. Description is converted to speech and played back

## Installation

```bash
git clone https://github.com/harshitmahara28-jpg/ai-object-recognition-system.git
cd ai-object-recognition-system
pip install -r requirements.txt
python app.py
```

## Usage
1. Run the Flask server
2. Open `index.html` in your browser (or visit `localhost:5000`)
3. Upload an image and get its description with voice output

## Screenshots
![App Screenshot](Screenshot%202026-04-27%20152339.png)

## Future Improvements
- Multi-language support
- Real-time camera detection
- Improved accuracy for complex images

## Author
Harshit Mahara