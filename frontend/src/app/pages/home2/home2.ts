import { Component, inject, signal } from "@angular/core";
import { webSocketService } from "../../service/websocket/websocket.service";
import { FormsModule } from "@angular/forms";

import { Game } from "../game/game";
import { Lobby } from "../lobby/lobby";
import { Room } from "../room/room";

@Component({
    selector: "home-2",
    templateUrl: './home2.html',
    styleUrls: ['./home2.css'],
    imports: [FormsModule, Game, Lobby, Room]
})
export class Home2Component {

    wsService = inject(webSocketService)

    players: {name: string, uuid: string}[] = []
    my_uuid: string = ""

    state = signal("lobby")

    playerName = 'pirate';

    joinGame(){

        this.wsService.onGameStartEvent( (data: any) => {
            this.state.set("game")
        } )

        this.wsService.sendName(this.playerName)

    }

    onGameStart(data: any) {

        this.state.set("game")
        this.players = data.players
        this.my_uuid = data.me

    }


    print_state(){
        console.log("state :" , this.state())
    }




}