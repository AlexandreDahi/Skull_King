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

  /** Les listes auxquelles cette drop-zone est connectée */
  @Input() connectedLists: string[] = [];

  /** Les cartes actuellement dans la drop-zone (ID de cartes) */
  cardsInZone: number[] = [];
    ngOnInit() {
      console.log("DropZone connectedLists =", this.connectedLists);
    }

    ngAfterViewInit() {
      console.log("Hand → connected to dropzone");
    }
  /** Gestion principale du drop */
  onDrop(event: CdkDragDrop<number[]>) {
    console.log("🔥 onDrop déclenché !", event);
  
    if (event.previousContainer === event.container) return;
    console.log("Dragged card ID (cdkDragData) :", event.item.data);
    console.log("From container data :", event.previousContainer.data);
    console.log("From index :", event.item.data.index);
    console.log("From Id :", event.item.data.id);
    
    // transfert exact de la carte sélectionnée
    transferArrayItem(
      event.previousContainer.data,
      event.container.data, 
      event.item.data.index, // L’index réel dans la main
      event.currentIndex      // La position dans la dropzone
    );

    console.log("DropZone → cartes :", this.cardsInZone);
  }
}
