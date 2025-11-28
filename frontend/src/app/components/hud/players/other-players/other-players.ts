import { Component,AfterViewInit} from '@angular/core';
import { OtherPlayer } from '../other-player/other-player';
import { Direction } from '../../../../service/direction.enum';
import { CommonModule,  } from '@angular/common';

@Component({
  selector: 'app-other-players',
  imports: [OtherPlayer, CommonModule],
  templateUrl: './other-players.html',
  styleUrls: ['./other-players.css'],
})
export class OtherPlayers 
{
  players: any[] = [];
  direction = Direction.Right;

  ngOnInit() {
    this.players = this.getPlayerList();
    this.setCss();
  }



  getPlayerList() {
    const listDirection = [];
    listDirection.push({ direction: null, name: "Player 1", bet: 5, obtained: 0 });
    listDirection.push({ direction: null, name: "Player 2", bet: 5, obtained: 3 });
    listDirection.push({ direction: null, name: "Player 2", bet: 5, obtained: 3 });
    listDirection.push({ direction: null, name: "Player 2", bet: 5, obtained: 3 });
    listDirection.push({ direction: null, name: "Player 2", bet: 5, obtained: 3 });
    listDirection.push({ direction: null, name: "Player 2", bet: 5, obtained: 3 });

    return listDirection;
  }
  getPlayersByClass(className: string): any[] {
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
    if (playerNumber == 1){
      this.players[0].direction = Direction.Top;
    }
    else{
      this.players[0].direction = Direction.Right;
      this.players[1].direction = Direction.Left;
    }
    this.players.forEach((player, index) => {
      if (index >= 2 && index <= 4) {
        this.players[index].direction = Direction.Top;
      }
      else if (index === 5  ) {
        this.players[index].direction = Direction.Left;
      }
      else if (index === 6){
        this.players[index].direction = Direction.Right;
      }
      else if (index !=0 && index !=1){
        console.log('too many players, WTF');
      }
    });
  }
}
