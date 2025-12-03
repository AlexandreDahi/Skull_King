import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
import { CdkDragDrop, moveItemInArray, CdkDragStart, CdkDragMove, CdkDragEnd, CdkDragEnter, CdkDragExit, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hand',
  imports: [CommonModule, Cards, DragDropModule],
  templateUrl: './hand.html',
  styleUrl: './hand.css'
})
export class Hand {

  cardIds: number[] = [57, 58, 59, 60, 61, 62, 63, 64, 65, 66];

  private radius = 800;       
  private stepAngleDeg = 5;  

  private arcAngleRad = this.ComputeArcRad(this.cardIds.length);
  private stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);

  draggingIndex: number | null = null;

  constructor() {
    console.log("🔥 HAND COMPONENT CHARGÉ !");
  }

  /* ---------------------------
     Calcul positions cartes sur l'arc
     --------------------------- */
  ComputeArcRad(length: number): number {
    return ((length - 1) * this.stepAngleDeg * Math.PI) / 180;
  }

  ComputeStepRad(stepDeg: number): number {
    return (stepDeg * Math.PI) / 180;
  }

  ComputeCardXIndex(i: number): number {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    return Math.round(Math.sin(angle) * this.radius) - 56;
  }

  ComputeCardYIndex(i: number): number {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    const y = Math.cos(angle) * this.radius;
    return Math.round(y - this.radius);
  }

  ComputeRotateTransform(i: number): string {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    return `rotate(${(angle * 180) / Math.PI}deg)`;
  }

  ComputeCardZIndex(i: number): number {
    return i + 1;
  }

  /* ---------------------------
     Hand drag events
     --------------------------- */
  onCdkDragStarted(event: CdkDragStart, index: number) {
    this.draggingIndex = index;
  }

  onCdkDragMoved(event: CdkDragMove, index: number) {}

  onCdkDragEnded(event: CdkDragEnd, index: number) {
    this.draggingIndex = null;
    this.resetCardPosition(index);
  }

  onCdkDragEntered(event: CdkDragEnter<number[]>, index: number) {}

  onCdkDragExited(event: CdkDragExit<number[]>, index: number) {}

  drop(event: CdkDragDrop<number[]>) {
    // La main ne réordonne que si drop dans la main
    if (event.previousContainer === event.container) {
      moveItemInArray(this.cardIds, event.previousIndex, event.currentIndex);
    }
    // Sinon (drop vers drop-zone) → ne rien faire
  }

  /* ---------------------------
     Utilitaires
     --------------------------- */
  resetCardPosition(index: number) {
    this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    this.stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);
  }

  removeCard(cardId: number) {
    const index = this.cardIds.indexOf(cardId);
    if (index !== -1) {
      this.cardIds.splice(index, 1);
      this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    }
  }
}
