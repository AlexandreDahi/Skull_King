import { Component, inject} from '@angular/core';
import { OtherPlayer } from '../other-player/other-player';
import { Direction } from '../../../../service/direction.enum';
import { CommonModule,  } from '@angular/common';
import { webSocketService } from '../../../../service/websocket/websocket.service';


@Component({
  selector: 'app-other-players',
  imports: [OtherPlayer, CommonModule],
  templateUrl: './other-players.html',
  styleUrls: ['./other-players.css'],
})
export class OtherPlayers 
{ 
  wsService = inject(webSocketService)
  players: {uuid: string, direction: Direction}[] = []

  ngOnInit() {

    this.players = this.getPlayerList()
    this.setCss()
  }



  getPlayerList() {
    const listDirection = [];

    const players_list = this.wsService.getPlayersName()

    for (const player of players_list) {
      listDirection.push({
        direction: Direction.Bottom, 
        uuid: player.uuid, 
      })
    }


    return listDirection;
  }
  getPlayersByClass(className: string) {
    return this.players.filter(player => this.getDirectionClass(player.direction) === className);
  }
  getDirectionClass(direction:Direction): string {
    switch (direction) {  
      case Direction.Top:
        return 'top-player';
      case Direction.Left:
        return 'left-player';
      case Direction.Right:
        return 'right-player';
      default:
        return '';
    }
  }
  setCss() {
    const playerNumber = this.players.length;

    // Compute how many players go to left, top and right
    const n = Math.trunc(playerNumber / 3)

    let repartition: [number, number, number] // [left players, top players, right players]

    if (playerNumber % 3 === 0) {
      repartition = [n, n, n]

    } else if (playerNumber % 3 === 1) {
      repartition = [n, n + 1, n]

    } else {
      repartition = [n + 1, n, n + 1]
    }

    // Assign each player its position
    let index = 0

    for (let i=0; i<repartition[0]; i++) {
      this.players[index].direction = Direction.Left
      index++
    }

    for (let i=0; i<repartition[1]; i++) {
      this.players[index].direction = Direction.Top
      index++
    }

    for (let i=0; i<repartition[2]; i++) {
      this.players[index].direction = Direction.Right
      index++
    }

  }
}
