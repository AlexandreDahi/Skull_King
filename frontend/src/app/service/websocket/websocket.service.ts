import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import cardData from '../../components/cards/index_carte.json';

import { cardNameToId, idToCardName } from '../mapCardFrontBack';


type RoomUpdateType = {
    host: string,
    players: { name: string, uuid: string }[]
}

@Injectable({
    providedIn: 'root',
})
export class webSocketService {

    private cardsInfo = cardData.index_carte

    private websocket: WebSocket
    private newRoundMessage = undefined
    private player_uuid: string = ""
    private players_list: { uuid: string, name: string }[] = []
    private is_host: boolean = false

    private onGameStartSubscribers: any[] = []
    private onNewRoundEventSubscribers: any[] = []
    private onCardPlayedSubscribers: any[] = []
    private onAskCardSubscribers: any[] = []
    private onBetRevealSubscribers: any[] = []
    private onRoundScoresSubscribers: any[] = []
    private onTrickWinnerSubscribers: any[] = []

    // Rooms data
    private callGetRoomsWhenConnected = false
    private roomUuid: string = ""
    private onJoinRoomAnswerSubscribers: any[] = []
    private onCreateRoomAnswerSubscribers: any[] = []

    public roomPlayers = new BehaviorSubject<RoomUpdateType>({host: "", players: []})
    public roomsList = new BehaviorSubject<{
        room_uuid: string,
        host_name: string,
        nb_players: number
    }[]
    >([])

    constructor() {
        this.websocket = this.initWebSocket()
    }

    private initWebSocket() {
        console.log("callGetRoomsWhenConnected (0): ", this.callGetRoomsWhenConnected)
        this.callGetRoomsWhenConnected = false
        console.log("callGetRoomsWhenConnected (1): ", this.callGetRoomsWhenConnected)
        const websocket = new WebSocket("ws://localhost:8000/ws")

        websocket.addEventListener("open", () => this.onOpenConnection())
        websocket.addEventListener("message", (event) => this.onMessage(event))
        websocket.addEventListener("error", (event) => this.onError(event))

        return websocket
    }

    onOpenConnection() {
        console.log("Websocket connection open")
        console.log("callGetRoomsWhenConnected (2): ", this.callGetRoomsWhenConnected)

        if (this.callGetRoomsWhenConnected) {
            this._getRooms()
            this.callGetRoomsWhenConnected = false
        }
    }

    onMessage(event: MessageEvent) {

        const message = JSON.parse(event.data)
        console.log("Websocket event : ", message)

        switch (message.event) {

            // -------- Room events ----------- //
            case "rooms_list_update":
                this.roomsList.next(message.rooms)
                break

            case "join_room_answer":

                if (message.status === "ok") {
                    this.player_uuid = message.me
                    this.is_host = false
                }


                for (const callback of this.onJoinRoomAnswerSubscribers) {
                    callback(message)
                }
                break

            case "room_update":

                this.roomPlayers.next(message)
                break

            case "room_creation_answer":

                if (message.status === "ok") {
                    this.is_host = true
                    this.player_uuid = message.host_uuid
                    this.roomUuid = message.room_uuid
                    this.players_list = [{ name: "Vous", uuid: message.host_uuid }]

                    this.roomPlayers.next({
                        host: message.host_uuid,
                        players: [{uuid: message.host_uuid, name: "Vous"}]
                    })

                }

                for (const callback of this.onCreateRoomAnswerSubscribers) {
                    callback(message)
                }
                break


            // -------- Game events ----------- //
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

    onError(event: Event) {
        console.log("Websocket error : ", event)
    }

    onCloseConnection() {
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

            if (card === card_front.name) {
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



    sendName(playerName: string) {

        const wsState = this.websocket.readyState

        if (wsState === this.websocket.CLOSED || wsState === this.websocket.CLOSING) {
            this.websocket = this.initWebSocket()
        }
        this.websocket.send(JSON.stringify({ name: playerName }))
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
            card: idToCardName.get(player_card),
        }))
    }

    onGameStartEvent(callback: any) {
        this.onGameStartSubscribers.push(callback)
    }

    onNewRoundEvent(callback: any) {

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


    // ---------- rooms function --------------------------

    isHost() {
        return this.is_host
    }

    createRoom() {
        this.websocket.send(JSON.stringify({
            event: "create_room",
        }))
    }

    onCreateRoomAnswer(callback: any) {
        this.onCreateRoomAnswerSubscribers.push(callback)
    }

    private _getRooms() {

        console.log("_get rooms appelé")
        this.websocket.send(JSON.stringify({
            event: "ask_rooms",
            subscribe: true
        }))
    }
    getRooms() {

        if (this.websocket.readyState === this.websocket.CONNECTING) {
            this.callGetRoomsWhenConnected = true
        }
        else {
            this._getRooms()
        }

    }

    joinRoom(room_uuid: string) {
        this.websocket.send(JSON.stringify({
            event: "join_room",
            room_uuid: room_uuid
        }))
    }

    onJoinRoomAnswer(callback: any) {
        this.onJoinRoomAnswerSubscribers.push(callback)
    }

    leaveRoom() {
        this.websocket.send(JSON.stringify({
            "event": "leave_room",
        }))
    }


    startGame() {
        this.websocket.send(JSON.stringify({
            "event": "launch_game"
        }))
    }

}