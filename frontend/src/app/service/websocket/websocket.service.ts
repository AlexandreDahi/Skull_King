// import { Injectable } from '@angular/core';

// import { IMessage, RxStomp, RxStompConfig } from "@stomp/rx-stomp";
// import { Observable } from 'rxjs';


// @Injectable({
//   providedIn: 'root',
// })
// export class WebSocketService {


//     private config: RxStompConfig = {
//         brokerURL: "ws://localhost:8080/games",
//         reconnectDelay: 2000,
//         heartbeatIncoming: 10000,
//         heartbeatOutgoing: 10000,
//     }

//     private rxStomp = new RxStomp()

//     private roomUuid = ""
//     private playerUuid = ""
//     private playerToken = ""


    // private publicChannel  = new Observable<IMessage>()
    // private privateChannel = new Observable<IMessage>()
    // private lobbyChannel   = new Observable<IMessage>()


//     private activateWebSocket() {
//         this.rxStomp.configure(this.config)
//         this.rxStomp.activate()

//     } 

//     joinRoom(roomUuid: string, playerUuid: string, playerToken: string) {

//         if (!this.rxStomp.active) {
//             this.activateWebSocket()
//         }

//         this.roomUuid = roomUuid
//         this.playerUuid = playerUuid
//         this.playerToken = playerToken

        // this.publicChannel = this.rxStomp.watch({
        //     destination: `/app/rooms/${this.roomUuid}/`
        // })


        // this.privateChannel = this.rxStomp.watch({
        //     destination: `/app/rooms/${this.roomUuid}/users/${this.playerUuid}/${this.playerToken}`
        // })


        // this.lobbyChannel = this.rxStomp.watch({
        //     destination: `/app/rooms/${this.roomUuid}/lobby-events`
        // })

//     }


//     getPublicChannel() {
//         return this.publicChannel
//     }

    // getPrivateChannel() {
    //     return this.privateChannel
    // }

    // getLobbyChannel() {
    //     return this.lobbyChannel
    // }



    
   


// }