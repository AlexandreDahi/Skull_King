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
            
            ## ICI je devais traiter les messages lier au lencement de la partie, mais c'est à refaire
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
            
            ## ICI on gère les messages liés à la partie en cours (ex: jouer une carte, faire une annonce, etc.)
            elif message.get('type') == 'public':
                # recupération du message
                core_message = message.data

                # Message pour initialiser le début de la partie (distribution des cartes, etc.)
                if core_message.get('type') == 'GAME_STARTED':
                    print(f"🎮 La partie a commencé dans la room {room_uuid}")
                    roomManager.start_game(room_uuid)
                    # Notifier tous les joueurs du démarrage
                    await manager.broadcast_to_room(room_uuid, {
                            "type": "BETTING",
                            "message": "Tout le monde est à bord, la partie commence !",
                            "room_uuid": room_uuid,
                    })
                    await manager.send_private_messages_to_all_players(room_uuid)


            ## ICI on gère les messages privés lier à un joueur (ex: main du joueur, messages d'erreur spécifiques, etc.)
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
