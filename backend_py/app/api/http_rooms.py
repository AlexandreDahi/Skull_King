from fastapi import APIRouter
from pydantic import BaseModel
from app.managers import roomManager, manager
import uuid


router = APIRouter(prefix="/api")


class CreateRoomRequest(BaseModel):
    roomName: str
    hostName: str

class JoinRoomRequest(BaseModel):
    playerName: str

@router.post("/rooms")
async def create_room(payload: CreateRoomRequest):
    new_room = roomManager.create_room(
        room_name=payload.roomName,
        host_name=payload.hostName
    )
    return {
        "roomUuid": str(new_room.uuid),
        "hostUuid": str(new_room.host.uuid),
        "hostToken": new_room.host.token,
        "roomName": new_room.name,
        "hostIsAdmin": new_room.host.is_admin
    }

@router.get("/rooms")
async def get_rooms():
    rooms = roomManager.list_rooms()  # fonction à créer côté manager
    # Retourne une liste simple de dicts (JSON serializable)
    return [
        {
            "room_uuid": room.uuid,
            "room_name": room.name,
            "host_name": room.host.name,
            "nb_players": len(room.guests_list)+1  # +1 pour le host
        }
        for room in rooms
    ]

@router.get("/rooms/{room_uuid}/players")
async def get_room_players(room_uuid: str):
    room = roomManager.get_room(room_uuid)
    if room:
        return {
            "players": [room.host, *room.guests_list]
        }
    return {"players": []}

@router.get("/rooms/{room_uuid}/room_name")
async def get_room_name(room_uuid: str):
    room = roomManager.get_room(room_uuid)
    if room:
        return {
            "room_uuid": room_uuid,
            "room_name": room.name
        }
    return {"room_uuid": room_uuid, "room_name": None}

@router.put("/rooms/{room_uuid}/join")
async def join_room(room_uuid: str, payload: JoinRoomRequest):
    room = roomManager.get_room(room_uuid)
    if not room:
        return {"error": "Room not found"}, 404
    
    # Ajouter le joueur comme guest
    guest = roomManager.add_guest(room_uuid, payload.playerName)
    
    if not guest:
        return {"error": "Failed to add guest to room"}, 400
    
    return {
        "room_uuid": room_uuid,
        "player_uuid": str(guest.uuid),
        "player_name": guest.name,
        "token": guest.token,
        "is_admin": guest.is_admin
    }

@router.delete("/rooms/{room_uuid}/leave")
async def leave_room(room_uuid: str, playerUuid: str):
    room = roomManager.get_room(room_uuid)
    if not room:
        return {"error": "Room not found"}, 404
    
    try:
        if room.host.uuid == uuid.UUID(playerUuid):
            # Si c'est l'host qui quitte alors le dexième joueur devient host, sinon la room est supprimée
            if room.guests_list:
                new_host = room.guests_list[0]
                room.host = new_host
                room.guests_list = room.guests_list[1:]
                print(f"👋 Host {playerUuid} a quitté la room {room_uuid}. Nouveau host: {new_host.name} ({new_host.uuid})")
                
                # Notifier les autres joueurs via WebSocket
                await manager.broadcast_to_lobby(room_uuid, {
                    "type": "HOST_LEFT",
                    "message": f"Host has left, new host is {new_host.name}",
                    "new_host_uuid": str(new_host.uuid),
                    "room_uuid": room_uuid
                })
            else:
                roomManager.delete_room(room_uuid)
            
        # Retirer le joueur
        player_uuid = uuid.UUID(playerUuid)
        room.delete_guest(player_uuid)
        
        print(f"👋 Joueur {playerUuid} a quitté la room {room_uuid}")
        
        # Notifier les autres joueurs via WebSocket
        remaining_players = room.get_players()
        await manager.broadcast_to_lobby(room_uuid, {
            "type": "PLAYER_LEFT",
            "player_uuid": playerUuid,
            "players_count": len(remaining_players)
        })
        
        return {"message": "Player left room", "room_uuid": room_uuid}
    except Exception as e:
        print(f"❌ Erreur lors du départ du joueur: {e}")
        return {"error": str(e)}, 400

