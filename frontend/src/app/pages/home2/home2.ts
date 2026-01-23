import { Component, inject, signal } from "@angular/core";
import { ws2Service } from "../../service/websocket/ws-2.service";
import { Navbar } from "../../components/navbar/navbar";
import { FormsModule } from "@angular/forms";

import { Game } from "../game/game";

@Component({
    selector: "home-2",
    templateUrl: './home2.html',
    styleUrls: ['./home2.css'],
    imports: [Navbar, FormsModule, Game]
})
export class Home2Component {

    wsService = inject(ws2Service)

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