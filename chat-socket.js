
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("ws://localhost:3001", { transports : ['websocket'] })
const detections = document.getElementById('detections');

socket.on('detectionCreated', (detection) => {
  handleNewDetection(detection);
})

socket.on('activeDetections', (detections) => {
  clearDetections();
  detections.forEach(detection => {
    handleNewDetection(detection);
  });
})

const handleNewDetection = (detection) => {
  detections.appendChild(buildNewDetection(detection));
}

socket.on('detectionClosed', (detectionId) => {
  removeClosedDetection(detectionId);
})

const removeClosedDetection = (detectionId) => {
  const items = detections.getElementsByTagName('li');
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.textContent.includes(`Detection id: ${detectionId}`)) {
      detections.removeChild(item);
      break;
    }
  }
};

const buildNewDetection = (detection) => {
  console.log(detection)
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(`Detection:${JSON.stringify(detection, null, 4)}`))
  return li;
}

const clearDetections = () => {
    detections.innerHTML = '';
}
