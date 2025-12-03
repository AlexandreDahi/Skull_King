import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDragStart,
  CdkDragMove,
  CdkDragEnd,
  DragDropModule
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hand',
  imports: [CommonModule, Cards, DragDropModule],
  templateUrl: './hand.html',
  styleUrl: './hand.css'
})
export class Hand {

  cardIds: number[] = [57, 58, 59, 62, 63, 64, 65, 66];

  private radius = 900;       
  private stepAngleDeg = 4;  

  private arcAngleRad = this.ComputeArcRad(this.cardIds.length);
  private stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);

  draggingIndex: number | null = null;

  /* ---------------------------
     Calcul positions cartes sur l'arc
     --------------------------- */
  ComputeArcRad(length: number): number {
    return ((length - 1) * this.stepAngleDeg * Math.PI) / 180;
  }

  ComputeStepRad(stepDeg: number): number {
    return (stepDeg * Math.PI) / 180;
  }

  // ComputeCardXIndex(i: number): number {
  //   const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
  //   return Math.round(Math.sin(angle) * this.radius) - 56;
  // }

  // ComputeCardYIndex(i: number): number {
  //   const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
  //   const y = Math.cos(angle) * this.radius;
  //   return Math.round(y - this.radius);
  // }

  // ComputeRotateTransform(i: number): string {
  //   const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
  //   return `rotate(${(angle * 180) / Math.PI}deg)`;
  // }

computeArcTransform(i: number): string {
  const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;

  // rayon horizontal/vertical pour contrôler la forme de l'éventail
  const radiusX = -300;  // contrôle l'espacement horizontal
  const radiusY = 150;  // contrôle la hauteur de l'arc (plus petit = plus serré)

  // position relative de la carte
  const x = Math.sin(angle) * radiusX;
  const y = Math.cos(angle) * radiusY ; // le "-" inverse le U pour qu’il pointe vers le bas

  // rotation de la carte
  const rotation = (angle * 180) / Math.PI;

  return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
}
  /* ---------------------------
     Hand drag events
     --------------------------- */
  onCdkDragStarted(event: CdkDragStart, index: number) {
    this.draggingIndex = index;
  }

  onCdkDragMoved(event: CdkDragMove, index: number) {
    // Optionnel : tu peux utiliser event.pointerPosition pour suivi personnalisé
  }

  onCdkDragEnded(event: CdkDragEnd, index: number) {
    // Reset de la position de la carte dans l’éventail
    this.draggingIndex = null;
    this.recalculateArc();
    console.log("Drag ended for card index:", index); 
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
     Recalcul arc pour toutes les cartes
     --------------------------- */
  recalculateArc() {
    this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    this.stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);
  }

}
