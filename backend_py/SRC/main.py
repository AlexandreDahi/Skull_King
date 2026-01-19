from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict

app = FastAPI()

rooms: Dict[str, list[WebSocket]] = {}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            print(f"Room {room_id} | Reçu :", data)

            # Broadcast à tous les joueurs de la room
            for client in rooms[room_id]:
                await client.send_json(data)

    except WebSocketDisconnect:
        rooms[room_id].remove(websocket)
        print("Joueur déconnecté")
