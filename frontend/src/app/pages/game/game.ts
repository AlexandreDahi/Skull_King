import { Component } from '@angular/core';
import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { DropZone } from '../../components/drop-zone/drop-zone';
import { Hand } from '../../components/hand/hand';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [Hand,CommonModule , HeadUpDisplay, DropZone],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  handCards: number[] = [57, 58, 59, 62, 64, 65, 66, 70, 71, 72];
  dropZoneCards: number[] = [];

  onCardPlayed(cardId: number) {
    // Ajouter la carte à la drop zone
    this.dropZoneCards.push(cardId);

    // Retirer la carte de la main
    const index = this.handCards.indexOf(cardId);
    if (index > -1) {
      this.handCards.splice(index, 1);
    }
  }
}
