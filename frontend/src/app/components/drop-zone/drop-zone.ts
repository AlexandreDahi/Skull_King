import { Component, EventEmitter, Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Cards } from '../cards/cards';

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  imports: [CommonModule, DragDropModule, Cards],
  templateUrl: './drop-zone.html',
  styleUrl: './drop-zone.css',
})
export class DropZone {
  @Input() cardsInZone: number[] = [];
  @Input() connectedLists: string[] = [];

  @Input() isMyTurn: boolean = false; 

  // @Output() cardPlayedEvent = new EventEmitter<number>();
  @Output() playCardEvent = new EventEmitter<number>();

  onDrop(event: CdkDragDrop<number[]>) {
    console.log('OnDrop event POULOULOU:', event);
    if (event.previousContainer !== event.container) {
      const cardId = event.item.data.id; // récupérer l'ID depuis cdkDragData
      // Émettre l'événement
      this.playCardEvent.emit(cardId);
      console.log('Carte jouée avec ID:', cardId);
    }
  }

}
