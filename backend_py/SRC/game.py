# skullking/game.py
class SkullKingGame:
    def __init__(self):
        self.players = []
        self.round = 1
        self.state = "WAITING"

    def add_player(self, player_id):
        self.players.append(player_id)

    def start_game(self):
        self.state = "PLAYING"

    def play_card(self, player_id, card):
        print(f"{player_id} joue {card}")
        # règles Skull King ici
