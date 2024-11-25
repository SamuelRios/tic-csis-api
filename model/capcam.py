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

def main(directory: str, model_path: Optional[str] = None, model_path2: Optional[str] = None, model_path3: Optional[str] = None, model_path4: Optional[str] = None, image_folder: str = "detections") -> None:
    get_websocket_connection('http://localhost:3000');
    
    start_time = time.time();

    if not os.path.exists(directory):
        print(f"O diretório '{directory}' não existe.")
        return

    # Carrega os modelos
    model = YOLO(model_path)
    model2 = YOLO(model_path2)
    model3 = YOLO(model_path3)
    model4 = YOLO(model_path4)

    i = 0
    for filename in os.listdir(directory):
        i += 1
        camera_name = filename.split('f')[0]
        # camera_name = "camera1"
        file_path = os.path.join(directory, filename)
        screenshot = cv.imread(file_path)

        # Captura o timestamp atual
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Processa com o modelo 1
        results = model(screenshot)
        results2 = model2(screenshot)

        if len(results[0].boxes) > 0:
            annotated_framemod1 = results[0].plot()
            send_detection(results, date, camera_name, annotated_framemod1)
           
        if len(results2[0].boxes) > 0:
            annotated_framemod2 = results2[0].plot()
            send_detection(results, date, camera_name, annotated_framemod2)
           
        if i % 600 == 0:
            results3 = model3(screenshot)
            results4 = model4(screenshot)
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
        directory="C:\\Users\\mucar\\OneDrive\\Área de Trabalho\\detections\\",
        model_path="C:\\Users\\mucar\\OneDrive\\Área de Trabalho\\public-safety.pt",
        model_path2="C:\\Users\\mucar\\OneDrive\\Área de Trabalho\\public-safety.pt",
        model_path3="C:\\Users\\mucar\\OneDrive\\Área de Trabalho\\public-safety.pt",
        model_path4="C:\\Users\\mucar\\OneDrive\\Área de Trabalho\\public-safety.pt"
    )
