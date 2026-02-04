
from typing import Dict
from app.entities import Room
from app.entities import Player


class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Room] = {}
    
    def create_room(self, room_name: str, host_name: str) -> Room :
        hosting_player = Player(name=host_name, is_admin=True)
        new_room = Room(name=room_name, host=hosting_player)
        self.rooms[str(new_room.uuid)] = new_room
        return new_room
    
    
    def get_room(self, room_uuid: str) -> Room:
        return self.rooms.get(room_uuid)
    
    def delete_room(self, room_uuid: str) -> None:
        if room_uuid in self.rooms:
            del self.rooms[room_uuid]
    
    def list_rooms(self) -> Dict[str, Room]:
        return list(self.rooms.values())

### Création de l'instance roomManager globale
roomManager = RoomManager()