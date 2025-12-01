import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
import { DragDropModule } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-hand',
  imports: [CommonModule,Cards, DragDropModule],
  templateUrl: './hand.html',
  styleUrl: './hand.css',
})
export class Hand {
  // Liste des IDs des cartes dans la main (ordre = position)
  cardIds: number[] = [1,2,3,2,1,0,4,4,1];

  private radius = 700;       // change pour arrondir plus/moins en px
  private stepAngleDeg = 7;  // écart angulaire entre chaque carte en degrés

  ComputeArcRad(card_id_lenght:number): number {
    return ((card_id_lenght-1)*this.stepAngleDeg* Math.PI) / 180;
  }
  ComputeStepRad(stepAngleDeg:number): number {
    return (stepAngleDeg * Math.PI) / 180;
  }
  private arcAngleRad = this.ComputeArcRad(this.cardIds.length);
  private stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);
 
  ComputeCardXIndex(i: number): number {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    return Math.round(Math.sin(angle) * this.radius);
  }

  ComputeCardYIndex(i: number): number {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    // Position verticale (profondeur de l’arc)
    const y = Math.cos(angle) * this.radius;

    // Normalisation : la carte la plus basse = 0px
    return Math.round(y - this.radius);
  }

  ComputeRotateTransform(i: number): string {
    const angle = -this.arcAngleRad / 2 + i * this.stepAngleRad;
    // inclinaison liée à l'angle de l'arc
    return `rotate(${(angle * 180) / Math.PI}deg)`;
  }

  draggingIndex: number | null = null;
  onDragStateChange(index: number, dragging: boolean) {
    this.draggingIndex = dragging ? index : null;
  }

  removeCard(cardId: number) {
    const index = this.cardIds.indexOf(cardId);
    if (index !== -1) {
      this.cardIds.splice(index, 1);
      
      // recalcul de l’arc
      this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    }
  }
}