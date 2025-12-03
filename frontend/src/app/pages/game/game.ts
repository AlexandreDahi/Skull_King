import { Component } from '@angular/core';
import { PlaceBet } from '../../components/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/expandable-place-bet/expandable-place-bet';
import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import {OtherPlayers} from '../../components/other-players/other-players';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-game',
  imports: [Hand, CommonModule, PlaceBet, ExpandablePlaceBet, OtherPlayers , DropZone],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {

}
