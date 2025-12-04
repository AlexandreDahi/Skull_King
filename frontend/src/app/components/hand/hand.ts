import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
import {
  CdkDragDrop,
  CdkDragStart,
  DragDropModule
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hand',
  imports: [CommonModule, Cards, DragDropModule],
  templateUrl: './hand.html',
  styleUrl: './hand.css'
})
export class Hand {

  @Input() cardIds: number[] = [];
  @Input() nonPlayableCardIds: number[] = [];

  draggingIndex: number | null = null;

  @Output() playCardEvent = new EventEmitter<number>();
  @Output() errorEvent = new EventEmitter<string>();

  flyingCardId: number | null = null;

  /* ---------------------------
     Calcul positions cartes sur l'arc
     --------------------------- */
  computeArcTransform(i: number): string {
    const n = this.cardIds.length;

    if (n === 1) {
      return `translate(0,0) rotate(0deg)`;
    }
    // index centré sur 0
    const center = (n - 1) / 2;
    const offset = i - center;

    // Chevauchement constant
    const overlap = -40; // px de translation horizontale (carte suivante avance un peu)
    const curveStrength = -3; // Courbure verticale
    const rotationStrength = 5; // Rotation légère

    const x = offset * overlap ;
    const y = Math.pow(offset, 2) * -curveStrength +50; // courbe douce en U
    const rotation = offset * rotationStrength;

    return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
  }

  /* ---------------------------
     Hand drag events
     --------------------------- */
  onCdkDragStarted(event: CdkDragStart, index: number) {
    this.draggingIndex = index;
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer !== event.container) {
      // Drop vers dropzone
      const card = this.cardIds[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.push(card);
    }
  }

  /* ---------------------------
     Double click events
     --------------------------- */
  playCard(index: number, event: MouseEvent) {
    const cardId = this.cardIds[index];

    if (this.nonPlayableCardIds.includes(cardId)) {
      this.errorEvent.emit('Carte non jouable !');
      return;
    }

    // récupérer la position de la carte
    const cardElement = (event.target as HTMLElement).closest('.card-on-arc') as HTMLElement;
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();

    // appliquer l’animation
    this.flyingCardId = cardId;
    cardElement.style.position = 'fixed';
    cardElement.style.left = `${rect.left}px`;
    cardElement.style.top = `${rect.top}px`;
    cardElement.style.transition = 'all 0.5s ease-in-out';

    const dropZone = document.getElementById('dropzone');
    if (!dropZone) return;
    const dzRect = dropZone.getBoundingClientRect();

    const deltaX = dzRect.left + dzRect.width / 2 - rect.left - rect.width / 2;
    const deltaY = dzRect.top + dzRect.height / 2 - rect.top - rect.height / 2;

    // lancer l’animation
    requestAnimationFrame(() => {
      cardElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.8) rotate(0deg)`;
    });

    // après l’animation, mettre à jour les tableaux
    setTimeout(() => {
      this.cardIds.splice(index, 1);
      this.playCardEvent.emit(cardId);
      this.flyingCardId = null;
    }, 500); // durée = 0.5s
  }

  
}
