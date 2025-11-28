import { Component,ViewChild  } from '@angular/core';
import { Hand } from '../../components/hand/hand';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
@Component({
  selector: 'app-game',
  imports: [Cards,CommonModule],
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
