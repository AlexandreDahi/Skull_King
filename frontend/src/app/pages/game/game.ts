import { Component } from '@angular/core';
import { Cards } from '../../components/cards/cards';
import { CommonModule } from '@angular/common';
import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
@Component({
  selector: 'app-game',
  imports: [Cards,CommonModule,HeadUpDisplay ],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  cardIds: number[] = [1, 0, 2, 3];

}
