import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import data from './index_carte.json';

@Component({
  selector: 'app-cards',
  standalone: true,
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  imports: [DragDropModule],
})
export class Cards {

  @Input() id!: number;

  // Emet l'état du drag
  @Output() dragState = new EventEmitter<boolean>();

  // Nouveau : émet l'ID de la carte au drag start
  @Output() dragStartedCard = new EventEmitter<number>();

  isDragging = false;

  jsonData = data.index_carte;
  card: any;

  ngOnInit() {
    this.card = this.jsonData.find(c => c.id === this.id);
  }

  onDragStart() {
    this.isDragging = true;
    this.dragState.emit(true);

    // 🔥 log l'ID de la carte
    console.log("[Card] Drag started for card ID =", this.id);
    this.dragStartedCard.emit(this.id);
  }

  onDragEnd() {
    this.isDragging = false;
    this.dragState.emit(false);
    console.log("[Card] Drag ended for card ID =", this.id);
  }
}
