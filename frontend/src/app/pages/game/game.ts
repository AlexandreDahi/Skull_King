import { Component } from '@angular/core';
import { PlaceBet } from '../../components/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/expandable-place-bet/expandable-place-bet';
import { Hand } from '../../components/hand/hand';
import {OtherPlayers} from '../../components/other-players/other-players';
import { CommonModule } from '@angular/common';
import { OtherPlayers } from '../../components/other-players/other-players';

@Component({
  selector: 'app-game',
  imports: [Hand, CommonModule, PlaceBet, ExpandablePlaceBet, OtherPlayers ],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {


}
