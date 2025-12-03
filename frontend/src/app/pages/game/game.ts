import { Component,ViewChild  } from '@angular/core';
import { PlaceBet } from '../../components/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/expandable-place-bet/expandable-place-bet';
import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import { TestDrop } from '../../components/test-drop/test-drop';  
import {OtherPlayers} from '../../components/other-players/other-players';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-game',
  imports: [Hand, CommonModule, PlaceBet, ExpandablePlaceBet, OtherPlayers , DropZone, TestDrop],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  // accès à la main (via @ViewChild)
  @ViewChild(Hand) hand!: Hand;

  onCardDropped(cardId: number) {
    console.log("Carte déposée :", cardId);
    
  }

}
