from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.managers import manager
from app.managers import roomManager
import json

router = APIRouter()

@router.websocket("/ws/rooms/{room_uuid}")

async def websocket_endpoint(
    websocket: WebSocket,
    room_uuid: str,
    player_token: str = Query(...),
):
    # Vérifie que la room existe
    room = roomManager.get_room(room_uuid)
    if not room:
        await websocket.close(code=1008)
        return
    player= room.get_player_by_token(player_token)
    if not player:
        await websocket.close(code=1008)
        return

    await manager.join_room_ws(websocket, room_uuid, player)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Traiter les différents types de messages
            if message.get('type') == 'start_game':
                # Vérifier que c'est l'admin qui lance la partie
                if player.is_admin:
                    print(f"🎮 {player.name} a lancé la partie dans {room_uuid}")
                    
                    # Notifier tous les joueurs du démarrage
                    await manager.broadcast_to_lobby(room_uuid, {
                            "type": "GAME_START_EVENT",
                            "message": "La partie a commencé !",
                            "room_uuid": room_uuid
                    })
                else:
                    await websocket.send_json({
                        "type": "error",
                        "data": {"message": "Seul l'admin peut lancer la partie"}
                    })
            
            elif message.get('type') == 'lobby':
                # Broadcast un message de lobby
                await manager.broadcast_to_lobby(room_uuid, {
                    "type": "LOBBY_UPDATE",
                    "data": message.get('data')
                })
            
            elif message.get('type') == 'public':
                # Broadcast un message public
                await manager.broadcast_to_room(room_uuid, {
                    "type": "public",
                    "data": message.get('data')
                })
            
            elif message.get('type') == 'private':
                # Envoyer un message privé
                target_uuid = message.get('data', {}).get('target_uuid')
                if target_uuid:
                    await manager.send_private_message(room_uuid, target_uuid, {
                        "type": "private",
                        "data": message.get('data')
                    })
            
    except WebSocketDisconnect:
        manager.disconnect(room_uuid, player.uuid)
