import { Injectable } from '@angular/core';
import { error } from 'console';


@Injectable({
  providedIn: 'root',
})
export class ws2Service {

    private websocket: WebSocket
    private newRoundMessage = undefined

    private onGameStartSubscribers:any[] = []
    private onNewRoundEventSubscribers:any[] = []

    constructor(){
        this.websocket = new WebSocket("ws://localhost:8000/ws")

        this.websocket.addEventListener("open", this.onOpenConnection)
        this.websocket.addEventListener("message", (event) => this.onMessage(event))
        this.websocket.addEventListener("error", (event) => this.onError(event))
    }

    onOpenConnection(){
        console.log("Websocket connection open")
    }

    onMessage(event: MessageEvent){

        const message = JSON.parse(event.data)
        console.log("Websocket event : ", message)

        switch (message.event){

            case "game_start":
                console.log("Game start !!!")

                for (const callback of this.onGameStartSubscribers) {
                    callback(message)
                }
                break
            
            case "new_round":
                console.log("New round start")

                this.newRoundMessage = message

                for (const callback of this.onNewRoundEventSubscribers) {
                    callback(this.newRoundMessage)
                }

                break
        }
    }

    onError(event: Event ){
        console.log("Websocket error : ", event)
    }

    onCloseConnection(){
        console.log("Websocket connection closed")
    }


    sendName(playerName: string){
        this.websocket.send(JSON.stringify({name: playerName}))
    }


    sendBet(player_bet: number) {
        this.websocket.send(JSON.stringify({
            event: "bet_transmission",
            bet: player_bet
        }))
    }

    sendCard(player_card: string) {
        this.websocket.send(JSON.stringify({
            event: "card_transmission",
            card: player_card,
        }))
    }

    onGameStartEvent(callback: any){
        this.onGameStartSubscribers.push(callback)
    }

    onNewRoundEvent(callback: any){

        this.onNewRoundEventSubscribers.push(callback)

        if (this.newRoundMessage !== undefined) {
            // Subscriber probably missed something
            // so we send them what we got
            callback(this.newRoundMessage)
        }

    }

}