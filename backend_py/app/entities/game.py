import uuid
from typing import Dict, List, Optional
import random as rnd
import json
filename = 'C:/Users/adahi/Projects/Skull_king/backend_py/index_carte.json'

from app.entities.player import Player

class Game:
    MAX_ROUND: int = 10
    TOTALE_CARDS: int = 74

    def __init__(self):
        # Liste des joueurs
        self.players: Dict[uuid.UUID, Player] = {}

        # Les nombres de manches
        self.current_round: int = 1
        # Le nombre de tours dans la manche courante
        self.current_turn: int = 1
        self.turn_cards: Dict[uuid.UUID, int] = {}
        self.last_turn_winner: Optional[uuid.UUID] = None

        # Ordre des joueurs Pour jouer
        self.current_players_order: List[uuid.UUID] = []
        self.first_player_uuid: Optional[uuid.UUID] = None

        

        # Json contenant les cartes
        with open(filename, "r") as f:
            self.cards = json.load(f)

        

        self.game_phase: Optional[GamePhase] = None
        self.current_player: Optional[Player] = None

    # -------------------
    # Gestion des joueurs
    # -------------------
    def add_player(self, player: Player) -> None:
        self.players[player.uuid] = player

    def start_game(self) -> None:
        self.current_players_order = list(self.players.keys())
        self.first_player_uuid = rnd.choice(self.current_players_order)
        self.player_round_order(self.first_player_uuid)
        self.give_players_cards(list(self.players.values()))
        

    
  
    def player_round_order(self,player_uuid) -> None:
        beginer_index = self.current_players_order.index(player_uuid)
        self.current_players_order = self.current_players_order[beginer_index:] + self.current_players_order[:beginer_index]
    
    def give_players_cards(self, players_list: List[Player]) -> None:
        # Création d'un deck complet
        deck = list(range(1, self.TOTALE_CARDS + 1))
        rnd.shuffle(deck)  # Mélanger le deck
        for turn in range(1, self.current_round + 1):
            for player in players_list:
                if deck:  # Vérifie qu'il reste des cartes
                    card = deck.pop()  # Retire la dernière carte du deck
                    player.give_cards([card])
                else:
                    print("Plus de cartes disponibles !")
                    return
    
    def set_bet_for_player(self, Bet: dict) -> None:
        # Bet : dictionnaire {player_uuid: bet, ...}

        for player_uuid, bet in Bet.items():  # itère sur le dict
            if player_uuid in self.players:
                self.players[player_uuid].set_bet(bet, self.current_round)
            else:
                print(f"Joueur {player_uuid} non trouvé.")


    def get_card_by_id(self, card_id: int) -> dict:
        return self.cards.get(str(card_id))
    
    def is_card_legal(self, player_uuid: uuid.UUID, card: int, turn_cards: List[int]) -> bool:
        # Vérifie si la carte appartient au joueur
        if player_uuid not in self.players:
            print(f"Joueur {player_uuid} non trouvé.")
            return False
        player = self.players[player_uuid]
        if card not in player.get_cards():
            print(f"La carte {card} n'appartient pas au joueur {player_uuid}.")
            return False
        if len(turn_cards) == 0:
            return True  # Première carte jouée, aucune restriction
        turn_cards = [self.get_card_by_id(c) for c in turn_cards]
        card_to_play = self.get_card_by_id(card)
        # Vérifie la légalité de la carte jouée

        for played_card in turn_cards:
            if played_card['type'] == 'fuite':
                continue  # Ignore les cartes de fuite
            if played_card['type'] == 'special' or played_card['type'] == 'autre':
                return True  # Toute carte peut être jouée après une carte spéciale
            if played_card['type'] == 'color':
                if played_card['specification'] == card_to_play['specification']:
                    return True  # Carte de la même couleur
                elif card_to_play['type'] == 'special' or card_to_play['type'] == 'fuite' or card_to_play['type'] == 'autre':
                    return True  # Carte spéciale peut être jouée
                elif  all(self.get_card_by_id(c)['specification'] != played_card['specification'] for c in player.get_cards()):
                    return True  # Le joueur n'a pas de carte de la couleur demandée
                else:
                    print(f"Le joueur {player_uuid} doit jouer une carte de la couleur {played_card['specification']}.")
                    return False
        return True  # Si aucune règle n'est violée, la carte est légale

    def play_card(self, player_uuid: uuid.UUID, card: int) -> bool:
        if not self.is_card_legal(player_uuid, card, list(self.turn_cards.values())):
            return False
        self.turn_cards[player_uuid] = card
        self.players[player_uuid].remove_card(card)
        return True
    
    def change_turn_player_order(self,turn_winner_uuid: uuid.UUID) -> None:
        if turn_winner_uuid not in self.players:
            print(f"Joueur {turn_winner_uuid} non trouvé.")
            return
        winner_index = self.current_players_order.index(turn_winner_uuid)
        self.current_players_order = self.current_players_order[winner_index:] + self.current_players_order[:winner_index]
    
    def turn_winner(self) -> Optional[uuid.UUID]:

        turn_card_ids = list(self.turn_cards.values())
        turn_player_uuids = list(self.turn_cards.keys())
        turn_cards = [self.get_card_by_id(card_id) for card_id in turn_card_ids]

        winner_index = None
        counter = {'pirate': 0, 'sirene': 0, 'skull_king': 0}  # compteur de carte spéciale : pirate, sirène, skull_king

        for i in range(len(turn_cards)):

            if turn_cards[i]['type'] == 'fuite':
                continue

            if turn_cards[i]['type'] == 'autre':
                ## Cas de la baleine
                if turn_cards[i]['specification'] == 'baleine':
                    winner_index = max(
                        (j for j in range(len(turn_cards)) if turn_cards[j]['type'] == 'color'),
                        key=lambda j: turn_cards[j]['value'],
                        default=None
                    )
                    if winner_index is not None:
                        self.last_turn_winner = turn_player_uuids[winner_index]
                        turn_player_uuids[winner_index].increse_number_of_wins()
                        self.change_turn_player_order(self.last_turn_winner)
                        return turn_player_uuids[winner_index]
                    else:
                        self.last_turn_winner = turn_player_uuids[i]
                        self.change_turn_player_order(self.last_turn_winner)
                        return self.last_turn_winner
                ## Cas du kraken
                if turn_cards[i]['specification'] == 'kraken':
                    return None

            if winner_index is None:
                ## Premier joueur non fuite devient le gagnant provisoire
                winner_index = i

            else :
                if turn_cards[winner_index]['type'] == 'color':
                    if turn_cards[i]['type'] == 'color':
                        if turn_cards[winner_index]['specification'] == turn_cards[i]['specification']:
                            if turn_cards[winner_index]['value'] < turn_cards[i]['value']:
                                winner_index = i
                        elif turn_cards[i]['specification'] == 'noir' and turn_cards[winner_index]['specification'] != 'noir':
                            winner_index = i
                    if turn_cards[i]['type'] == 'special':
                        winner_index = i
                        counter[turn_cards[i]['specification']] += 1

                if turn_cards[winner_index]['type'] == 'special' and turn_cards[i]['type'] == 'special':

                    if turn_cards[i]['specification'] == 'pirate':
                        counter['pirate'] += 1
                        if turn_cards[winner_index]['specification'] == 'sirene' and counter['skull_king'] == 0:
                            winner_index = i
                    if turn_cards[i]['specification'] == 'skull_king':
                        counter['skull_king'] += 1
                        if turn_cards[winner_index]['specification'] == 'pirate' and counter['sirene'] == 0:
                            winner_index = i
                        elif turn_cards[winner_index]['specification'] == 'pirate' and counter['sirene'] == 1:
                            for j in range(len(turn_cards)):
                                if turn_cards[j]['specification'] == 'sirene':
                                    winner_index = j
                    if turn_cards[i]['specification'] == 'sirene':
                        counter['sirene'] += 1
                        if turn_cards[winner_index]['specification'] == 'skull_king' :
                            winner_index = i

        if winner_index is not None:
            self.last_turn_winner = turn_player_uuids[winner_index]
            self.players[self.last_turn_winner].increse_number_of_wins()
            self.change_turn_player_order(self.last_turn_winner)
            return turn_player_uuids[winner_index]
        else :
            self.last_turn_winner = turn_player_uuids[0]
            return turn_player_uuids[0]
