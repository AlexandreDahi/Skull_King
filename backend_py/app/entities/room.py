import uuid
from typing import List

from app.entities.player import Player
from app.entities.game import Game


class Room:
    def __init__(self, name: str, host: Player):
        self.uuid: uuid.UUID = uuid.uuid4()
        self.name: str = name

        self.host: Player = host
        self.guests_list: List[Player] = []

        self.game: Game = Game()

    def add_guest(self, player: Player) -> None:
        if player not in self.guests_list:
            self.guests_list.append(player)

    def delete_guest(self, player_uuid: uuid.UUID) -> None:
        self.guests_list = [
            p for p in self.guests_list if p.uuid != player_uuid
        ]

    def count_players(self) -> int:
        return 1 + len(self.guests_list)
    
    def players(self)-> List[Player]:
        return [self.host] + self.guests_list


    def get_players(self) -> List[Player]:
        # on retourne une COPIE pour éviter les effets de bord
        players = self.guests_list.copy()
        players.append(self.host)
        return players

    def get_player_by_token(self, token: str) -> Player | None:
        if self.host.token == token:
            return self.host
        for guest in self.guests_list:
            if guest.token == token:
                return guest
        return None
    
    def get_player_by_uuid(self, player_uuid: uuid.UUID) -> Player | None:
        if self.host.uuid == player_uuid:
            return self.host
        for guest in self.guests_list:
            if guest.uuid == player_uuid:
                return guest
        return None
