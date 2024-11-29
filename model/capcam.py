import os
from pathlib import Path
from typing import Optional
from datetime import datetime
import cv2 as cv
import numpy as np
from ultralytics import YOLO
from time import time, sleep
from typing import Optional, Dict
import random
import math
from collections import defaultdict

import socketio

# Cria uma instância do cliente Socket.IO
sio = socketio.Client()
import numpy as np

import time
import os
from typing import Optional
from datetime import datetime
import cv2 as cv
import numpy as np
from ultralytics import YOLO
from time import time
from typing import Optional, Dict

import socketio

# Cria uma instância do cliente Socket.IO
sio = socketio.Client()
import numpy as np

import time

def main(directory: str, fire_model_path: Optional[str] = None, arma_model_path: Optional[str] = None, alag_model_path: Optional[str] = None, picha_model_path: Optional[str] = None, image_folder: str = "detections") -> None:
    get_websocket_connection('http://localhost:3000');
    
    start_time = time.time();

    if not os.path.exists(directory):
        print(f"O diretório '{directory}' não existe.")
        return

    # Carrega os modelos
    fire_model = YOLO(fire_model_path)
    arma_model = YOLO(arma_model_path)
    alag_model = YOLO(alag_model_path)
    picha_model = YOLO(picha_model_path)

    i = 0
    for filename in os.listdir(directory):
        i += 1
        camera_name = filename.split('f')[0].split(".")[0]
        # camera_name = "camera1"
        file_path = os.path.join(directory, filename)
        screenshot = cv.imread(file_path)

        # Captura o timestamp atual
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Processa com o modelo 1
        results = fire_model(screenshot)
        results2 = arma_model(screenshot)

        if len(results[0].boxes) > 0:
            annotated_framemod1 = results[0].plot()
            send_detection(results, date, camera_name, annotated_framemod1)
           
        if len(results2[0].boxes) > 0:
            annotated_framemod2 = results2[0].plot()
            send_detection(results, date, camera_name, annotated_framemod2)
           
        if i % 600 == 0:
            results3 = alag_model(screenshot)
            results4 = picha_model(screenshot)
            if len(results3[0].boxes) > 0:
                annotated_framemod3 = results3[0].plot()
                send_detection(results, date, camera_name, annotated_framemod3)

            if len(results4[0].boxes) > 0:
                annotated_framemod4 = results4[0].plot()
                send_detection(results, date, camera_name, annotated_framemod4)
    
        os.remove(file_path)
    end_time = time.time() 
    execution_time = end_time - start_time 
    print(f"Tempo de execução: {execution_time} segundos")
    disconnect_websocket()

def send_detection(results, date: str, camera_name: str, frame_array: np.ndarray ):
    frame_bytes = get_frame_bytes(frame_array)
    detection_data = get_detection_data(results, date, camera_name)
    sio.emit('new_detection', {'detectionData': detection_data, 'frame': frame_bytes})

def get_frame_bytes(frame_array):
    is_success, encoded_frame = cv.imencode('.png', frame_array)
    if is_success:
        frame_bytes = encoded_frame.tobytes()
        return frame_bytes
    return

def get_detection_data(results, date: str, camera_name: str) -> dict: 
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class": int(box.cls),  # Classe detectada
            })
    data = {
        "timestamp": date,
        "detections": detections,
        "camera": camera_name, 
    }
    return data


def get_websocket_connection(url):
    while True:  # Loop de reconexão
        try:
            # Conecta ao servidor Socket.IO
            sio.connect(url, transports=['websocket'])
            break  # Sai do loop se a conexão for bem-sucedida
        except Exception:
            print('Erro ao conectar ao servidor Socket.IO. Tentando novamente...')
            
            
def disconnect_websocket():  
    sio.disconnect()
    

# Define um evento que será chamado quando a conexão for estabelecida
@sio.event
def connect():
    print('Conectado ao servidor, meu SID é:', sio.sid)

# Define um evento para lidar com desconexões
@sio.event
def disconnect():
    print('Desconectado do servidor')
    

if __name__ == "__main__":
    main(
        directory="./frames",
        fire_model_path="./fogo.pt",
        arma_model_path="./arma.pt",
        alag_model_path="./alag.pt",
        picha_model_path="./picha.pt"
    )
