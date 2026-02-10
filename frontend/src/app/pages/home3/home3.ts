import { Component, inject, signal } from "@angular/core";
import { webSocketService } from "../../service/websocket/websocket.service";

import { Game } from "../game/game";
import { Lobby } from "../lobby/lobby";
import { RoomListComponent } from "../room-list/room-list";

@Component({
    selector: "home-3",
    templateUrl: './home3.html',
    styleUrls: ['./home3.css'],
    imports: [Game, Lobby, RoomListComponent]
})
export class Home3Component {

    wsService = inject(webSocketService)

    
    appState = signal("inRoomsList")


}