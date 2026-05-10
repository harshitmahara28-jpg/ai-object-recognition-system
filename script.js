const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('start-btn');
const resultText = document.getElementById('result-text');
const repeatBtn = document.getElementById('repeat-btn');

// 1. Access the BACK webcam (environment)
navigator.mediaDevices.getUserMedia({ 
    video: { 
        facingMode: "environment" 
    } 
})
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    // This part runs on your Laptop since it has no "back" camera
    console.warn("Back camera not found, switching to default:", err);
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        });
});

startBtn.addEventListener('click', () => {
    resultText.innerText = "Scanning object...";
    
    const context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    context.drawImage(video, 0, 0, 640, 480);

    const imageData = canvas.toDataURL('image/png',0.5);
    
    // Using 127.0.0.1 is often more stable than 'localhost' on Windows
    // This works on Mobile OR PC because it's a "Relative Path"
    fetch('http://127.0.0.1:5000/analyze', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
})
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        resultText.innerText = "AI Says: " + data.message;
        const utterance = new SpeechSynthesisUtterance(data.message);
        window.speechSynthesis.speak(utterance);
    })
    .catch(err => {
        resultText.innerText = "Error: Backend not running. Check your Python terminal!";
        console.error("Connection error:", err);
    });
});
// YE BLOCK SABSE NICHE PASTE KAR DO
repeatBtn.onclick = () => {
    if (resultText.textContent && resultText.textContent !== "System Ready...") {
        const speech = new SpeechSynthesisUtterance(resultText.textContent);
        window.speechSynthesis.speak(speech);
    } else {
        const errorSpeech = new SpeechSynthesisUtterance("No description to repeat.");
        window.speechSynthesis.speak(errorSpeech);
    }
};