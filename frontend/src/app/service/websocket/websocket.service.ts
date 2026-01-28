import { Injectable } from '@angular/core';


import cardData from '../../components/cards/index_carte.json';


@Injectable({
  providedIn: 'root',
})
export class webSocketService {

    private cardsInfo = cardData.index_carte

    private websocket: WebSocket
    private newRoundMessage = undefined
    private player_uuid: string = ""
    private players_list: {uuid: string, name: string}[] = []

    private onGameStartSubscribers:any[] = []
    private onNewRoundEventSubscribers:any[] = []
    private onCardPlayedSubscribers:any[] = []
    private onAskCardSubscribers: any[] = []
    private onBetRevealSubscribers: any[] = []
    private onRoundScoresSubscribers: any[] = []
    private onTrickWinnerSubscribers: any[] = []

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

                this.player_uuid = message.me
                this.players_list = message.players

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

            case "bet_reveal":
                console.log("bet reveal")

                for (const callback of this.onBetRevealSubscribers) {
                    callback(message)
                }

                break

            case "ask_card":
                console.log("Card asked")
                
                for (const callback of this.onAskCardSubscribers) {
                    callback(message)
                }

                break

            case "card_played":
                console.log("Card played")

                for (const callback of this.onCardPlayedSubscribers) {
                    callback(message)
                }
                break
            
            case "trick_winner":
                console.log("End of trick")

                for (const callback of this.onTrickWinnerSubscribers) {
                    callback(message)
                }
                break
            
            case "round_scores":
                console.log("End of round")
                
                for (const callback of this.onRoundScoresSubscribers) {
                    callback(message)
                    break
                }

        }
    }

    onError(event: Event ){
        console.log("Websocket error : ", event)
    }

    onCloseConnection(){
        console.log("Websocket connection closed")
    }

    convertCardNameFromBackToFront(card: string) {
        const [color, number] = card.split(' ')

        let color_front
        switch (color) {
          case "purple":
            color_front = "violet"
            break
          case "green":
            color_front = "vert"
            break
          case "yellow":
            color_front = "jaune"
            break
          case "black":
            color_front = "noir"
            break
          
        }

        return number + ' ' + color_front
    }

    getCardIdFromCardName(card: string) {
        for (const card_front of this.cardsInfo) {

          if (card === card_front.name){
            return card_front.id
          }
        }

        return undefined
    }

    getPlayerUuid() {
        return this.player_uuid
    }

    getPlayersName() {
        return this.players_list
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

    onBetRevealEvent(callback: any) {
        this.onBetRevealSubscribers.push(callback)
    }

    onAskCardEvent(callback: any) {
        this.onAskCardSubscribers.push(callback)
    }

    onCardPlayed(callback: any) {
        this.onCardPlayedSubscribers.push(callback)
    }

    onTrickWinner(callback: any) {
        this.onTrickWinnerSubscribers.push(callback)
    }
    
    onRoundScores(callback: any) {
        this.onRoundScoresSubscribers.push(callback)
    }

    

}