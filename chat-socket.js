
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("ws://localhost:3001", { transports : ['websocket'] })

const message = document.getElementById('message');
const messages = document.getElementById('messages');
socket.on('detectionUpdate', (detection) => {
  handleNewMessage(detection);
})

const handleNewMessage = (detection) => {
  messages.appendChild(buildNewMessage(detection));
}

const buildNewMessage = (detection) => {
  console.log(detection)
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(`Detection id: ${ detection.detectionId}; Category: ${detection.category}; Status:${detection.status.statusId}; Timestamp:${detection.timestamp}`))
  return li;
}
