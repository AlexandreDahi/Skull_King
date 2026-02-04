from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.managers import manager
from app.managers import roomManager

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
            # traiter le message
    except WebSocketDisconnect:
        manager.disconnect(room_uuid, player.uuid)
