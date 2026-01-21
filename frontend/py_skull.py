import uuid
from dataclasses import dataclass
import random
import os


@dataclass(init=False)
class Player:

    player_uuid: uuid.UUID
    name: str
    hand: list[str]
    bet: int


    def __init__(self, name):
        self.player_uuid = uuid.uuid4()
        self.name = name
        self.hand = []
        self.bet = 0

def clear_terminal():
    #print("\033[H\033[J", end='')
    os.system("cls")

cards = [f"{color} {number}" for color in ("green", "yellow", "purple") for number in range(1, 15)]
players = [Player(name) for name in ("Player 1", "Player 2", "Player 3")]


random.shuffle(cards)


cards_per_player = 2

for player in players:

    player.hand = []

    for i in range(cards_per_player):
        player.hand.append(cards.pop(0))


for player in players:

    
    print(f"Turn to : {player.name}")
    input("[Press enter to reveal your hand]")
    clear_terminal()

    print(f"Turn to : {player.name}")
    print("Here's your hand : ", player.hand)
    bet = input("Indicate your bet : ")
    player.bet = int(bet)
    clear_terminal()

print("Here's the bets : ")
for player in players:
    print(f"{player.name} : {player.bet}")
input("[Press enter to continue]")
clear_terminal()


for turn_index in range(cards_per_player):
    print(f" -- Turn number {turn_index + 1} -- ")
    trick = []
    for player in players:
        print(f"Turn to : {player.name}")
        input("[Press enter to reveal your hand]")
        clear_terminal()

        print(f"Turn to : {player.name}")
        if len(trick) > 0: print("Here's what has been played : ")
        for i, card in enumerate(trick):
            print(f"   - {players[i].name} : {trick[i]}")


        print(f"{player.name} play a card : ")

        for i, card in enumerate(player.hand):
            print(f"  {i + 1}: {card}")

        choice = int(input("Your choice : "))

        trick.append(player.hand.pop(choice - 1))

        clear_terminal()


    winner = random.choice(players)
    print(f"{winner.name} wins the trick !")
    input("[Press enter to continue]")
