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

frames_path      =   "./frames"
fire_model_path  =  "./models/fogo.pt"
arma_model_path  =  "./models/arma.pt"
alag_model_path  =  "./models/alag.pt"
picha_model_path = "./models/picha.pt"

def main() -> None:
    get_websocket_connection('http://localhost:3000');
    start_time = time.time();

    if not os.path.exists(frames_path):
        print(f"O diretório '{frames_path}' não existe.")
        return

    # Carrega os modelos
    fire_model, arma_model, alag_model, picha_model = getModels()

    i = 0
    for filename in os.listdir(frames_path):
        i += 1
        camera_name = filename.split('f')[0].split(".")[0]
        # camera_name = "camera1"
        file_path = os.path.join(frames_path, filename)
        screenshot = cv.imread(file_path)

        # Captura o timestamp atual
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Processa com o modelo 1
        results_fire_model = fire_model(screenshot)
        results_arma_moedel = arma_model(screenshot)
        # dir(results_arma_moedel)
        # return False
        if len(results_fire_model[0].boxes) > 0:
            annotated_framemod1 = results_fire_model[0].plot()
        
            send_detection(results_fire_model, fire_model.names, date, camera_name, annotated_framemod1)
           
        if len(results_arma_moedel[0].boxes) > 0:
            annotated_framemod2 = results_arma_moedel[0].plot()
            send_detection(results_fire_model, fire_model.names, date, camera_name, annotated_framemod2)
           
        if i % 600 == 0:
            results_alag_model = alag_model(screenshot)
            results_picha_model = picha_model(screenshot)
            if len(results_alag_model[0].boxes) > 0:
                annotated_framemod3 = results_alag_model[0].plot()
                send_detection(results_alag_model, alag_model.names, date, camera_name, annotated_framemod3)

            if len(results_picha_model[0].boxes) > 0:
                annotated_framemod4 = results_picha_model[0].plot()
                send_detection(results_picha_model, picha_model.names, date, camera_name, annotated_framemod4)
    
        os.remove(file_path)
    end_time = time.time() 
    execution_time = end_time - start_time 
    print(f"Tempo de execução: {execution_time} segundos")
    disconnect_websocket()
    
def getModels():
        return (
            YOLO(fire_model_path),
            YOLO(arma_model_path),
            YOLO(alag_model_path),
            YOLO(picha_model_path)
        )

def send_detection(results, classeNames, date: str, camera_name: str, frame_array: np.ndarray ):
    frame_bytes = get_frame_bytes(frame_array)
    detection_data = get_detection_data(results, classeNames, date, camera_name)
    print(detection_data)
    sio.emit('new_detection', {'detectionData': detection_data, 'frame': frame_bytes})

def get_frame_bytes(frame_array):
    is_success, encoded_frame = cv.imencode('.png', frame_array)
    if is_success:
        frame_bytes = encoded_frame.tobytes()
        return frame_bytes
    return

def get_detection_data(results, classeNames, date: str, camera_name: str) -> dict: 
    detections = []
    print(classeNames)
    
    for result in results:
        for box in result.boxes:
            print(box.cls.item())
            print("alouewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
            detections.append({
                "class": classeNames[box.cls.item()],  # Classe detectada
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
    main()
