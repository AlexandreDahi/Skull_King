import { Injectable } from '@angular/core';


import cardData from '../../components/cards/index_carte.json';

import { cardNameToId, idToCardName } from '../mapCardFrontBack';


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
        this.websocket = this.initWebSocket()
    }

    private initWebSocket() {
        const websocket = new WebSocket("ws://localhost:8000/ws")

        websocket.addEventListener("open", this.onOpenConnection)
        websocket.addEventListener("message", (event) => this.onMessage(event))
        websocket.addEventListener("error", (event) => this.onError(event))

        return websocket
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
                
                // Cards conversion
                const front_hand = this.convertBackendCardsToFront(message.hand).sort((a, b) => a - b)
                console.log("------------ cartes triées : ", front_hand)
                message.hand = front_hand

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

                const front_card = cardNameToId.get(message.card)
                message.card = front_card

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
        this.websocket.removeEventListener("open", this.onOpenConnection)
        this.websocket.removeEventListener("message", this.onMessage)
        this.websocket.removeEventListener("close", this.onCloseConnection)
    }

    private convertBackendCardsToFront(cards: string[]) {
        return cards
            .map(card_back => cardNameToId.get(card_back))
            .filter(id => id !== undefined);
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

        const wsState = this.websocket.readyState

        if (wsState === this.websocket.CLOSED || wsState === this.websocket.CLOSING) {
             this.websocket = this.initWebSocket()
        }
        this.websocket.send(JSON.stringify({name: playerName}))
    }


    sendBet(player_bet: number) {
        this.websocket.send(JSON.stringify({
            event: "bet_transmission",
            bet: player_bet
        }))
    }

    sendCard(player_card: number) {
        this.websocket.send(JSON.stringify({
            event: "card_transmission",
            card: idToCardName.get(player_card) ,
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