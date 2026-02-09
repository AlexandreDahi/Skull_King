import { Component, input, effect } from '@angular/core';
import { Direction } from '../../../../service/direction.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-other-player',
  templateUrl: './other-player.html',
  imports:[CommonModule],
  styleUrls: ['./other-player.css'],
})
export class OtherPlayer {
  
  playerDisplayLocation: string = "init";
  player = input.required<{direction:Direction, uuid: string, name:string, bet?:number, obtained?:number, isAdmin?: boolean}>();
  playerName: string = "Player 1";
  valueObtained: number = 0;
  valueBetted: number = 0;
  specificDirectionclass:string = "";

  constructor() {
    // Utiliser effect() pour réagir aux changements du signal
    effect(() => {
      const playerData = this.player();
      this.playerDisplayLocation = this.getDirectionClass(playerData.direction);
      this.specificDirectionclass = this.playerDisplayLocation;
      this.playerName = playerData.name;
      this.valueBetted = playerData.bet || 0;
      this.valueObtained = playerData.obtained || 0;
    });
  }
  
  getDirectionClass(direction: Direction): string {
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
}
