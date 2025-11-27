import { Component } from '@angular/core';
import { PlaceBet } from '../../components/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/expandable-place-bet/expandable-place-bet';
import { Cards } from '../../components/cards/cards';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [Cards,CommonModule, PlaceBet, ExpandablePlaceBet],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  cardIds: number[] = [1, 0, 2, 3];

}
