import { Component, Input } from '@angular/core';
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

  @Input() isMyTurn: boolean = true;

  onDrop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) return;

    const previous = event.previousContainer.data;
    const current = event.container.data;

    const removedCard = previous[event.item.data.index];
    previous.splice(event.item.data.index, 1);
    current.push(removedCard);
  }

}
