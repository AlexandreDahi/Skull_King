import { Injectable } from '@angular/core';

import { IMessage, RxStomp, RxStompConfig } from "@stomp/rx-stomp";
import { Observable, ReplaySubject, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {


    private config: RxStompConfig = {
        brokerURL: "ws://localhost:8080/games",
        reconnectDelay: 2000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
    }

    private rxStomp = new RxStomp()

    private roomUuid = ""
    private playerUuid = ""
    private playerToken = ""
    private isPlayerAdmin = false


    private publicSubject  = new ReplaySubject<IMessage>(10)
    private privateSubject = new ReplaySubject<IMessage>(10)
    private lobbySubject   = new ReplaySubject<IMessage>(10)


    private publicChannel: Observable<IMessage>  = this.publicSubject.asObservable()
    private privateChannel: Observable<IMessage> = this.privateSubject.asObservable()
    private lobbyChannel: Observable<IMessage>   = this.lobbySubject.asObservable()

    private _publicSub?: Subscription
    private _privateSub?: Subscription
    private _lobbySub?: Subscription


    private activateWebSocket() {
        this.rxStomp.configure(this.config)
        this.rxStomp.activate()

    } 

    joinRoom(roomUuid: string, playerUuid: string, playerToken: string, isAdmin: boolean = false) {

        if (!this.rxStomp.active) {
            this.activateWebSocket()
        }

        this.roomUuid = roomUuid
        this.playerUuid = playerUuid
        this.playerToken = playerToken
        this.isPlayerAdmin = isAdmin

        console.log('🔌 WebSocket joinRoom:', {
            roomUuid,
            playerUuid,
            playerToken,
            isAdmin
        });

        const pubWatch = this.rxStomp.watch({
            destination: `/topic/rooms/${this.roomUuid}/general`
        })

        const privWatch = this.rxStomp.watch({
            destination: `/topic/rooms/${this.roomUuid}/${this.playerUuid}/${this.playerToken}`
        })

        // ✅ Ajouter /topic pour correspondre au backend
        const lobbyWatch = this.rxStomp.watch({
            destination: `/topic/rooms/${this.roomUuid}/lobby-events`  // ← AJOUTER /topic
        })

        // Clean up previous low-level subscriptions if any
        this._publicSub?.unsubscribe()
        this._privateSub?.unsubscribe()
        this._lobbySub?.unsubscribe()

        this._publicSub = pubWatch.subscribe(msg => this.publicSubject.next(msg))
        this._privateSub = privWatch.subscribe(msg => this.privateSubject.next(msg))
        this._lobbySub = lobbyWatch.subscribe(msg => this.lobbySubject.next(msg))

        console.log('✅ Channels configurés:');
        console.log('   - Public: /topic/rooms/' + this.roomUuid);
        console.log('   - Private: /user/queue/rooms/' + this.roomUuid);
        console.log('   - Lobby: /topic/rooms/' + this.roomUuid + '/lobby-events');
    }

    getPLayerUuid() {
        return this.playerUuid
    }



    getPublicChannel() {
        return this.publicChannel
    }

    getPrivateChannel() {
        return this.privateChannel
    }

    getLobbyChannel() {
        if (!this.rxStomp.active) {
            this.activateWebSocket()
        }
        
        return this.lobbyChannel
    }


    isAdmin(): boolean {
        return this.isPlayerAdmin
    }

    sendLobbyMessage(message: any) {
        console.log('📤 Envoi message lobby:', message);
        this.rxStomp.publish({
            destination: `/app/rooms/${this.roomUuid}/lobby`,
            body: JSON.stringify(message)
        })
    }


    sendStartGameSignal() {
        console.log("📤 Envoi du signal de début de partie au serveur.")

        this.rxStomp.publish({
            destination: `/app/rooms/${this.roomUuid}/start-game`,
            body: JSON.stringify({
                userUuid: this.playerUuid,
                userToken: this.playerToken,
            })
        })
    }
}
