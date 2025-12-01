import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cards } from '../../components/cards/cards';
import {CdkDrag,CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-hand',
  imports: [CommonModule, Cards, CdkDrag, CdkDropList, DragDropModule],
  templateUrl: './hand.html',
  styleUrl: './hand.css'
})
export class Hand {
  // Liste des IDs des cartes dans la main (ordre = position)
  cardIds: number[] = [70,71,72,73];

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
    console.log('dragging', dragging);
    if (dragging) {
      this.draggingIndex = index;
    } else {
      // drag terminé → remettre la carte à sa position
      this.draggingIndex = null;
      this.resetCardPosition(index);
    }
  }

  moveElement<T>(array: T[], selceted_card_id: number, hoovered_card_id: number): T[] {
    const element = array.splice(selceted_card_id, 1)[0]; // retire l'élément
    array.splice(hoovered_card_id, 0, element);             // insère à la nouvelle position
    return array;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cardIds, event.previousIndex, event.currentIndex);
    console.log('new order', this.cardIds);
  }


  resetCardPosition(index: number) {
    // Ici tu recalcules les positions initiales
    // ou tu forces Angular à recalculer via le binding
    this.arcAngleRad = this.ComputeArcRad(this.cardIds.length);
    this.stepAngleRad = this.ComputeStepRad(this.stepAngleDeg);
    this.ComputeCardXIndex(index);
    this.ComputeCardYIndex(index);
    this.ComputeRotateTransform(index);
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