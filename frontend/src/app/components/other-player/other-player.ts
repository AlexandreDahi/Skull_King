import { Component, input } from '@angular/core';
import { Direction } from '../../service/direction.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-other-player',
  templateUrl: './other-player.html',
  imports:[CommonModule],
  styleUrls: ['./other-player.css'],
})
export class OtherPlayer {
  
  playerDisplayLocation: string = "init";
  player = input.required<{direction:Direction,name:string,bet:number,obtained:number}>();
  playerName: string = "Player 1";
  valueObtained: number = 0;
  valueBetted: number = 0;
  specificDirectionclass:string = "";
  constructor() {
  }

  ngOnInit() {
    this.playerDisplayLocation = this.getDirectionClass();
    this.specificDirectionclass = this.playerDisplayLocation;
    this.playerName = this.player().name;
    this.valueBetted = this.player().bet;
    this.valueObtained = this.player().obtained;
  }
  
  getDirectionClass(): string {
    switch (this.player().direction) {  
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
