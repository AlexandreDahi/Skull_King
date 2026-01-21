import json
import asyncio
import random
from websockets.asyncio.client import connect


class GameClient:

    NB_ROUNDS = 1

    def __init__(self):
        self.websocket = None
    
    async def send_name(self):

        name = "yolo"
        payload = json.dumps({"name": name})
        await self.websocket.send(payload)

        response = await self.websocket.recv()
        response =  json.loads(response) 
        if response["status"] == "error":
            raise ValueError(response["reason"])
        
    async def wait_start_game(self):
        payload = await self.websocket.recv()
        payload = json.loads(payload)

        if payload["event"] != "game_start":
            raise ValueError(f"Client was supposed to receive a game start signal but got : {payload}")

        self.me = payload["me"]
        self.players_list = payload["players"]

        print(f"players_list : {self.players_list}")

    async def wait_hand(self):

        payload = await self.websocket.recv()
        payload = json.loads(payload)

        if payload["event"] != "new_round":
            raise ValueError(f"Client was supposed to receive a new round signal but got : {payload}")

        print(payload)
        self.hand = payload["hand"]

    async def send_bet(self):
        await self.websocket.send(json.dumps({
            "event": "bet_transmission", 
            "bet": random.randint(0, 10)
        }))
    
    async def wait_bets(self):

        payload = await self.websocket.recv()
        payload = json.loads(payload)

        if payload["event"] != "bet_reveal":
            raise ValueError(f"Client was supposed to receive a bet reveal signal but got : {payload}")

        print(payload)

    async def wait_current_player(self):

        payload = await self.websocket.recv()
        payload = json.loads(payload)

        self.current_player = payload["current_player"]

    async def send_card(self):

        await self.websocket.send(json.dumps({
            "card": self.hand.pop()
        }))

    async def wait_card_played(self):

        payload = await self.websocket.recv()
        payload = json.loads(payload) 

        print(payload)
    
    async def wait_trick_winner(self):
        payload = await self.websocket.recv()
        payload = json.loads(payload)

        print("Winner of the trick is :", payload["winner"])

    async def mainloop(self):

        async with connect("ws://localhost:8000/ws") as websocket:
            self.websocket = websocket

            print("Connected to the server")

            await self.send_name()

            await self.wait_start_game()

            for _ in range(GameClient.NB_ROUNDS):

                await self.wait_hand()

                await self.send_bet()

                await self.wait_bets()

                for _ in range(len(self.hand)):
                    for _ in range(len(self.players_list)):

                        await self.wait_current_player()

                        if self.current_player == self.me:
                            await self.send_card()

                        await self.wait_card_played()

                    await self.wait_trick_winner()

            

if __name__ == "__main__":
    game_client = GameClient()
    asyncio.run(game_client.mainloop())
