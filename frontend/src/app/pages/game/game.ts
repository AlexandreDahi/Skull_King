import { Component } from '@angular/core';
import { Cards } from '../../components/cards/cards';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [Cards,CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  cardIds: number[] = [1, 0, 2, 3];

}
