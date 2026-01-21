from uuid import UUID, uuid4
import random

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

app = FastAPI()

class Player:

    def __init__(self, name: str, websocket: WebSocket):

        self.name: str = name
        self.uuid: UUID = uuid4()
        self.websocket: WebSocket = websocket
        self.hand: list[str] = []
        self.bet: int = 0
        self.trick_won: int = 0
        self.score: int = 0

class Turn:

    def __init__(self):

        self.trick: list[tuple[UUID, str]] = []
        self.winner: Player = None

    def compute_winner(self):

        asked_color, best_num = self.trick[0][1].split(' ')
        winner = self.trick[0][0]

        for uuid, card in self.trick:
            
            color, num = card.split(' ')

            if color != asked_color:
                continue

            if num > best_num:
                winner = uuid
                best_num = num

        self.winner = winner


class Round:

    def __init__(self):

        self.turns: list[Turn] = []

        self.bets: dict[UUID, int] = {}
        self.scores: dict[UUID, int] = {}


    def compute_scores(self):

        players = [uuid for uuid in self.bets.keys() ] # somewhat hacky
        nb_cards = len(self.turns)

        tricks_won = {}
        for uuid in players:
            tricks_won[uuid] = 0

        for turn in self.turns:
            tricks_won[turn.winner] += 1

        for uuid in players:

            bet, won = self.bets[uuid], tricks_won[uuid]

            if bet == won:

                if bet == 0:
                    score = 10 * nb_cards
                else:
                    score = 20 * bet

            else:

                if bet == 0:
                    score = -10 * nb_cards
                else:
                    score = -10 * abs(bet - won)

            self.scores[uuid] = score
        
class Game:

    NB_ROUNDS = 1

    def __init__(self):

        self.start_event = asyncio.Event()
        self.websocket_keep_alive = asyncio.Event()
        self.cards: list[str] = self.new_cards_stack()
        self.players_list: list[Player] = []

        self.game_loop_launched = False
        self.cards_per_hand = 3
        self.trick_winner_list: list[Player] = []

        self.rounds: list[Round] = []

       


    def new_cards_stack(self):
        return [f"{color} {number}" for color in ("green", "yellow", "purple") for number in range(1, 15)]

    def create_hands(self, cards_per_player: int):


        self.cards = self.new_cards_stack()
        random.shuffle(self.cards)

        for player in self.players_list:

            player.hand = []

            for _ in range(cards_per_player):
                player.hand.append(self.cards.pop(0))


    def add_player(self, player: Player):
        self.players_list.append(player)

        if len(game.players_list) >= 2: # Start the game
            game.start_event.set()


    def get_current_trick(self):
        return self.rounds[-1].turns[-1].trick
    
    def get_current_turn(self):
        return self.rounds[-1].turns[-1]
    
    def get_current_round(self):
        return self.rounds[-1]


    async def game_loop(self):

        print("Game loop launched !")

        await self.start_event.wait()
        print("Game started !")

        print("Sending the list of players")
        await self.send_players_list()
        

        for k in range(Game.NB_ROUNDS):

            self.cards_per_hand = k + 1
            self.rounds.append(Round())

            self.create_hands(self.cards_per_hand)

            print("Sending hands ...")
            await self.send_hands()

            print("Waiting bets ...")
            await self.wait_bets()

            print("Sending bets...")
            await self.send_bets()


            for _ in range(self.cards_per_hand):
                await self.play_turn()


        self.websocket_keep_alive.set()
            
    async def play_turn(self):

        self.get_current_round().turns.append(Turn())
        
        for player in self.players_list:
            
            self.current_player = player

            await self.send_current_player(player)

            await self.wait_card(player)

            await self.send_card_played()


        self.get_current_turn().compute_winner()
        print(f"End of turn; trick : {self.get_current_trick()}, winner : {self.get_current_turn().winner}")
        await self.send_trick_winner()


    async def send_players_list(self):

        players_dto = [{
            "uuid": str(player.uuid), 
            "name": player.name
        } for player in game.players_list]
        tasks = []

        for player in self.players_list:

            async_func = player.websocket.send_json({
                "event": "game_start",
                "players": players_dto,
                "me": str(player.uuid),
            })
            tasks.append(async_func)

        await asyncio.gather(*tasks)


    async def send_hands(self):

        tasks = []

        for player in self.players_list:


            async_func = player.websocket.send_json({
                "event": "new_round",
                "hand": player.hand
            })

            tasks.append(async_func)

        await asyncio.gather(*tasks)


    async def _wait_bet(self, player: Player):
        """Helper function for wait_bets"""

        timeout = False
        try:
            async with asyncio.timeout(30):
                payload = await player.websocket.receive_json()
        except TimeoutError:
            timeout = True

        if timeout:
            bet = 1
        else:
            bet = payload["bet"]


        self.get_current_round().bets[player.uuid] = bet


    async def wait_bets(self):

        tasks = []

        for player in self.players_list:
            async_func = self._wait_bet(player)
            tasks.append(async_func)

        await asyncio.gather(*tasks)


    async def send_bets(self):
        tasks = []
        bets = [
            {
                "uuid": str(player.uuid), 
                "bet": player.bet
            } for player in game.players_list
        ]

        for player in self.players_list:
            async_func = player.websocket.send_json({
                "event": "bet_reveal",
                "bets": bets
            })
            tasks.append(async_func)
            
        await asyncio.gather(*tasks)


    async def send_current_player(self, current_player: Player):

        tasks = []
        payload = {
            "event": "ask_card",
            "current_player": str(current_player.uuid),
        }

        for player in self.players_list:
            async_func = player.websocket.send_json(payload)
            tasks.append(async_func)

        await asyncio.gather(*tasks)


    async def wait_card(self, current_player: Player):

        try:
            async with asyncio.timeout(30):
                payload = await current_player.websocket.receive_json()

            card = payload["card"]
        except TimeoutError:
            card = None


        try:
            self.current_player.hand.remove(card)
            card_played = card

        except ValueError:
            card_played = self.current_player.hand.pop()

        self.get_current_trick().append(
            (current_player.uuid, card_played)
        )
       

    async def send_card_played(self):

        tasks = []
        payload = {
            "event": "card_played",
            "card": self.get_current_trick()[-1]
        }

        for player in self.players_list:
            async_func = player.websocket.send_json(payload)
            tasks.append(async_func)

        await asyncio.gather(*tasks)

        print(f"Player {player.uuid} played {self.get_current_trick()[-1]}")


    async def send_trick_winner(self):


        winner = self.get_current_turn().winner

        payload = {
            "event": "trick_winner",
            "winner": str(winner.uuid)
        }

        tasks = [
            player.websocket.send_json(payload) for player in self.players_list
        ]
        await asyncio.gather(*tasks)



game = Game()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
   
    if game.start_event.is_set():
        # Too late, the game has already started
        await websocket.send_denial_response()
        return
    
    if not game.game_loop_launched:
        game.game_loop_launched = True
        asyncio.create_task(game.game_loop())
    
    await websocket.accept()
    print("Connection accepted")

    try:
        # 1 : Client send player's name
        data = await websocket.receive_json()

        if "name" in data and isinstance(data["name"], str):
            await websocket.send_json({"status": "ok"})
        
        else:
            print("Bad payload : ", data)
            await websocket.send_json({
                "status": "error", 
                "reason": "No name provided or not as a string"
            })

        player = Player(data["name"], websocket)
        game.add_player(player)

        await game.websocket_keep_alive.wait()

           

    except WebSocketDisconnect:
        pass