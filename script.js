const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('start-btn');
const resultText = document.getElementById('result-text');
const repeatBtn = document.getElementById('repeat-btn');
const historyList = document.getElementById('history-list');

let lastMessage = "";

// Camera: try back camera, fall back to default, show clear errors
function showCameraError(err) {
  console.error("Camera error:", err);
  if (err.name === "NotAllowedError") {
    resultText.innerText = "Camera access denied. Please allow camera permission.";
  } else if (err.name === "NotFoundError") {
    resultText.innerText = "No camera found on this device.";
  } else {
    resultText.innerText = "Could not start camera: " + err.message;
  }
  startBtn.disabled = true;
}

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => { video.srcObject = stream; })
  .catch(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { video.srcObject = stream; })
      .catch(showCameraError);
  });

function addToHistory(message) {
  const li = document.createElement('li');
  const time = document.createElement('span');
  time.textContent = new Date().toLocaleTimeString();
  li.appendChild(time);
  li.appendChild(document.createTextNode(message));
  historyList.prepend(li); // newest on top
}

startBtn.addEventListener('click', () => {
  resultText.innerText = "Scanning object...";

  const context = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 480;
  context.drawImage(video, 0, 0, 640, 480);
  const imageData = canvas.toDataURL('image/png', 0.5);

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
      lastMessage = data.message;
      resultText.innerText = "AI Says: " + data.message;
      addToHistory(data.message);
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.message));
    })
    .catch(err => {
      resultText.innerText = "Error: Backend not running. Check your Python terminal!";
      console.error("Connection error:", err);
    });
});

repeatBtn.onclick = () => {
  const text = lastMessage || "No description to repeat.";
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};