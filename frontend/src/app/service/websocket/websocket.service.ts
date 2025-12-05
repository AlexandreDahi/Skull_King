import { Injectable } from '@angular/core';

import { IMessage, RxStomp, RxStompConfig } from "@stomp/rx-stomp";
import { Observable } from 'rxjs';


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


    private publicChannel  = new Observable<IMessage>()
    private privateChannel = new Observable<IMessage>()
    private lobbyChannel   = new Observable<IMessage>()


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

        this.publicChannel = this.rxStomp.watch({
            destination: `/topic/rooms/${this.roomUuid}`
        })

        this.privateChannel = this.rxStomp.watch({
            destination: `/user/queue/rooms/${this.roomUuid}`
        })

        // ✅ Ajouter /topic pour correspondre au backend
        this.lobbyChannel = this.rxStomp.watch({
            destination: `/topic/rooms/${this.roomUuid}/lobby-events`  // ← AJOUTER /topic
        })

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
}
