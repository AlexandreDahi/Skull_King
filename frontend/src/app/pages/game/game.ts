import { Component } from '@angular/core';
import { PlaceBet } from '../../components/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/expandable-place-bet/expandable-place-bet';
import { Cards } from '../../components/cards/cards';

@Component({
  selector: 'app-game',
  imports: [PlaceBet,ExpandablePlaceBet,Cards],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {

}
