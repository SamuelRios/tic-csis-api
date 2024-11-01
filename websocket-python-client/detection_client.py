import socketio
import asyncio

# Cria uma instância do cliente Socket.IO
sio = socketio.AsyncClient()

# Define um evento que será chamado quando a conexão for estabelecida
@sio.event
async def connect():
    print('Conectado ao servidor, meu SID é:', sio.sid)

# Define um evento para lidar com desconexões
@sio.event
async def disconnect():
    print('Desconectado do servidor')


async def main():
    while True:  # Loop de reconexão
        try:
            # Conecta ao servidor Socket.IO
            await sio.connect('http://localhost:3000', transports=['websocket'])
            
            # Envia um evento 'new_detection'
            await sio.emit('new_detection', "teste")
            
            # Manter o cliente ativo por um tempo
            await asyncio.sleep(1)  # Espera por 5 segundos
            break  # Sai do loop se a conexão for bem-sucedida
        except Exception as e:
            print(f'Erro ao conectar ao socketio server. Tentando novamente...')
    
    await sio.disconnect()

# Executa a função principal em um loop de eventos
if __name__ == '__main__':
    asyncio.run(main())
