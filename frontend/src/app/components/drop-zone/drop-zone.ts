import { Component, Output, EventEmitter } from '@angular/core';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './drop-zone.html',
  styleUrl: './drop-zone.css',
})
export class DropZone {

  @Output() cardDropped = new EventEmitter<number>();

  // les cartes réellement dans la drop-zone
  cardsInZone: number[] = [];

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer !== event.container) {
      const droppedCardId = event.item.data; // doit être l'ID
      console.log("Carte déposée dans la drop zone :", droppedCardId);

      this.cardsInZone.push(droppedCardId); // ajoute dans la zone
      this.cardDropped.emit(droppedCardId);
    }
  }
}