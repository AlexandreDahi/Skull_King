import numpy as np
import json

filename = 'C:/Users/adahi/Projects/Skull_king/backend_py/index_carte.json'

def create_players(number_of_players):
    players = {}
    for i in range(1, number_of_players + 1):
        players[f'player{i}'] = {'hand': [], 'id': i}
    return players


players = {'player1': {'hand': [],'id': 1}, 'player2': {'hand': [],'id': 2}, 'player3': {'hand': [],'id': 3}}

def add_player_hand(players,turn_number): ## or start_turn
    for player in players.values():
        player['hand'] = list(map(int, np.random.choice(range(1,74), size=turn_number, replace=False)))

turn = {'turn_result': [(57, 1),(60 ,2),(12 ,3),(73,4)]}

test = [1,5,64,35]

def get_card_by_id(card_id):
    with open(filename, "r") as f:
        cards = json.load(f)
    return cards.get(str(card_id))

def get_list_card_by_id(card_id_list):
    list_card = []
    for card in card_id_list:
        list_card.append(get_card_by_id(card))
    return list_card

def result_turn(turn):
    turn_card = [card[0] for card in turn['turn_result']]
    turn_player = [card[1] for card in turn['turn_result']]

    turn_card = get_list_card_by_id(turn_card)

    winner = None
    counter = {'pirate': 0, 'sirene': 0, 'skull_king': 0} # counter de carte spéciale : pirate, sirène, skull_king
    
    for i in range(len(turn_card)):
        if turn_card[i]['type'] == 'fuite':
            pass

        if turn_card[i]['type'] == 'autre':
            if turn_card[i]['specification'] == 'baleine':
                winner = max(
                    (j for j in range(len(turn_card)) if turn_card[j]['type'] == 'color'),
                    key=lambda j: turn_card[j]['value'],
                    default=None
                )
                if winner :
                    return(turn_player[winner])
                else :
                    return(turn_player[i])
            if turn_card[i]['specification'] == 'kraken':
                return(None)


        if winner is None:
            winner = i
        else :
            if turn_card[winner]['type'] == 'color':
                if turn_card[i]['type'] == 'color':
                    if turn_card[winner]['specification'] == turn_card[i]['specification']:
                        if turn_card[winner]['value'] < turn_card[i]['value']:
                            winner = i
                    if turn_card[i]['specification'] == 'noir':
                        winner = i
                if turn_card[i]['type'] == 'special':
                    winner = i
                    counter[turn_card[i]['specification']] += 1

            if turn_card[winner]['type'] == 'special' and turn_card[i]['type'] == 'special':

                if turn_card[i]['specification'] == 'pirate':
                    counter['pirate'] += 1
                    if turn_card[winner]['specification'] == 'sirene' and counter['skull_king'] == 0:
                        winner = i
                if turn_card[i]['specification'] == 'skull_king':
                    counter['skull_king'] += 1
                    if turn_card[winner]['specification'] == 'pirate' and counter['sirene'] == 0:
                        winner = i
                    elif turn_card[winner]['specification'] == 'pirate' and counter['sirene'] == 1:
                        for j in range(len(turn_card)):
                            if turn_card[j]['specification'] == 'sirene':
                                winner = j
                if turn_card[i]['specification'] == 'sirene':
                    counter['sirene'] += 1
                    if turn_card[winner]['specification'] == 'skull_king' :
                        winner = i
    return(turn_player[winner],turn_card[winner]['name'],turn_card)
                    


    return

if __name__ == "__main__":

    print(result_turn(turn))
    